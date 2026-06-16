'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function EnglishErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('English route error boundary caught error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 text-gray-100">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="text-6xl font-bold text-brand-primary-500 font-santokki">500</div>
        <h1 className="text-2xl font-bold text-white font-santokki">Something Went Wrong</h1>
        <p className="text-gray-300 font-wanted-sans">
          The page could not be loaded. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-block px-6 py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors font-wanted-sans"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
