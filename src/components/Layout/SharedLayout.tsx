"use client";

import type { ReactNode } from 'react';
import Providers from '../../app/providers';
import SiteLayout from '../next/SiteLayout';

interface SharedLayoutProps {
  children: ReactNode;
}

export const SharedLayout = ({ children }: SharedLayoutProps) => {
  return (
    <Providers>
      <SiteLayout>{children}</SiteLayout>
    </Providers>
  );
};
