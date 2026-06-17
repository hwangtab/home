"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { WORK_CATEGORIES, type WorkCategory } from '../types/data.types';

const WORK_FILTER_SET = new Set<string>(['all', ...WORK_CATEGORIES]);

interface WorksQuerySyncProps {
  onCategoryChange: (category: WorkCategory | 'all') => void;
  onWorkIdChange: (workId: string | null) => void;
}

const isWorkFilter = (value: string | null): value is WorkCategory | 'all' => {
  return value !== null && WORK_FILTER_SET.has(value);
};

const WorksQuerySync = ({ onCategoryChange, onWorkIdChange }: WorksQuerySyncProps) => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category');
  const workIdParam = searchParams?.get('id');

  useEffect(() => {
    if (isWorkFilter(categoryParam)) {
      onCategoryChange(categoryParam);
    }
  }, [categoryParam, onCategoryChange]);

  useEffect(() => {
    onWorkIdChange(workIdParam);
  }, [workIdParam, onWorkIdChange]);

  return null;
};

export default WorksQuerySync;
