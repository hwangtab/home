"use client";

import React from 'react';
import { LanguageProvider } from '../i18n';
import { ToastProvider } from '../components/ui/Toast';
import ErrorBoundary from '../components/ErrorBoundary';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <LanguageProvider>
      <ToastProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </ToastProvider>
    </LanguageProvider>
  );
};

export default Providers;
