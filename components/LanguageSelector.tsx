import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import useOnClickOutside from '../hooks/useOnClickOutside';

const USFlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-7" viewBox="0 0 21 15"><g clipPath="url(#clip0_4_2)"><path fill="#FFF" d="M0 0h21v15H0z"/><path fill="#BA122B" d="M0 0h21v2.143H0zm0 4.286h21v2.143H0zm0 4.285h21v2.143H0zm0 4.286h21V15H0z"/><path fill="#00247d" d="M0 0h10.5v8.571H0z"/><g fill="#FFF"><path d="M2.1 1.071l-.403.95.95-.402-.656.76.76-.656-.402.95L2.8.95l.76.656-.656-.76.95.402zM5.25 1.071l-.403.95.95-.402-.656.76.76-.656-.402.95.95-.403.76.656-.656-.76.95.402zM8.4 1.071l-.403.95.95-.402-.656.76.76-.656-.402.95.95-.403.76.656-.656-.76.95.402zM3.15 2.857l-.403.95.95-.402-.656.76.76-.656-.402.95.95-.403.76.656-.656-.76.95.402zM6.3 2.857l-.403.95.95-.402-.656.76.76-.656-.402.95.95-.403.76.656-.656-.76.95.402zM2.1 4.643l-.403.95.95-.402-.656.76.76-.656-.402.95.95-.403.76.656-.656-.76.95.402zM5.25 4.643l-.403.95.95-.402-.656.76.76-.656-.402.95.95-.403.76.656-.656-.76.95.402zM8.4 4.643l-.403.95.95-.402-.656.76.76-.656-.402.95.95-.403.76.656-.656-.76.95.402zM3.15 6.428l-.403.95.95-.402-.656.76.76-.656-.402.95.95-.403.76.656-.656-.76.95.402zM6.3 6.428l-.403.95.95-.402-.656.76.76-.656-.402.95.95-.403.76.656-.656-.76.95.402z"/></g></g><defs><clipPath id="clip0_4_2"><path fill="#fff" d="M0 0h21v15H0z"/></clipPath></defs></svg>
);
const ESFlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-7" viewBox="0 0 21 15"><path fill="#c60b1e" d="M0 0h21v3.75H0zm0 11.25h21V15H0z"/><path fill="#ffc400" d="M0 3.75h21v7.5H0z"/></svg>
);
const FRFlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-7" viewBox="0 0 21 15"><path fill="#002654" d="M0 0h7v15H0z"/><path fill="#fff" d="M7 0h7v15H7z"/><path fill="#ed2939" d="M14 0h7v15h-7z"/></svg>
);
const DEFlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-7" viewBox="0 0 21 15"><path d="M0 0h21v15H0z"/><path fill="#d00" d="M0 5h21v5H0z"/><path fill="#ffce00" d="M0 10h21v5H0z"/></svg>
);

const languages = [
  { code: 'en', name: 'English', Icon: USFlagIcon },
  { code: 'es', name: 'Español', Icon: ESFlagIcon },
  { code: 'fr', name: 'Français', Icon: FRFlagIcon },
  { code: 'de', name: 'Deutsch', Icon: DEFlagIcon },
];

const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const CurrentLang = languages.find(l => l.code === language) || languages[0];

  const handleSelect = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 rounded-full text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-600 focus:ring-white"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <CurrentLang.Icon />
      </button>
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-secondary)] rounded-md shadow-lg py-1 z-20"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-interactive)]"
              role="menuitem"
            >
              <lang.Icon />
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;