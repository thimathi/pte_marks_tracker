import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0b1020] flex items-center justify-center p-6 text-[#edf2ff]">
          <div className="max-w-md w-full bg-[#141c31] border border-[#2b3856] rounded-3xl p-6 sm:p-8 space-y-5 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#edf2ff]">Something went wrong</h2>
              <p className="text-xs text-[#a9b5d0] leading-relaxed">
                An unexpected UI render issue occurred:
              </p>
              <div className="p-3 rounded-xl bg-[#0e1729] border border-[#2b3856] text-[11px] font-mono text-rose-300 text-left overflow-x-auto">
                {this.state.error?.message || 'Unknown error'}
              </div>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
