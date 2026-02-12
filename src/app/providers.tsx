"use client";

import React from 'react';
import { LanguageProvider } from '../i18n';
import { ToastProvider } from '../components/ui/Toast';
import { AnimationProvider } from '../context/AnimationContext';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AnimationProvider>{children}</AnimationProvider>
      </ToastProvider>
    </LanguageProvider>
  );
};

export default Providers;
