import React, { useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import SettingsSelector from './SettingsSelector';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { useLanguage } from '../context/LanguageContext';
import ThemeSelector from './ThemeSelector';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { profile, updateColorModePreference } = useProfile();
  const { colorMode } = profile.preferences;
  const { t } = useLanguage();

  useOnClickOutside(modalRef, onClose);

  const colorModeOptions = [
    { value: 'light', label: t('settings.light') },
    { value: 'dark', label: t('settings.dark') },
    { value: 'system', label: t('settings.system') },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        ref={modalRef}
        className="bg-[var(--color-bg-secondary)] p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-[90%] max-h-[85vh] overflow-y-auto relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors"
          aria-label="Close settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="settings-title" className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">{t('settings.title')}</h2>

        <div>
          {/* Appearance Section */}
          <section>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-bg-tertiary)] pb-2">{t('settings.appearanceTitle')}</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-primary)]">{t('settings.theme')}</span>
                <SettingsSelector
                    options={colorModeOptions}
                    selectedValue={colorMode}
                    onSelect={(val) => updateColorModePreference(val as 'light' | 'dark' | 'system')}
                    ariaLabel="Select color theme"
                />
                </div>

                <div className="pt-2">
                    <h4 className="text-md font-semibold text-[var(--color-text-primary)] mb-3">{t('settings.specificThemes')}</h4>
                    <ThemeSelector />
                </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;