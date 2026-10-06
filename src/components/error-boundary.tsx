import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './button.tsx';
import { Callout } from './feedback.tsx';

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: (error: Error, reset: () => void) => ReactNode }, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  override render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.reset);
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-3 px-6 py-16">
        <Callout tone="danger" title="This page hit an error" action={<Button onClick={() => window.location.reload()}>Reload</Button>}>
          {error.message}
        </Callout>
      </div>
    );
  }
}
