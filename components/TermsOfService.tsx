import React from 'react';

interface TermsOfServiceProps {
  onClose: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-of-service-title"
    >
      <div 
        className="bg-[var(--color-bg-secondary)] p-6 md:p-8 rounded-xl shadow-2xl max-w-2xl w-[90%] max-h-[85vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()} // Prevent clicks inside from closing the modal
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors"
          aria-label="Close terms of service"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="terms-of-service-title" className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-6">Terms of Service</h2>
        
        <p className="text-[var(--color-text-secondary)] mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <p className="text-[var(--color-text-secondary)] mb-6">
          Welcome to Typing Speed Test! These terms and conditions outline the rules and regulations for the use of our application. By accessing this application, we assume you accept these terms and conditions. Do not continue to use Typing Speed Test if you do not agree to all of the terms and conditions stated on this page.
        </p>

        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">1. Acceptance of Terms</h3>
        <p className="text-[var(--color-text-secondary)] mb-4">
          By using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
        </p>

        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">2. Use of the Service</h3>
        <p className="text-[var(--color-text-secondary)] mb-4">
          You agree to use this application for its intended purpose of testing and improving typing speed. You agree not to use the Service for any unlawful purpose or to engage in any conduct that is harmful, fraudulent, or otherwise objectionable.
        </p>
        
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">3. Disclaimers</h3>
        <p className="text-[var(--color-text-secondary)] mb-4">
          The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the operation of our service or the information, content, or materials included therein. You expressly agree that your use of the service is at your sole risk.
        </p>
        
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">4. Limitation of Liability</h3>
        <p className="text-[var(--color-text-secondary)] mb-4">
          In no event shall Typing Speed Test, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
        
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">5. Changes to These Terms</h3>
        <p className="text-[var(--color-text-secondary)] mb-4">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will notify you of any changes by posting the new Terms of Service on this page. You are advised to review this page periodically for any changes.
        </p>

        <div className="mt-8 text-center">
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-[var(--color-accent-secondary)] text-[var(--color-text-inverted)] font-bold text-lg rounded-md hover:bg-[var(--color-accent-primary)] transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-primary)]"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;