import React, { lazy, Suspense, ComponentType } from 'react';
import { Alert, Spin } from 'antd';

/**
 * Error boundary component to catch errors in lazy-loaded components
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          message="Something went wrong"
          description="The component failed to load. Please try refreshing the page."
          type="error"
          showIcon
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default loading component used during component loading
 */
const DefaultLoading = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <Spin size="large" />
  </div>
);

/**
 * Safely lazy loads a component with error boundary and loading indicator
 * @param factory Function that imports the component
 * @param LoadingComponent Optional custom loading component
 * @returns Lazy-loaded component wrapped in error boundary and suspense
 */
export function lazyLoad<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  LoadingComponent = DefaultLoading
) {
  const LazyComponent = lazy(factory);

  return (props: React.ComponentProps<T>) => (
    <ErrorBoundary>
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default lazyLoad; 