import React, { useLayoutEffect, ErrorInfo, ReactNode } from 'react';
import MainPage from './components/MainPage';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { applyTheme } from './utils/themes';
import LoadingSpinner from './components/LoadingSpinner';
import { LanguageProvider } from './context/LanguageContext';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Simple Error Boundary to catch runtime crashes
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Inline styles used here to ensure readability even if CSS/Tailwind fails to load
      return (
        <div style={{
          backgroundColor: '#111827',
          color: '#f3f4f6',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            Something went wrong.
          </h1>
          <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            We encountered an unexpected error.
          </p>
          <pre style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '1rem',
            borderRadius: '0.5rem',
            textAlign: 'left',
            overflow: 'auto',
            maxWidth: '100%',
            fontSize: '0.8rem',
            color: '#d1d5db',
            marginBottom: '1.5rem'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ThemedApp: React.FC = () => {
  const { profile, isLoading } = useProfile();
  
  useLayoutEffect(() => {
    // Apply theme from React state to ensure sync
    if (!isLoading) {
      applyTheme(profile.preferences.theme);
    }
  }, [isLoading, profile.preferences.theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <MainPage />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ProfileProvider>
          <ThemedApp />
        </ProfileProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;