import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface OnboardingProps {
  onClose: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: t('onboarding.step1.title'),
      content: t('onboarding.step1.content'),
      icon: '👋',
    },
    {
      title: t('onboarding.step2.title'),
      content: t('onboarding.step2.content'),
      icon: '⚙️',
    },
    {
      title: t('onboarding.step3.title'),
      content: t('onboarding.step3.content'),
      icon: '⌨️',
    },
    {
      title: t('onboarding.step4.title'),
      content: t('onboarding.step4.content'),
      icon: '📊',
    },
    {
      title: t('onboarding.step5.title'),
      content: t('onboarding.step5.content'),
      icon: '🎨',
    },
    {
      title: t('onboarding.step6.title'),
      content: t('onboarding.step6.content'),
      icon: '🚀',
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setStep(s => s + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="bg-[var(--color-bg-secondary)] p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-[90%] relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors"
          aria-label={t('onboarding.close')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-6xl mb-4">{currentStep.icon}</div>

        <h2 id="onboarding-title" className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">{currentStep.title}</h2>
        <p className="text-[var(--color-text-secondary)] mb-8 min-h-[72px]">{currentStep.content}</p>

        <div className="flex justify-center items-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${index === step ? 'bg-[var(--color-accent-primary)]' : 'bg-[var(--color-bg-tertiary)]'}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-bg-interactive)] transition-colors w-1/3"
            >
              {t('onboarding.back')}
            </button>
          ) : (
             <button
              onClick={onClose}
              className="px-6 py-2 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-bg-interactive)] transition-colors w-1/3"
            >
              {t('onboarding.skip')}
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-grow px-6 py-2 bg-[var(--color-accent-secondary)] text-[var(--color-text-inverted)] font-bold rounded-md hover:bg-[var(--color-accent-primary)] transition-colors"
          >
            {isLastStep ? t('onboarding.finish') : t('onboarding.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
