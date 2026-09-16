// Pure client-side localStorage storage engine for Curriculum & Fellow Training System
// 100% static site / GitHub Pages ready without backend or Firebase dependencies.

const LISTENERS = new Map();

function notify(key, value) {
  const record = value !== null ? { key, value } : null;
  const callbacks = LISTENERS.get(key) || [];
  callbacks.forEach(cb => {
    try { cb(record); } catch (e) { console.error('storage listener error', key, e); }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key && LISTENERS.has(e.key)) {
      notify(e.key, e.newValue);
    }
  });
}

export const ASSESSMENT_KEYS = {
  assessments: 'ts-assessments',
  questions: 'ts-assessment-questions',
  attempts: 'ts-assessment-attempts',
  attendance: 'ts-attendance',
  incidents: 'ts-assessment-incidents',
  deviceRequests: 'ts-device-change-requests',
  analytics: 'ts-assessment-analytics',
  academyOverview: 'ts-academy-overview',
  historicalAcademies: 'ts-historical-academies',
};

export const ACADEMY_KEYS = {
  academyOverview: 'ts-academy-overview',
  historicalAcademies: 'ts-historical-academies',
};

export function parseStoredArray(record) {
  if (!record?.value) return [];
  try {
    const parsed = JSON.parse(record.value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export const storage = {
  async get(key) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? { key, value: val } : null;
    } catch (e) {
      return null;
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      notify(key, value);
      return { key, value };
    } catch (e) {
      console.error('localStorage.setItem failed', key, e);
      return { key, value };
    }
  },
  async delete(key) {
    try {
      localStorage.removeItem(key);
      notify(key, null);
      return { key, deleted: true };
    } catch (e) {
      return { key, deleted: false };
    }
  },
  subscribe(key, callback) {
    if (!LISTENERS.has(key)) {
      LISTENERS.set(key, []);
    }
    LISTENERS.get(key).push(callback);

    // Immediate initial call
    this.get(key).then(rec => callback(rec));

    return () => {
      const arr = LISTENERS.get(key) || [];
      LISTENERS.set(key, arr.filter(cb => cb !== callback));
    };
  }
};
