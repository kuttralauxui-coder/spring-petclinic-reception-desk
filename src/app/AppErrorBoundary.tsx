import { Component, type PropsWithChildren } from 'react';
import { Button } from '../components/atoms/button';

export class AppErrorBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="mx-auto max-w-lg p-8">
        <h1 className="text-lg font-bold">Spring PetClinic couldn’t open the reception desk</h1>
        <p className="mt-2 text-sm text-slate-600">Reload the page to try again.</p>
        <Button
          variant="default"
          type="button"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Reload reception desk
        </Button>
      </main>
    );
  }
}
