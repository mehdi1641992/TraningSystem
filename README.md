# Participant Training System

An exact clone of the **wa14-curriculum-calendar** curriculum & training management system, adapted with a four-role model: **Lead, Coordinator, Facilitator, Participant** (plus a built-in Superadmin).

Built with **React**, **Vite**, **Tailwind CSS**, **Phosphor Icons**, **Firebase** (Google sign-in + Firestore) and **xlsx** for Excel import/export. The original WA14 aesthetic (dark green / academy theme) is preserved unchanged.

---

## Setup

### 1. Create your Firebase project (free Spark plan is enough)
1. Go to https://console.firebase.google.com and create a project.
2. Register a web app (</> icon) and copy the config object.
3. Paste it into `src/firebaseConfig.js`, replacing the placeholder values.
4. **Firestore Database** -> Create database (production mode, any region).
5. **Firestore > Rules** -> paste the rules from `firestore.rules` in this repo -> Publish.
6. **Authentication > Sign-in method** -> enable **Google**.
7. **Authentication > Settings > Authorized domains** -> add your deploy domain (e.g. `<username>.github.io`).

### 2. Organization identity (one place)
At the top of `src/App.jsx`:

    const ORG_DOMAIN = 'teachforbangladesh.org'; // email domain allowed to sign in
    const ORG_NAME   = 'Teach For Bangladesh';   // shown on the sign-in card / top bar

- Staff/coordinators sign in with `name@<ORG_DOMAIN>` (single-word).
- Participants sign in with `firstname.lastname@<ORG_DOMAIN>` (must be added to the roster first).
- `mehdi@<ORG_DOMAIN>` is the permanent Superadmin - change it to your lead's address.

### 3. Run

    npm install
    npm run dev          # local dev server
    npm run build        # production bundle in dist/
    npm run test:render  # renders every panel + checks helpers

---

## Roles

| Role | Access |
|---|---|
| **Superadmin** | Built-in only - manages WA Staff accounts, roles, city codes, can reset/seed data. |
| **Lead** | Full control of the calendar, sessions, attendance, assessments, archives. |
| **Coordinator** | Full control of the calendar, sessions, attendance, assessments, archives. |
| **Facilitator** | Resources access; can be assigned to rooms and facilitator groups. |
| **Participant** | Personalized schedule, attendance check-in, online assessments, personal analytics, device requests. |

Default roles are defined in `DEFAULT_STAFF_ROLES` in `src/App.jsx` and can be extended by the Superadmin in the app (Roles & Codes panel).

## Features

- **Curriculum Calendar** - interactive weekly grid, session editor, facilitator/room assignment, overlap layout.
- **Sessions Table / Assignment / Rooms / Pillars / Session Types / Work Modes** panels.
- **Attendance** - check-in windows (On-Time / Late / Closed), manual override, Excel export.
- **Assessments** - quiz builder (multiple choice, grid, paragraph), automated scoring, paragraph review grading, grade release.
- **Analytics** - time summary by pillar/mode, participant attendance and assessment breakdowns.
- **Incident log & device change requests** - assessment integrity and device authorization workflow.
- **Staff Calendar** - staff task planning with drag-and-drop status tracking.
- **Academy overview & historical archives** - clone archived sessions into new cohorts.
- **WA Staff panel + Roles & Codes** - Superadmin-managed accounts, custom roles, city call signs.
- **Excel & JSON import/export** - full workspace backup and per-sheet `.xlsx` exports.

## Deploying to GitHub Pages

A GitHub Actions workflow (`.github/workflows/main.yml`) builds and deploys on every push to `master`. `vite.config.js` sets `base: '/TraningSystem/'` to match the repo path. Requires the Firebase authorized-domain step above for sign-in to work on the deployed domain.

## License

MIT.
