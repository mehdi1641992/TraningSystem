# Curriculum & Fellow Training System

A modern, standalone, zero-backend **Curriculum & Fellow Training Management System** designed for educational organizations, fellowship programs, and corporate academies.

Built with **React**, **Vite**, **Tailwind CSS**, and **Phosphor Icons**, this platform operates **100% client-side** using browser `localStorage` for state persistence — enabling instant deployment to **GitHub Pages** without requiring external databases or API keys.

---

## Key Features & Highlights

- **Zero-Backend / Local-First Architecture**: No Firebase, Node backend, or external API keys needed. All data persists client-side in browser `localStorage`.
- **Sleek Monochrome Design System**: High-contrast black and white dark mode aesthetic (`#09090B` background, `#18181B` cards, `#27272A` borders, `#FAFAFA` crisp white typography).
- **GitHub Pages Ready**: Out-of-the-box support for hosting on GitHub Pages (`https://mmc1641992.github.io/TraningSystem`).
- **Multi-Role User Registration**: Anyone visiting the app can log in via 1-click demo profiles or register a custom user account specifying their Name, Email, Organization, and Access Role.
- **Data Import / Export & Backup**: Export full workspace state to JSON or Excel at any time, or restore pre-configured academy datasets.

---

## User Profiles & Role-Based Access Control (RBAC)

The system supports 3 distinct user profiles, each tailored to specific organizational workflows:

### 1. Superadmin (System Lead)
- **Scope**: Complete global authority over the organization's training workspace.
- **Capabilities**:
  - Manage WA Staff accounts and assign access roles.
  - Define system roles, permissions, and location/city codes.
  - Reset, seed, or wipe workspace data.
  - Export full organization analytics and attendance logs.

### 2. Staff / Curriculum Manager
- **Scope**: Curriculum designers, program managers, and cohort facilitators.
- **Capabilities**:
  - **Curriculum Calendar**: Create, edit, reschedule, duplicate, or unschedule sessions.
  - **Staff Calendar**: Assign staff tasks, facilitator shifts, and track task completion.
  - **Attendance Management**: Review fellow check-ins, record manual attendance, and export attendance reports.
  - **Assessments & Grading**: Build quizzes, set pass thresholds, release grades, and perform paragraph review grading.
  - **Security & Logistics**: Monitor incident logs, approve/deny device change requests, and manage physical rooms.
  - **Historical Archives**: Archive completed academies and import past sessions into current schedules.

### 3. Fellow / Trainee Participant
- **Scope**: Enrolled fellows, students, or trainees.
- **Capabilities**:
  - **Personalized Schedule**: View week-by-week curriculum calendar filtered for fellow visibility.
  - **Check-in Attendance**: Record attendance for active synchronous sessions within allowed check-in windows.
  - **Online Assessments**: Take quizzes, submit paragraph answers, and view graded attempt score breakdowns.
  - **Personal Analytics**: Track attendance rate, completed assessment scores, and upcoming deadlines.
  - **Device Management**: Submit device authorization requests if changing phones or laptops.

---

## Detailed Features Breakdown

| Feature Module | Description |
|---|---|
| **Vision & Pillars Overview** | Display academy vision, core training goals, and structural pillars. |
| **Curriculum Calendar** | Interactive calendar grid supporting weekly filtering, session detail views, and facilitator assignments. |
| **Staff Planning Calendar** | Drag-and-drop task editor for staff prep work, shift planning, and task status tracking. |
| **Attendance Records Engine** | Real-time window check-in tracking (On-Time, Late, Closed) with manual override and Excel export. |
| **Assessment Creator & Quiz Engine** | Supports multiple choice, paragraph responses, automated scoring, and grade release toggles. |
| **Paragraph Review Panel** | Interface for staff to review, grade, and leave qualitative feedback on essay responses. |
| **Incident Log Panel** | Tracks assessment tab-switch flags, device mismatches, or candidate security logs. |
| **Device Request Panel** | Workflow for fellows to request device authorization changes with staff approval controls. |
| **Time Summary & Analytics** | Aggregates training hours by pillar, work mode (Sync, Async, Workshop), and facilitator. |
| **Historical Academies Archive** | Store completed training programs and clone archived sessions into new cohorts. |
| **Excel & JSON Data Engine** | Full workspace import/export compatible with standard `.xlsx` files and `.json` backups. |

---

## Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Local Run

```bash
# Clone the repository
git clone https://github.com/mmc1641992/TraningSystem.git

# Navigate into project directory
cd TraningSystem

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deploying to GitHub Pages

To host this app for free on GitHub Pages:

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Commit and push your changes to `main`:
   ```bash
   git add .
   git commit -m "Deploy training system"
   git push origin main
   ```
3. In your GitHub repository settings (`https://github.com/mmc1641992/TraningSystem/settings/pages`), under **Build and deployment**, select **GitHub Actions** or set Source to `main` / `dist`.

---

## License

MIT License — Free to use, adapt, and deploy for any organization or academy.
