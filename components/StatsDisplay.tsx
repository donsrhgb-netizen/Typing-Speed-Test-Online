import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';

const SpeedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6,4.68l4.31,8.13-3.23,0-1.42,4.87,1.42,0L9.4,23.32l.62-8.13,3.23,0,1.42-4.87-1.42,0L15.54.68Z"/></svg>;
const AccuracyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" fill="#fff"/><circle cx="12" cy="12" r="6" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="#fff"/></svg>;
const TimeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/><path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const formatTotalTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const formatDailyTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const StatsDisplay: React.FC = () => {
    const { profile, updateDailyGoalPreference } = useProfile();
    const { t } = useLanguage();
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [goalInputValue, setGoalInputValue] = useState(profile.preferences.dailyGoal.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    const { history, preferences } = profile;

    useEffect(() => {
        if (isEditingGoal && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditingGoal]);

    const stats = useMemo(() => {
        if (history.length === 0) {
            return { avgWpm: 0, avgAcc: 0, totalTime: 0, todaysTime: 0 };
        }

        const totalWpm = history.reduce((sum, r) => sum + r.wpm, 0);
        const totalAcc = history.reduce((sum, r) => sum + r.accuracy, 0);
        const totalTime = history.reduce((sum, r) => sum + r.duration, 0);
        
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        
        const todaysTests = history.filter(r => r.timestamp >= startOfToday.getTime());
        const todaysTime = todaysTests.reduce((sum, r) => sum + r.duration, 0);

        return {
            avgWpm: Math.round(totalWpm / history.length),
            avgAcc: Math.round(totalAcc / history.length),
            totalTime,
            todaysTime
        };
    }, [history]);
    
    if (history.length === 0) {
        return null;
    }

    const goalInSeconds = preferences.dailyGoal * 60;
    const goalProgress = goalInSeconds > 0 ? (stats.todaysTime / goalInSeconds) * 100 : 0;
    
    const circumference = 2 * Math.PI * 54; // 2 * pi * radius
    const strokeDashoffset = circumference - (circumference * Math.min(goalProgress, 100)) / 100;

    const handleSaveGoal = () => {
        const newGoal = parseInt(goalInputValue, 10);
        if (!isNaN(newGoal) && newGoal > 0) {
            updateDailyGoalPreference(newGoal);
        }
        setIsEditingGoal(false);
    };

    const handleGoalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveGoal();
        } else if (e.key === 'Escape') {
            setGoalInputValue(profile.preferences.dailyGoal.toString());
            setIsEditingGoal(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-8">
            <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg flex items-center justify-between p-4 md:p-6 gap-4 text-left">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-yellow-400/20 rounded-full"><SpeedIcon /></div>
                        <div>
                            <p className="text-sm text-[var(--color-text-secondary)]">{t('stats.avgSpeed')}</p>
                            <p className="text-2xl font-bold">{stats.avgWpm} <span className="text-base font-normal text-[var(--color-text-tertiary)]">{t('stats.wpm')}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-500/20 rounded-full"><AccuracyIcon /></div>
                        <div>
                            <p className="text-sm text-[var(--color-text-secondary)]">{t('stats.avgAcc')}</p>
                            <p className="text-2xl font-bold">{stats.avgAcc}<span className="text-base font-normal text-[var(--color-text-tertiary)]">%</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-500/20 rounded-full"><TimeIcon /></div>
                        <div>
                            <p className="text-sm text-[var(--color-text-secondary)]">{t('stats.typingTime')}</p>
                            <p className="text-2xl font-bold">{formatTotalTime(stats.totalTime)}</p>
                        </div>
                    </div>
                </div>

                <div className="relative flex-shrink-0 w-32 h-32 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-bg-tertiary)" strokeWidth="6"/>
                        <circle 
                            cx="60" cy="60" r="54" fill="none" 
                            stroke="var(--color-accent-primary)" strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-500"
                        />
                    </svg>
                    <div className="relative text-center">
                        <p className="text-xs font-bold text-orange-400 uppercase">{t('stats.dailyGoal')}</p>
                        {isEditingGoal ? (
                            <div className="flex items-center justify-center">
                                <input
                                    ref={inputRef}
                                    type="number"
                                    value={goalInputValue}
                                    onChange={(e) => setGoalInputValue(e.target.value)}
                                    onKeyDown={handleGoalKeyDown}
                                    onBlur={handleSaveGoal}
                                    className="w-16 bg-transparent text-center text-xl font-bold text-[var(--color-text-primary)] focus:outline-none"
                                />
                                <span className="text-sm text-[var(--color-text-secondary)]">min</span>
                            </div>
                        ) : (
                            <>
                                <p className="text-2xl font-bold font-mono">{formatDailyTime(stats.todaysTime)}</p>
                                <div className="flex items-center justify-center gap-1 text-xs text-[var(--color-text-secondary)]">
                                    <span>/ {preferences.dailyGoal}:00</span>
                                    <button onClick={() => setIsEditingGoal(true)} className="hover:text-[var(--color-accent-primary)]"><SettingsIcon /></button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsDisplay;