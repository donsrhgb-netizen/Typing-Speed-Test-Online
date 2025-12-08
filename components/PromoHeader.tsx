import React from 'react';
import Tooltip from './Tooltip';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

interface PromoHeaderProps {
  activeView: 'tests' | 'lessons' | 'blog';
  onNavigate: (view: 'tests' | 'lessons' | 'blog') => void;
  onOpenSettings: () => void;
}

const PromoHeader: React.FC<PromoHeaderProps> = ({ activeView, onNavigate, onOpenSettings }) => {
    const { t } = useLanguage();
    
    const getLinkClass = (view: 'tests' | 'lessons' | 'blog') => {
        const baseClass = "text-white px-2 py-1.5 rounded-md text-sm font-medium";
        if (activeView === view) {
            return `${baseClass} font-bold underline decoration-yellow-400 underline-offset-4 decoration-1`;
        }
        return `${baseClass} hover:text-yellow-300`;
    };

    return (
        <nav className="w-full bg-sky-600 shadow-md print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button onClick={() => onNavigate('tests')} className={getLinkClass('tests')}>
                            {t('header.tests')}
                        </button>
                        <button onClick={() => onNavigate('lessons')} className={getLinkClass('lessons')}>
                            {t('header.lessons')}
                        </button>
                        <button onClick={() => onNavigate('blog')} className={getLinkClass('blog')}>
                            {t('header.blog')}
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSelector />
                        <Tooltip text={t('header.settings')}>
                            <button
                                onClick={onOpenSettings}
                                className="text-white hover:text-yellow-300 p-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-600 focus:ring-white"
                                aria-label={t('header.settings')}
                            >
                                <SettingsIcon />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default PromoHeader;