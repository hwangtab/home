"use client";

import { useEffect, useState } from 'react';

interface CopyrightProps {
  year?: number;
}

export const Copyright = ({ year }: CopyrightProps) => {
  const [currentYear, setCurrentYear] = useState(year ?? 2024);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return <span>&copy; {currentYear}</span>;
};
