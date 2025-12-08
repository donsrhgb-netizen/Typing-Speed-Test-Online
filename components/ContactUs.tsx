import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { saveFeedback } from '../utils/localStorage';

interface ContactUsProps {
  onClose: () => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      return;
    }
    setStatus('sending');
    
    // Save the feedback to localStorage to be displayed on the feedback wall
    saveFeedback({ name, message });

    // Simulate API call
    setTimeout(() => {
      setStatus('sent');
      setTimeout(() => {
        onClose();
      }, 1500); // Close modal after showing success message
    }, 1000);
  };
  
  const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-us-title"
    >
      <div 
        className="bg-[var(--color-bg-secondary)] p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-[90%] relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors"
          aria-label={t('contact.close')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="contact-us-title" className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4">{t('contact.title')}</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">{t('contact.description')}</p>
        
        {status === 'sent' ? (
          <div className="text-center py-8">
            <p className="text-xl font-semibold text-[var(--color-correct)]">{t('contact.sentMessage')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{t('contact.nameLabel')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('contact.namePlaceholder')}
                className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{t('contact.emailLabel')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('contact.emailPlaceholder')}
                className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] transition-colors"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{t('contact.messageLabel')}</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder={t('contact.messagePlaceholder')}
                className="w-full px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] transition-colors"
              />
            </div>
            <div className="flex justify-end gap-4 pt-2">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-bg-interactive)] transition-colors"
              >
                {t('contact.close')}
              </button>
              <button 
                type="submit"
                disabled={status === 'sending'}
                className="px-6 py-2 bg-[var(--color-accent-secondary)] text-[var(--color-text-inverted)] font-semibold rounded-md hover:bg-[var(--color-accent-primary)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                {status === 'sending' ? <SpinnerIcon /> : null}
                <span>{status === 'sending' ? t('contact.sending') : t('contact.send')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactUs;