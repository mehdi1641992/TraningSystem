// Optional live smoke test using an installed Chromium browser and Node 24.
// BROWSER_PATH must point to Chrome or Edge. No browser automation dependency.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const browserPath = process.env.BROWSER_PATH;
assert(browserPath && fs.existsSync(browserPath), 'Set BROWSER_PATH to an installed Chrome/Edge executable');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'training-browser-'));
const server = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '4178', '--strictPort'], { cwd: root, stdio: 'ignore' });
const browser = spawn(browserPath, ['--headless=new', '--no-first-run', '--remote-debugging-port=9234', '--remote-allow-origins=http://localhost', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function wait(fn) { for (let i = 0; i < 100; i++) { try { const value = await fn(); if (value) return value; } catch {} await pause(100); } throw Error('Timed out waiting for browser/server'); }
let socket;
try {
  await wait(async () => (await fetch('http://127.0.0.1:4178/TraningSystem/')).ok);
  const target = await wait(async () => (await (await fetch('http://127.0.0.1:9234/json')).json()).find(t => t.type === 'page'));
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let serial = 0;
  const pending = new Map(), errors = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    const task = pending.get(message.id);
    if (task) { pending.delete(message.id); clearTimeout(task.timer); message.error ? task.reject(Error(message.error.message)) : task.resolve(message.result); }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++serial;
    const timer = setTimeout(() => { pending.delete(id); reject(Error('CDP timeout: ' + method)); }, 10000);
    pending.set(id, { resolve, reject, timer }); socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true });
    assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await send('Runtime.enable');
  for (const page of ['admin', 'participant']) {
    await send('Page.navigate', { url: `http://127.0.0.1:4178/TraningSystem/demo/${page}.html` });
    await wait(() => evaluate("document.querySelectorAll('#nav a').length > 0"));
    const links = await evaluate("[...document.querySelectorAll('#nav a')].map(a => a.hash)");
    for (const hash of links) {
      await evaluate(`document.querySelector('#nav a[href="${hash}"]').click()`);
      await wait(() => evaluate(`document.querySelector('section.view.active')?.id === 'v-${hash.slice(1)}'`));
      assert.equal(await evaluate("[...document.querySelectorAll('section.view')].filter(v => getComputedStyle(v).display !== 'none').length"), 1);
    }
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    assert(await evaluate("document.getElementById('nav').getBoundingClientRect().height > 0"), 'Mobile navigation hidden');
    await send('Emulation.clearDeviceMetricsOverride');
    console.log(`OK browser ${page}: ${links.length} navigation clicks and mobile navigation`);
  }
  await send('Page.navigate', { url: 'http://127.0.0.1:4178/TraningSystem/' });
  await wait(() => evaluate("document.body.innerText.includes('Firebase is not configured')"));
  assert(await evaluate("[...document.querySelectorAll('button')].some(b => b.textContent.includes('Google') && b.disabled)"));
  assert(await evaluate("document.body.innerText.includes('Admin') && document.body.innerText.includes('Participant')"));
  assert.equal(await evaluate("getComputedStyle(document.body).backgroundColor"), 'rgb(9, 9, 11)');
  // Exercise the actual login buttons and verify their new-tab destinations.
  for (const [label, page] of [['Admin Panel', 'admin'], ['Participant Panel', 'participant']]) {
    const url = `http://127.0.0.1:4178/TraningSystem/demo/${page}.html`;
    await send('Runtime.evaluate', {
      expression: `[...document.querySelectorAll('button')].find(b => b.textContent.includes(${JSON.stringify(label)})).click()`,
      userGesture: true
    });
    const opened = await wait(async () => (await (await fetch('http://127.0.0.1:9234/json')).json()).find(t => t.id !== target.id && t.url === url));
    assert(opened, `${label} did not open the expected demo URL`);
    await fetch(`http://127.0.0.1:9234/json/close/${opened.id}`);
    console.log(`OK login button: ${label} opens ${page}.html`);
  }
  assert.deepEqual(errors, [], 'Browser runtime errors');
  console.log('OK browser login: unconfigured Firebase, demo choices, monochrome background, no runtime exceptions');
} finally {
  socket?.close(); browser.kill(); server.kill();
  await pause(1000);
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
}
