import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import SettingsSelector from './SettingsSelector';
import { useLanguage } from '../context/LanguageContext';

type ChartView = 'combined' | 'wpm' | 'accuracy';

const HistoryChart: React.FC = () => {
  const { profile } = useProfile();
  const { t } = useLanguage();
  const [view, setView] = useState<ChartView>('combined');
  const history = profile.history.slice(0, 10).reverse(); // Last 10, chronological

  if (history.length < 2) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-12 text-center text-[var(--color-text-secondary)]">
        <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">{t('history.title')}</h3>
        <div className="h-64 flex items-center justify-center bg-[var(--color-bg-secondary)] rounded-lg shadow-inner ring-1 ring-black/20">
          <p>{t('history.noHistory')}</p>
        </div>
      </div>
    );
  }

  const viewOptions = [
    { value: 'combined', label: t('history.combined') },
    { value: 'wpm', label: t('history.wpm') },
    { value: 'accuracy', label: t('history.accuracy') },
  ];
  
  const isCombined = view === 'combined';
  const isWpmOnly = view === 'wpm';
  const isAccuracyOnly = view === 'accuracy';

  const width = 800;
  const height = 300;
  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxWpm = Math.max(...history.map(r => r.wpm), 50) + 10;
  const maxAccuracy = 100;
  
  const yMaxLeft = isAccuracyOnly ? maxAccuracy : maxWpm;

  const barGroupWidth = chartWidth / history.length;
  const barPadding = 5;
  const barWidth = isCombined ? (barGroupWidth - barPadding) / 2 : barGroupWidth - barPadding;

  const yAxisTicks = 5;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 text-center sm:text-left gap-4">
        <h3 className="text-2xl font-semibold text-[var(--color-text-primary)]">{t('history.title')}</h3>
        <SettingsSelector
          options={viewOptions}
          selectedValue={view}
          onSelect={(val) => setView(val as ChartView)}
          ariaLabel="Select chart view"
        />
      </div>
      <div className="relative bg-[var(--color-bg-secondary)] p-4 rounded-lg shadow-inner ring-1 ring-black/20">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-labelledby="chart-title" role="img">
          <title id="chart-title">A bar chart showing WPM and accuracy for the last 10 typing tests.</title>
          {/* Y-Axis Grid and Labels */}
          {Array.from({ length: yAxisTicks + 1 }).map((_, i) => {
            const y = padding + (i * chartHeight) / yAxisTicks;
            const leftValue = Math.round(yMaxLeft * (1 - i / yAxisTicks));
            const accValue = Math.round(maxAccuracy * (1 - i / yAxisTicks));
            return (
              <g key={`grid-${i}`} className="text-xs" fill="var(--color-text-tertiary)">
                <line
                  x1={padding}
                  x2={width - padding}
                  y1={y}
                  y2={y}
                  stroke="var(--color-bg-tertiary)"
                  strokeWidth="0.5"
                  strokeDasharray="2,3"
                />
                {/* WPM/Accuracy Label (Left) */}
                <text x={padding - 8} y={y + 4} textAnchor="end" fill="currentColor">{leftValue}{isAccuracyOnly ? '%' : ''}</text>
                {/* Accuracy Label (Right) - Combined View Only */}
                {isCombined && (
                    <text x={width - padding + 8} y={y + 4} textAnchor="start" fill="currentColor">{accValue}%</text>
                )}
              </g>
            );
          })}
          
          {/* Bars */}
          {history.map((result, index) => {
            const groupX = padding + index * barGroupWidth;
            
            // WPM Bar
            const wpmBarHeight = result.wpm > 0 ? (result.wpm / yMaxLeft) * chartHeight : 0;
            const wpmBar = (isCombined || isWpmOnly) && (
              <rect
                x={groupX + barPadding / 2}
                y={height - padding - wpmBarHeight}
                width={barWidth}
                height={wpmBarHeight}
                fill="var(--color-accent-primary)"
                className="transition-all hover:opacity-80"
              >
                <title>WPM: {result.wpm}</title>
              </rect>
            );

            // Accuracy Bar
            const accuracyYMax = isCombined ? maxAccuracy : yMaxLeft;
            const accuracyBarHeight = result.accuracy > 0 ? (result.accuracy / accuracyYMax) * chartHeight : 0;
            const accuracyBar = (isCombined || isAccuracyOnly) && (
                 <rect
                  x={isCombined ? groupX + barPadding / 2 + barWidth : groupX + barPadding / 2}
                  y={height - padding - accuracyBarHeight}
                  width={barWidth}
                  height={accuracyBarHeight}
                  fill="var(--color-correct)"
                   className="transition-all hover:opacity-80"
                >
                  <title>Accuracy: {result.accuracy}%</title>
                </rect>
            );
            
            return (
              <g key={result.timestamp}>
                {wpmBar}
                {accuracyBar}
                 <text
                    x={groupX + barGroupWidth / 2}
                    y={height - padding + 18}
                    textAnchor="middle"
                    fill="var(--color-text-secondary)"
                    fontSize="11"
                 >
                    {new Date(result.timestamp).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          {(isCombined || isWpmOnly) && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--color-accent-primary)]"></div>
              <span className="text-[var(--color-text-secondary)]">{t('history.wpm')}</span>
            </div>
          )}
           {(isCombined || isAccuracyOnly) && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--color-correct)]"></div>
              <span className="text-[var(--color-text-secondary)]">{t('history.accuracy')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryChart;