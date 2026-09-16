import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus, X, Download, Upload, List as ListIcon, ArrowCounterClockwise as RotateCcw,
  Users, Clock, Calendar as CalendarIcon, Table as TableIcon, ChartBar as BarChart3,
  Link as LinkIcon, Copy as CopyIcon, SignOut as LogOut, UserPlus, Trash as Trash2,
  ShieldCheck, ChatCircle as MessageSquare, PaperPlaneTilt as Send, DoorOpen,
  ClipboardText, Key as KeyIcon, GraduationCap as GradCapIcon, Bell as BellIcon,
  Monitor as MonitorIcon, Warning as WarnIcon, CheckCircle as CheckIcon, NotePencil as Edit,
  CaretLeft, CaretRight, Compass, SquaresFour, TrendUp, ListDashes, UserCheck, Timer,
  UsersThree, Buildings, Tag, Columns, SlidersHorizontal, Tray, Archive, FileText,
  Briefcase, IdentificationBadge, LockKey
} from '@phosphor-icons/react';
import * as XLSX from 'xlsx';
import { storage, ASSESSMENT_KEYS, ACADEMY_KEYS, parseStoredArray } from './storage';

const SEED = [
  { "id": 1, "week": 0, "date": "2026-10-24", "weekday": "Saturday", "start": "15:00", "end": "15:30", "name": "Welcome & Training Orientation", "pillar": "Leadership & Culture", "mode": "Sync", "facilitators": [], "calendared": true, "resources": [] },
  { "id": 2, "week": 0, "date": "2026-10-24", "weekday": "Saturday", "start": "15:30", "end": "17:30", "name": "Academy Opening Ceremony", "pillar": "Leadership & Culture", "mode": "Sync", "facilitators": [], "calendared": true, "resources": [] },
  { "id": 3, "week": 0, "date": "2026-10-24", "weekday": "Saturday", "start": "18:00", "end": "19:00", "name": "Digital Systems Onboarding", "pillar": "Personal & Prof. Dev.", "mode": "Sync", "facilitators": [], "calendared": true, "resources": [] },
  { "id": 4, "week": 0, "date": "2026-10-24", "weekday": "Saturday", "start": "19:30", "end": "20:30", "name": "Training Norms & Code of Conduct", "pillar": "Leadership & Culture", "mode": "Sync", "facilitators": [], "calendared": true, "resources": [] },
  { "id": 5, "week": 0, "date": "2026-10-24", "weekday": "Saturday", "start": "20:30", "end": "21:30", "name": "Facilitator & Lead Advisory Office Hours", "pillar": "Team Support", "mode": "Coaching", "facilitators": [], "calendared": true, "resources": [] },
  { "id": 6, "week": 1, "date": "2026-10-25", "weekday": "Sunday", "start": "08:30", "end": "09:00", "name": "Daily Central Huddle", "pillar": "Leadership & Culture", "mode": "Sync", "facilitators": [], "calendared": true, "resources": [] },
  { "id": 7, "week": 1, "date": "2026-10-25", "weekday": "Sunday", "start": "09:00", "end": "10:15", "name": "Academy Curriculum Overview", "pillar": "Academic Content", "mode": "Sync", "facilitators": [], "calendared": true, "resources": [] },
  { "id": 8, "week": 1, "date": "2026-10-25", "weekday": "Sunday", "start": "10:30", "end": "11:30", "name": "Introduction to Reflective Journaling", "pillar": "Personal & Prof. Dev.", "mode": "Sync", "facilitators": [], "calendared": true, "resources": [] },
  { "id": 9, "week": 1, "date": "2026-10-25", "weekday": "Sunday", "start": "11:45", "end": "12:45", "name": "Core Principles of Instruction", "pillar": "Teaching Skills", "mode": "Sync", "facilitators": [], "calendared": true, "resources": [] },
  { "id": 10, "week": 1, "date": "2026-10-25", "weekday": "Sunday", "start": "14:00", "end": "15:15", "name": "Training Vision & Structural Pillars", "pillar": "Leadership & Culture", "mode": "Sync", "facilitators": [], "calendared": true, "resources": [] },
  { "id": 11, "week": 1, "date": "2026-10-25", "weekday": "Sunday", "start": "15:30", "end": "16:45", "name": "Goal Setting & Accountability", "pillar": "Leadership & Culture", "mode": "Sync", "facilitators": [], "calendared": true, "resources": [] },
  { "id": 12, "week": 1, "date": "2026-10-25", "weekday": "Sunday", "start": "17:00", "end": "18:15", "name": "Trainee Independent Reflection", "pillar": "Personal & Prof. Dev.", "mode": "Async", "facilitators": [], "calendared": true, "resources": [] },
  { "id": 13, "week": 1, "date": "2026-10-25", "weekday": "Sunday", "start": "18:30", "end": "19:30", "name": "Weekly Cohort Briefing 1", "pillar": "Leadership & Culture", "mode": "Sync", "facilitators": [], "calendared": true, "resources": [] }
];

const DEFAULT_SESSION_TYPES = [
  { id: 'st1', name: 'Academic Content', color: '#71717A' },
  { id: 'st2', name: 'Teaching Skills', color: '#52525B' },
  { id: 'st3', name: 'Leadership & Culture', color: '#3F3F46' },
  { id: 'st4', name: 'Personal & Prof. Dev.', color: '#A1A1AA' },
  { id: 'st5', name: 'System Equity', color: '#27272A' },
  { id: 'st6', name: 'Practice Teaching', color: '#3F3F46' },
  { id: 'st7', name: 'Learning Circle', color: '#52525B' },
  { id: 'st8', name: 'Team Support', color: '#71717A' },
  { id: 'st9', name: 'Meal / Break', color: '#27272A' },
  { id: 'st10', name: 'Debrief', color: '#3F3F46' },
];

const DEFAULT_PILLAR_TAGS = [
  { id: 'p1', name: 'Core Foundations' },
  { id: 'p2', name: 'Pedagogical Mastery' },
  { id: 'p3', name: 'Community Engagement' },
  { id: 'p4', name: 'Leadership Growth' },
];

const DEFAULT_MODES = [
  { id: 'm1', name: 'Sync', color: '#3F3F46' },
  { id: 'm2', name: 'Async', color: '#27272A' },
  { id: 'm3', name: 'Coaching', color: '#52525B' },
  { id: 'm4', name: 'Workshop', color: '#71717A' },
];

const DEFAULT_ROLES = [
  { id: 'superadmin', label: 'Superadmin' },
  { id: 'full_admin', label: 'Staff / Curriculum Manager' },
  { id: 'group_lead', label: 'Cohort Lead' },
  { id: 'fellow', label: 'Fellow / Trainee' },
];

const DEFAULT_CITY_CODES = [
  { id: 'cc1', code: 'HQ', city: 'Headquarters' },
  { id: 'cc2', code: 'REG-1', city: 'Region 1' },
  { id: 'cc3', code: 'REG-2', city: 'Region 2' },
];

const DEFAULT_ROOMS = [
  { id: 'r1', name: 'Hall A', cityCode: 'HQ' },
  { id: 'r2', name: 'Workshop Room 1', cityCode: 'HQ' },
  { id: 'r3', name: 'Lab B', cityCode: 'REG-1' },
];

const DEFAULT_PLANNERS = [
  { id: 'p1', name: 'Alex Morgan', email: 'alex@org.dev', role: 'full_admin', cityCode: 'HQ' },
  { id: 'p2', name: 'Jordan Smith', email: 'jordan@org.dev', role: 'group_lead', cityCode: 'HQ' },
];

const DEFAULT_ROSTER = [
  { id: 'f1', name: 'Taylor Swift', email: 'taylor@trainee.dev', cityCode: 'HQ', cohortGroup: 'Alpha' },
  { id: 'f2', name: 'Chris Evans', email: 'chris@trainee.dev', cityCode: 'HQ', cohortGroup: 'Beta' },
];

const WEEKS = [0, 1, 2, 3, 4, 5];
const GRID_START = 8 * 60; // 08:00
const GRID_END = 23 * 60; // 23:00
const DURATION_PRESETS = [15, 30, 45, 60, 75, 90, 120, 150, 180, 240];
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// UI Tokens (Monochrome Dark)
const btnBase = 'inline-flex items-center gap-1.5 text-[13px] font-semibold rounded-lg px-3.5 py-2 cursor-pointer border border-transparent transition-all duration-150 active:scale-[0.98]';
const btnPrimary = btnBase + ' bg-[#FAFAFA] text-[#09090B] hover:bg-[#E4E4E7] shadow-sm font-bold';
const btnSecondary = btnBase + ' bg-[#18181B] text-[#FAFAFA] border-[#27272A] hover:bg-[#27272A] hover:border-[#3F3F46]';
const btnGhost = btnBase + ' bg-transparent text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAFA]';
const selectStyle = 'px-3 py-1.5 rounded-lg border border-[#27272A] text-[13px] bg-[#18181B] text-[#FAFAFA] shadow-xs focus:outline-none focus:border-[#52525B]';
const inputStyle = 'w-full px-3 py-2 rounded-lg border border-[#27272A] text-[13px] bg-[#18181B] text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#52525B] box-border';

export default function App() {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('ts-user-auth');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const handleLogin = (user) => {
    localStorage.setItem('ts-user-auth', JSON.stringify(user));
    setAuth(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('ts-user-auth');
    setAuth(null);
  };

  if (!auth) {
    return <LoginGate onLogin={handleLogin} />;
  }

  return <MainApp auth={auth} onLogout={handleLogout} />;
}

function LoginGate({ onLogin }) {
  const [mode, setMode] = useState('demo'); // 'demo' | 'custom'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('full_admin');

  const handleCustomRegister = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const user = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      organization: organization.trim() || 'My Organization',
      role: role,
      uid: 'user-' + Date.now(),
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex items-center justify-center p-4" style={{ fontFamily: FONT }}>
      <div className="w-full max-w-md bg-[#18181B] border border-[#27272A] rounded-2xl p-7 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#27272A] border border-[#3F3F46] rounded-xl flex items-center justify-center mx-auto mb-3 text-white">
            <GradCapIcon size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#FAFAFA]">Curriculum & Training System</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">Standalone Open Platform · Zero-Backend</p>
        </div>

        <div className="flex bg-[#09090B] p-1 rounded-xl border border-[#27272A] mb-6">
          <button
            onClick={() => setMode('demo')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${mode === 'demo' ? 'bg-[#27272A] text-white shadow-xs' : 'text-[#A1A1AA] hover:text-white'}`}
          >
            Quick Demo Login
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${mode === 'custom' ? 'bg-[#27272A] text-white shadow-xs' : 'text-[#A1A1AA] hover:text-white'}`}
          >
            Create Account
          </button>
        </div>

        {mode === 'demo' ? (
          <div className="space-y-3">
            <p className="text-xs text-[#A1A1AA] mb-2 text-center">Select a role to explore all system features:</p>
            <button
              onClick={() => onLogin({ name: 'Superadmin Lead', email: 'admin@system.dev', organization: 'Global Academy', role: 'superadmin', uid: 'demo-super' })}
              className="w-full text-left p-3.5 rounded-xl border border-[#27272A] bg-[#09090B] hover:border-[#3F3F46] transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-white">Superadmin Profile</div>
                <div className="text-xs text-[#A1A1AA]">Full access: Staff, roles, settings & system config</div>
              </div>
              <ShieldCheck size={18} className="text-[#A1A1AA]" />
            </button>
            <button
              onClick={() => onLogin({ name: 'Curriculum Staff Manager', email: 'staff@org.dev', organization: 'Training Hub', role: 'full_admin', uid: 'demo-staff' })}
              className="w-full text-left p-3.5 rounded-xl border border-[#27272A] bg-[#09090B] hover:border-[#3F3F46] transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-white">Staff / Curriculum Manager</div>
                <div className="text-xs text-[#A1A1AA]">Schedule calendar, attendance, assessments & roster</div>
              </div>
              <Briefcase size={18} className="text-[#A1A1AA]" />
            </button>
            <button
              onClick={() => onLogin({ name: 'Trainee Fellow', email: 'fellow@trainee.dev', organization: 'Cohort 2026', role: 'fellow', uid: 'f1' })}
              className="w-full text-left p-3.5 rounded-xl border border-[#27272A] bg-[#09090B] hover:border-[#3F3F46] transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-white">Fellow / Trainee Profile</div>
                <div className="text-xs text-[#A1A1AA]">Personal schedule, attendance check-in & quizzes</div>
              </div>
              <UserCheck size={18} className="text-[#A1A1AA]" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">Your Full Name</label>
              <input type="text" required placeholder="e.g. Alex Johnson" value={name} onChange={e => setName(e.target.value)} className={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">Email Address</label>
              <input type="email" required placeholder="alex@myorg.org" value={email} onChange={e => setEmail(e.target.value)} className={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">Organization Name</label>
              <input type="text" placeholder="e.g. Hope Academy / Tech Institute" value={organization} onChange={e => setOrganization(e.target.value)} className={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">Select Access Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className={inputStyle}>
                <option value="superadmin">Superadmin (System Lead)</option>
                <option value="full_admin">Staff / Curriculum Manager</option>
                <option value="fellow">Fellow / Trainee Participant</option>
              </select>
            </div>
            <button type="submit" className={btnPrimary + ' w-full justify-center py-2.5 mt-2'}>Enter Training System</button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#27272A] text-center text-[11px] text-[#A1A1AA]">
          All data is saved locally in your browser state (`localStorage`). No external servers.
        </div>
      </div>
    </div>
  );
}

function MainApp({ auth, onLogout }) {
  const [tab, setTab] = useState('calendar');
  const [sessions, setSessions] = useState(null);
  const [roster, setRoster] = useState(null);
  const [planners, setPlanners] = useState(null);
  const [requests, setRequests] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [sessionTypes, setSessionTypes] = useState(null);
  const [pillarTags, setPillarTags] = useState(null);
  const [modes, setModes] = useState(null);
  const [roles, setRoles] = useState(null);
  const [cityCodes, setCityCodes] = useState(null);
  const [academySettings, setAcademySettings] = useState(null);
  const [academyOverview, setAcademyOverview] = useState(null);
  const [assessments, setAssessments] = useState(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState(null);
  const [assessmentAttempts, setAssessmentAttempts] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [assessmentIncidents, setAssessmentIncidents] = useState(null);
  const [deviceRequests, setDeviceRequests] = useState(null);
  const [staffTasks, setStaffTasks] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  // Helper hook for storage subscription
  const usePersistentState = (key, defaultVal, setter) => {
    useEffect(() => {
      return storage.subscribe(key, (rec) => {
        if (!rec || !rec.value) {
          setter(defaultVal);
          storage.set(key, JSON.stringify(defaultVal));
        } else {
          try { setter(JSON.parse(rec.value)); } catch { setter(defaultVal); }
        }
      });
    }, [key]);
  };

  usePersistentState('ts-sessions', SEED, setSessions);
  usePersistentState('ts-roster', DEFAULT_ROSTER, setRoster);
  usePersistentState('ts-planners', DEFAULT_PLANNERS, setPlanners);
  usePersistentState('ts-requests', [], setRequests);
  usePersistentState('ts-rooms', DEFAULT_ROOMS, setRooms);
  usePersistentState('ts-session-types', DEFAULT_SESSION_TYPES, setSessionTypes);
  usePersistentState('ts-pillar-tags', DEFAULT_PILLAR_TAGS, setPillarTags);
  usePersistentState('ts-modes', DEFAULT_MODES, setModes);
  usePersistentState('ts-roles', DEFAULT_ROLES, setRoles);
  usePersistentState('ts-city-codes', DEFAULT_CITY_CODES, setCityCodes);
  usePersistentState('ts-settings', { startDate: '2026-10-25', endDate: '2026-11-28', fellowWeeks: WEEKS }, setAcademySettings);
  usePersistentState('ts-overview', { academyName: 'Curriculum Academy 2026', theme: 'Excellence in Training', vision: 'Empowering future leaders', goals: ['Master pedagogical principles', 'Build strong team culture'], outcomes: ['Certified Facilitator'], pillars: ['Leadership', 'Pedagogy', 'Community'] }, setAcademyOverview);
  usePersistentState('ts-assessments', [], setAssessments);
  usePersistentState('ts-questions', [], setAssessmentQuestions);
  usePersistentState('ts-attempts', [], setAssessmentAttempts);
  usePersistentState('ts-attendance', [], setAttendance);
  usePersistentState('ts-incidents', [], setAssessmentIncidents);
  usePersistentState('ts-device-requests', [], setDeviceRequests);
  usePersistentState('ts-staff-tasks', [], setStaffTasks);

  const isSuperadmin = auth.role === 'superadmin';
  const isFullAdmin = isSuperadmin || auth.role === 'full_admin';
  const isAdmin = isFullAdmin || auth.role === 'group_lead';

  if (!sessions || !roster || !planners || !rooms) {
    return <div className="min-h-screen bg-[#09090B] text-[#A1A1AA] flex items-center justify-center" style={{ fontFamily: FONT }}>Loading training workspace...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-[#FAFAFA]" style={{ fontFamily: FONT }}>
      <TopBar auth={auth} onLogout={onLogout} organization={auth.organization} />
      <div className="flex flex-1 min-h-screen">
        <Sidebar tab={tab} setTab={setTab} isAdmin={isAdmin} isFullAdmin={isFullAdmin} isSuperadmin={isSuperadmin} isFellow={auth.role === 'fellow'} />
        <div className="flex-1 p-6 min-w-0">
          {toast && <div className="fixed top-4 right-6 bg-[#27272A] border border-[#3F3F46] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs z-50 font-medium">{toast}</div>}
          {tab === 'overview' && <OverviewPanel overview={academyOverview} />}
          {tab === 'calendar' && <SimpleCalendarView sessions={sessions} weeks={WEEKS} />}
          {tab === 'dashboard' && <SimpleDashboard sessions={sessions} roster={roster} />}
          {tab === 'fellows' && <SimpleRoster roster={roster} />}
        </div>
      </div>
    </div>
  );
}

function TopBar({ auth, onLogout, organization }) {
  return (
    <header className="bg-[#18181B] border-b border-[#27272A] px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#27272A] rounded-lg flex items-center justify-center font-bold text-white text-sm">TS</div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">Curriculum & Training System</h1>
          <p className="text-[11px] text-[#A1A1AA]">{organization || 'Open Training System'}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-xs bg-[#27272A] px-3 py-1.5 rounded-lg border border-[#3F3F46] text-[#FAFAFA]">
          <span className="font-semibold">{auth.name}</span> · <span className="text-[#A1A1AA] capitalize">{auth.role.replace('_', ' ')}</span>
        </div>
        <button onClick={onLogout} title="Sign Out" className="p-2 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-[#27272A] transition-colors">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

function Sidebar({ tab, setTab, isAdmin, isFullAdmin, isSuperadmin, isFellow }) {
  const tabs = [
    { id: 'overview', label: 'Vision, Goals & Pillars', icon: Compass },
    ...(isAdmin ? [{ id: 'dashboard', label: 'Dashboard', icon: SquaresFour }] : []),
    { id: 'calendar', label: 'Training Calendar', icon: CalendarIcon },
    { id: 'fellows', label: 'Fellows Roster', icon: UsersThree },
  ];

  return (
    <aside className="w-56 bg-[#09090B] border-r border-[#27272A] p-3 flex flex-col gap-1 shrink-0">
      {tabs.map(t => {
        const Icon = t.icon;
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${active ? 'bg-[#27272A] text-white border border-[#3F3F46]' : 'text-[#A1A1AA] hover:bg-[#18181B] hover:text-white'}`}
          >
            <Icon size={16} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </aside>
  );
}

function OverviewPanel({ overview }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-[#18181B] border border-[#27272A] p-6 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-2">{overview?.academyName || 'Training Academy'}</h2>
        <p className="text-xs text-[#A1A1AA]">{overview?.vision}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-2xl">
          <h3 className="text-sm font-semibold text-white mb-3">Key Training Goals</h3>
          <ul className="space-y-2 text-xs text-[#A1A1AA]">
            {(overview?.goals || []).map((g, i) => <li key={i} className="flex items-center gap-2"><span>•</span> {g}</li>)}
          </ul>
        </div>
        <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-2xl">
          <h3 className="text-sm font-semibold text-white mb-3">Structural Pillars</h3>
          <div className="flex flex-wrap gap-2">
            {(overview?.pillars || []).map((p, i) => <span key={i} className="bg-[#27272A] border border-[#3F3F46] px-3 py-1 rounded-lg text-xs text-white">{p}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleCalendarView({ sessions }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-white">Curriculum Schedule</h2>
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-4 space-y-3">
        {sessions.map(s => (
          <div key={s.id} className="p-3.5 bg-[#09090B] border border-[#27272A] rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">{s.name}</div>
              <div className="text-[11px] text-[#A1A1AA] mt-0.5">{s.weekday}, {s.date} · {s.start} - {s.end}</div>
            </div>
            <span className="text-[11px] bg-[#27272A] border border-[#3F3F46] text-white px-2.5 py-1 rounded-md">{s.pillar}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleDashboard({ sessions, roster }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-2xl">
        <div className="text-xs text-[#A1A1AA]">Total Sessions</div>
        <div className="text-2xl font-bold text-white mt-1">{sessions.length}</div>
      </div>
      <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-2xl">
        <div className="text-xs text-[#A1A1AA]">Enrolled Trainees</div>
        <div className="text-2xl font-bold text-white mt-1">{roster.length}</div>
      </div>
      <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-2xl">
        <div className="text-xs text-[#A1A1AA]">System Status</div>
        <div className="text-sm font-semibold text-white mt-2">Active · Client Local State</div>
      </div>
    </div>
  );
}

function SimpleRoster({ roster }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-white">Enrolled Trainees Roster</h2>
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-4 divide-y divide-[#27272A]">
        {roster.map(r => (
          <div key={r.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">{r.name}</div>
              <div className="text-[11px] text-[#A1A1AA]">{r.email}</div>
            </div>
            <span className="text-xs text-[#A1A1AA]">{r.cohortGroup}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
