# Black-and-white demos and clone setup

This app retains WA14 functionality with a **monochrome zinc aesthetic**, not the green theme. Default role labels: **Lead, Coordinator, Facilitator, Participant**, plus built-in Superadmin.

## Demo previews — no Firebase needed

- [Admin demo](https://mehdi1641992.github.io/TraningSystem/demo/admin.html): 22 populated panels.
- [Participant / fellow demo](https://mehdi1641992.github.io/TraningSystem/demo/participant.html): seven populated panels.

Both are linked from the login screen. Open `public/demo/admin.html` or `public/demo/participant.html` directly, keeping `demo.css` and `demo.js` alongside them. Navigation and expandable details work. Editing, filters, exports and submissions are illustrative only; nothing is saved or sent. Identities are fictional. Firebase placeholders no longer prevent the login screen from loading; Google sign-in remains disabled until configured.

## Clone prerequisites and local development

Use Git, **Node.js 24 LTS** (matching CI), npm and a modern browser. Real sign-in requires a Firebase project and Google accounts on your organization's domain.

```sh
git clone https://github.com/mehdi1641992/TraningSystem.git
cd TraningSystem
npm ci
npm run dev
```

Open Vite's printed URL under `/TraningSystem/`, usually `http://localhost:5173/TraningSystem/`. Firebase configuration is read directly from `src/firebaseConfig.js`; no `.env` file is currently required.

## Firebase setup for a new clone

1. In [Firebase Console](https://console.firebase.google.com/), create your own project. Analytics is optional and is not initialized by this app. Spark supports small evaluations within its quotas; monitor usage.
2. Register a **Web app** with the `</>` icon. Hosting is optional; GitHub Pages works separately.
3. Under **Project settings → General → Your apps → SDK setup → Config**, copy your complete config object into `src/firebaseConfig.js`, replacing all `YOUR_*` values. Copy the storage bucket exactly rather than guessing its suffix. `measurementId` can be omitted. Never copy service-account JSON or private keys into this file or repository.
4. Under **Build → Authentication → Sign-in method**, enable **Google**, choose a support email and save.
5. Under **Authentication → Settings → Authorized domains**, add `localhost` (new projects may omit it), your GitHub Pages hostname such as `yourname.github.io`, and any custom hostname. Use hostnames only, without protocol or path.
6. Under **Build → Firestore Database**, create the **default** database in **production mode**, choosing a region near your users. This app uses Firestore, not Realtime Database.
7. Review and adapt `firestore.rules` as described below, then publish it in **Firestore Database → Rules**. Do not enable unrestricted access or use test-mode rules for personal data.

Firebase web configuration is public browser configuration, not an Admin credential. Server rules, not hidden API keys or frontend role checks, protect the data.

## Organization and first sign-in

In `src/App.jsx`, change `ORG_DOMAIN`, `ORG_NAME`, `SUPERADMIN_EMAIL` and the display name/call sign in `SUPERADMIN_ACCOUNT`. For example:

```js
const ORG_DOMAIN = 'yourorganization.org';
const ORG_NAME = 'Your Organization';
// Existing declaration in the access-rule section:
const SUPERADMIN_EMAIL = 'admin@' + ORG_DOMAIN;
```

Change the domain regex and privileged email addresses in `firestore.rules` too. **Frontend constants do not update Firestore permissions.** Escape dots in the rules domain string with two backslashes before each dot.

Sign in as your configured Superadmin, add staff through **WA Staff**, and add participants through **Participants** before their first sign-in. The inherited resolver expects letters-only `name@domain` for staff and `firstname.lastname@domain` for participants. Digits, hyphens and additional dots are unsupported unless you adapt the regexes/resolver. Unlisted single-word accounts receive the legacy Staff fallback, not administrator access.

Roster-linked participant accounts retain internal role `fellow`. Assigning the display role Participant to a staff record does not create a participant roster login. The storage layer uses collection `wa14`, with JSON arrays stored in each document's `value` field. Missing documents are handled by the app; no manual seeding is required. Calendar and overview defaults still contain WA14 curriculum content: review before your own launch.

## Important: inherited Firestore authorization limitations

**Use fictional data until these limitations are addressed and rules are tested.** The supplied rules are an inherited starting point, not a complete secure multi-user deployment:

- Every verified user on the configured domain can read all documents in `wa14`, including roster, attempts and other potentially sensitive records. There is no per-participant read isolation.
- Attendance and assessment attempts use shared aggregate documents with domain-wide write access. The schema/rules do not enforce ownership of individual records.
- The planner check recognizes hard-coded email addresses and legacy custom claims (`superadmin`, `planner`, `resource_planner`), not the new Lead/Coordinator labels stored in the UI. Remove inherited privileged addresses, configure your trusted administrators consistently, and validate their intended operations. Client role assignment does not issue custom claims.
- The write allowlist omits several newer documents (including archives, overview and device workflows). Some UI saves will return permission-denied with the shipped rules.

Production hardening requires a reviewed role policy, trusted server-issued claims or equivalent authorization, and per-user/per-record documents or trusted server operations for sensitive data. Never solve permission errors by allowing all writes. Use the Firebase rules simulator or Emulator Suite with positive **and negative** role/ownership tests before publishing changes. Keep a backup before data migrations. This update does not redesign that backend.

## Roles and features

| Role | Intended UI access |
| --- | --- |
| Superadmin | Built-in; staff accounts, roles/codes, roster and full app controls |
| Lead / Coordinator | Full calendar, sessions, attendance, assessments and archive controls |
| Facilitator | Scoped/resources access and facilitator-group assignment |
| Participant | Roster-linked schedule, attendance, assessments and personal analytics |

These describe frontend behavior, not guarantees of server authorization. Default roles live in `DEFAULT_STAFF_ROLES` in `src/App.jsx`.

Features include weekly calendar and overlap layout, room/facilitator assignments, sessions table, time summaries, attendance windows, assessment builder and scoring, paragraph review, grade release, analytics, incident/device workflows, staff tasks, curriculum overview, archives and Excel/JSON import/export. The demos show fictional examples of these panels without connecting to the real app's data.

## Validation

```sh
npm run build
npm run test:render
npm run test:demo
npm run preview
```

`test:render` checks React panels/helpers; `test:demo` validates HTML nesting, IDs, assets and monochrome regression checks. Build output includes both static demos in `dist/demo/`.

Optional real-browser smoke test (Node 24 and an installed Chrome or Edge; no extra npm package):

```powershell
$env:BROWSER_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run test:browser
```

Build first. This launches a local Vite preview and isolated headless browser, clicks each demo navigation item, checks visible panels/mobile navigation and checks the placeholder-config login. Ports 4178 and 9234 must be free. It does not test real Firebase sign-in or database writes.

## Deploy to GitHub Pages

1. Fork/push to your own repository. In `vite.config.js`, set `base: '/YourRepositoryName/'` (case-sensitive); use `/` for a root/custom-domain site.
2. Update the `master` trigger in `.github/workflows/main.yml` if your default branch has a different name.
3. In **Repository Settings → Pages → Source**, choose **GitHub Actions**.
4. Push your changes. The workflow installs with `npm ci`, builds and deploys `dist/`. Check **Actions** for the actual outcome.
5. Add the deployed hostname to Firebase Authorized domains. Test sign-in with separate role accounts after reviewing/publishing rules.

The supplied repository uses `/TraningSystem/` (spelling intentional). The login demo URLs follow Vite's base path. If you fork, update README demo links too.

Alternative: `npm run deploy` builds and publishes to `gh-pages`; select **Deploy from a branch → gh-pages → /(root)** in Pages settings. Choose one deployment method rather than running both. For another static host, upload the contents of `dist/` with the appropriate Vite base.

## Troubleshooting

- **Google button disabled:** replace the required Firebase placeholders and rebuild/restart.
- **Unauthorized domain:** add the exact hostname in Firebase Authentication; do not include a URL path.
- **Popup blocked:** allow popups or try the displayed redirect option. Redirect sign-in may require additional Firebase auth-domain configuration on browsers restricting cross-site storage.
- **Could not verify / permission-denied:** check the deployed rules, verified email/domain and role policy. Even Superadmin must be able to read `wa14-accounts` before role resolution completes. Consult the limitations above instead of opening access broadly.
- **Participant not approved:** add the exact email to the roster and verify the expected email format.
- **Blank page / missing assets on Pages:** verify `base`, build output and deployment source; check browser console/network errors.
- **Demo changes don't save:** intentional. The static previews never write to Firebase or local storage.
- **Build chunk-size warning:** the inherited full app and Excel library produce a large bundle. This warning alone does not mean the build failed.

## Project and license notes

Built with React, Vite, Tailwind CSS, Phosphor Icons, Firebase and SheetJS. No Firebase service credentials or production records are included. The previous README stated MIT, but this repository has no standalone LICENSE file; confirm licensing/attribution for the upstream app before redistributing it.



