export const themes: Record<string, { id: string; name: string; colors: Record<string, string> }> = {
  default: {
    id: 'default',
    name: 'Cyberpunk',
    colors: {
      '--color-bg-primary': '#0f172a',    // slate-900
      '--color-bg-secondary': '#1e293b',  // slate-800
      '--color-bg-tertiary': '#334155',   // slate-700
      '--color-bg-interactive': '#475569', // slate-600
      '--color-text-primary': '#f1f5f9',    // slate-100
      '--color-text-secondary': '#94a3b8',  // slate-400
      '--color-text-tertiary': '#64748b',   // slate-500
      '--color-text-inverted': '#0f172a',   // slate-900
      '--color-accent-primary': '#22d3ee',   // cyan-400
      '--color-accent-primary-rgb': '34, 211, 238',
      '--color-accent-secondary': '#06b6d4',  // cyan-500
      '--color-shadow-primary': 'rgba(34, 211, 238, 0.1)', // cyan-400/10
      '--color-error': '#f87171', // red-400
      '--color-error-bg': 'rgba(248, 113, 113, 0.2)', // red-400/20
      '--color-correct': '#4ade80', // green-400
      '--color-correct-bg': 'rgba(74, 222, 128, 0.15)', // green-400/15
    },
  },
  arctic: {
    id: 'arctic',
    name: 'Arctic',
    colors: {
      '--color-bg-primary': '#f1f5f9',     // slate-100
      '--color-bg-secondary': '#ffffff',   // white
      '--color-bg-tertiary': '#e2e8f0',    // slate-200
      '--color-bg-interactive': '#cbd5e1', // slate-300
      '--color-text-primary': '#1e293b',     // slate-800
      '--color-text-secondary': '#64748b',   // slate-500
      '--color-text-tertiary': '#94a3b8',    // slate-400
      '--color-text-inverted': '#ffffff',   // white
      '--color-accent-primary': '#3b82f6',    // blue-500
      '--color-accent-primary-rgb': '59, 130, 246',
      '--color-accent-secondary': '#2563eb',   // blue-600
      '--color-shadow-primary': 'rgba(59, 130, 246, 0.1)', // blue-500/10
      '--color-error': '#ef4444', // red-500
      '--color-error-bg': 'rgba(239, 68, 68, 0.1)', // red-500/10
      '--color-correct': '#22c55e', // green-500
      '--color-correct-bg': 'rgba(34, 197, 94, 0.1)', // green-500/10
    },
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    colors: {
      '--color-bg-primary': '#14532d',    // green-900
      '--color-bg-secondary': '#166534',  // green-800
      '--color-bg-tertiary': '#15803d',   // green-700
      '--color-bg-interactive': '#16a34a', // green-600
      '--color-text-primary': '#dcfce7',    // green-100
      '--color-text-secondary': '#86efac',  // green-300
      '--color-text-tertiary': '#4ade80',   // green-400
      '--color-text-inverted': '#14532d',   // green-900
      '--color-accent-primary': '#a3e635',   // lime-400
      '--color-accent-primary-rgb': '163, 230, 53',
      '--color-accent-secondary': '#84cc16',  // lime-500
      '--color-shadow-primary': 'rgba(163, 230, 53, 0.1)', // lime-400/10
      '--color-error': '#fca5a5', // red-300
      '--color-error-bg': 'rgba(252, 165, 165, 0.2)', // red-300/20
      '--color-correct': '#bef264', // lime-300
      '--color-correct-bg': 'rgba(190, 242, 100, 0.15)', // lime-300/15
    },
  },
   dusk: {
    id: 'dusk',
    name: 'Dusk',
    colors: {
      '--color-bg-primary': '#312e81',    // indigo-900
      '--color-bg-secondary': '#3730a3',  // indigo-800
      '--color-bg-tertiary': '#4338ca',   // indigo-700
      '--color-bg-interactive': '#4f46e5', // indigo-600
      '--color-text-primary': '#e0e7ff',    // indigo-100
      '--color-text-secondary': '#a5b4fc',  // indigo-300
      '--color-text-tertiary': '#818cf8',   // indigo-400
      '--color-text-inverted': '#e0e7ff',   // indigo-100
      '--color-accent-primary': '#ec4899',   // pink-500
      '--color-accent-primary-rgb': '236, 72, 153',
      '--color-accent-secondary': '#d946ef',  // fuchsia-500
      '--color-shadow-primary': 'rgba(236, 72, 153, 0.1)', // pink-500/10
      '--color-error': '#fda4af', // rose-300
      '--color-error-bg': 'rgba(253, 164, 175, 0.2)', // rose-300/20
      '--color-correct': '#c4b5fd', // violet-300
      '--color-correct-bg': 'rgba(196, 181, 253, 0.15)', // violet-300/15
    },
  },
  graphite: {
    id: 'graphite',
    name: 'Graphite',
    colors: {
      '--color-bg-primary': '#111827',    // gray-900
      '--color-bg-secondary': '#1f2937',  // gray-800
      '--color-bg-tertiary': '#374151',   // gray-700
      '--color-bg-interactive': '#4b5563', // gray-600
      '--color-text-primary': '#f3f4f6',    // gray-100
      '--color-text-secondary': '#9ca3af',  // gray-400
      '--color-text-tertiary': '#6b7280',   // gray-500
      '--color-text-inverted': '#111827',   // gray-900
      '--color-accent-primary': '#60a5fa',   // blue-400
      '--color-accent-primary-rgb': '96, 165, 250',
      '--color-accent-secondary': '#3b82f6',  // blue-500
      '--color-shadow-primary': 'rgba(96, 165, 250, 0.1)', // blue-400/10
      '--color-error': '#f87171', // red-400
      '--color-error-bg': 'rgba(248, 113, 113, 0.2)', // red-400/20
      '--color-correct': '#4ade80', // green-400
      '--color-correct-bg': 'rgba(74, 222, 128, 0.15)', // green-400/15
    },
  },
};

export const applyTheme = (themeId: string) => {
  const theme = themes[themeId] || themes.default;
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};