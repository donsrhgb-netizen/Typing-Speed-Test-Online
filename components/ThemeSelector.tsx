import React from 'react';
import { useProfile } from '../context/ProfileContext';
import { themes } from '../utils/themes';
import Tooltip from './Tooltip';

const ThemeSelector: React.FC = () => {
  const { profile, updateThemePreference } = useProfile();
  const currentThemeId = profile.preferences.theme;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-2">
      {Object.values(themes).map((theme) => (
        <div key={theme.id} className="flex flex-col items-center gap-2">
          <Tooltip text={theme.name}>
            <button
              onClick={() => updateThemePreference(theme.id)}
              className={`w-16 h-16 rounded-full flex items-center justify-center p-1 transition-all duration-200 ${
                currentThemeId === theme.id
                  ? 'ring-2 ring-offset-2 ring-offset-[var(--color-bg-secondary)] ring-[var(--color-accent-primary)]'
                  : 'ring-1 ring-[var(--color-bg-tertiary)] hover:ring-[var(--color-accent-primary)]'
              }`}
              aria-label={`Select ${theme.name} theme`}
              aria-pressed={currentThemeId === theme.id}
              style={{ backgroundColor: theme.colors['--color-bg-secondary'] }}
            >
              <div className="flex flex-wrap justify-center items-center gap-1">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors['--color-bg-primary'] }} />
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors['--color-text-primary'] }} />
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors['--color-accent-primary'] }} />
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors['--color-correct'] }} />
              </div>
            </button>
          </Tooltip>
          <span className={`text-xs ${currentThemeId === theme.id ? 'text-[var(--color-text-primary)] font-semibold' : 'text-[var(--color-text-secondary)]'}`}>
            {theme.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ThemeSelector;
