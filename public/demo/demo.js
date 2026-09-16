// Static previews only: no Firebase, network requests, or persistent writes.
(() => {
  const views = [...document.querySelectorAll('section.view')];
  const nav = document.getElementById('nav');
  const labels = { dashboard: 'Dashboard', calendar: 'Weekly Calendar', sessions: 'Sessions', attendance: 'Attendance', participants: 'Participants', rooms: 'Rooms', types: 'Session Types', pillars: 'Pillars', modes: 'Work Modes', overview: 'Vision, Goals & Pillars', legend: 'Legend', assessments: 'Assessments', review: 'Paragraph Review', analytics: 'Analytics', incidents: 'Incident Log', devices: 'Device Requests' };
  for (const view of views) {
    const key = view.id.slice(2);
    const link = document.createElement('a');
    link.className = 'nav-item';
    link.href = '#' + key;
    link.textContent = view.dataset.title || labels[key] || key;
    nav.append(link);
  }
  const notice = document.createElement('div');
  notice.className = 'note mb16';
  notice.textContent = 'Demo preview — fictional data. Navigate every panel; editing, filters and exports are illustrative only.';
  document.querySelector('main').prepend(notice);
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.className = 'note';
  status.hidden = true;
  notice.append(status);
  function show() {
    const selected = views.find(view => '#' + view.id.slice(2) === location.hash) || views[0];
    views.forEach(view => view.classList.toggle('active', view === selected));
    for (const link of nav.children) {
      const active = link.hash === '#' + selected.id.slice(2);
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
      if (active) document.getElementById('viewTitle').textContent = link.textContent;
    }
    status.hidden = true;
  }
  addEventListener('hashchange', show);
  show();
  const feedback = label => {
    status.textContent = label + ': preview only. No changes were saved or sent.';
    status.hidden = false;
  };
  document.querySelectorAll('main button').forEach(button => button.addEventListener('click', () => feedback(button.textContent.trim())));
  document.querySelectorAll('main select').forEach(select => select.addEventListener('change', () => feedback('Filter')));
  document.querySelectorAll('form').forEach(form => form.addEventListener('submit', event => { event.preventDefault(); feedback('Request'); }));
})();
