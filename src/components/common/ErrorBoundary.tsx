import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {this.props.fallbackTitle || 'Something went wrong in this section'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4">
            {this.props.fallbackMessage ||
              this.state.error?.message ||
              'An unexpected issue occurred while rendering this component. You can reload or try again.'}
          </p>
          <button
            onClick={this.handleReset}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 shadow-sm transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
