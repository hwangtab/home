'use client';

import { useEffect } from 'react';
import type { CSSProperties } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const styles = {
  main: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)',
    color: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  panel: {
    maxWidth: '448px',
    margin: '0 auto',
    textAlign: 'center',
  },
  code: {
    fontSize: '60px',
    lineHeight: 1,
    fontWeight: 700,
    color: '#f59e0b',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 16px',
  },
  description: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#d1d5db',
    margin: '0 0 24px',
  },
  button: {
    border: 0,
    borderRadius: '8px',
    background: '#d97706',
    color: '#ffffff',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
} satisfies Record<string, CSSProperties>;

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('App route error boundary caught error:', error);
  }, [error]);

  return (
    <main style={styles.main}>
      <div style={styles.panel}>
        <div style={styles.code}>500</div>
        <h1 style={styles.title}>Something Went Wrong</h1>
        <p style={styles.description}>
          The page could not be loaded. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          style={styles.button}
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
