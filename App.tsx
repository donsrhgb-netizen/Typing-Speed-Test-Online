import React, { useLayoutEffect, Component, ErrorInfo, ReactNode } from 'react';
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
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8 text-center flex-col">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong.</h1>
          <p className="mb-4">We encountered an unexpected error.</p>
          <pre className="bg-black/50 p-4 rounded text-left overflow-auto max-w-full text-xs text-gray-300">
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors"
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
    // Apply theme from React state to ensure sync, 
    // even though index.html tried to do it initially.
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