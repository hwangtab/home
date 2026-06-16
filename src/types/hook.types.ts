import type { Work, WorkCategory } from './data.types';

// useDataProcessor Types
export interface DataProcessorOptions<T> {
    filterKey?: keyof T;
    sortKey?: keyof T;
    sortOrder?: 'asc' | 'desc';
    groupBy?: keyof T | null;
    searchKeys?: (keyof T)[];
    enableSearch?: boolean;
    enableFilter?: boolean;
    enableSort?: boolean;
}

export interface DataStats<T = Work> {
    total: number;
    byType: Record<string, number>;
    byYear: Record<number, number>;
    latest: T | null;
    oldest: T | null;
}

export interface PaginationResult<T> {
    data: T[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface ProcessFilters<T> {
    filterValue?: string;
    searchTerm?: string;
    customFilter?: (item: T) => boolean;
    page?: number;
    itemsPerPage?: number;
}

export interface DataProcessorReturn<T> {
    data: T[];
    groupedData: Record<string, T[]> | T[];
    filterData: (filterValue: string) => T[];
    searchData: (searchTerm: string, targetData?: T[]) => T[];
    paginateData: (targetData: T[], page?: number, itemsPerPage?: number) => PaginationResult<T>;
    processData: (filters?: ProcessFilters<T>) => T[] | PaginationResult<T>;
    uniqueFilterValues: string[];
    dataStats: DataStats<T>;
    options: DataProcessorOptions<T>;
}

// useWorksData Types
export interface CategorizedData {
    music: Work[];
    visual: Work[];
    writing: Work[];
    performance: Work[];
    struggle: Work[];
    all: Work[];
}

export interface TimelineYear {
    year: number;
    events: Work[];
}

export interface YearlyStats {
    [year: number]: {
        total: number;
        byType: Record<string, number>;
    };
}

export interface WorksDataReturn<T = Work> extends DataProcessorReturn<T> {
    categorizedData: CategorizedData;
    timelineData: TimelineYear[];
    flattenedEvents: T[];
    yearlyStats: YearlyStats;
    getWorksByCategory: (category: WorkCategory) => Work[];
    getEventsByYear: (year: number) => Work[];
    getEventsByType: (type: string) => Work[];
    searchEvents: (searchTerm: string) => Work[];
}

// usePageState Types
export interface PageStateOptions {
    initialLoading?: boolean;
    enableBreadcrumb?: boolean;
    enableHistory?: boolean;
    storageKey?: string | null;
}

export interface Breadcrumb {
    label: string;
    path?: string;
}

export interface HistoryEntry {
    path: string;
    title?: string;
}

export interface PageStatus {
    isLoading: boolean;
    hasError: boolean;
    hasSuccess: boolean;
    isEmpty: boolean;
}

export interface PageStateReturn {
    isLoading: boolean;
    loadingMessage: string;
    error: Error | null;
    errorMessage: string;
    successMessage: string;
    pageTitle: string;
    pageDescription: string;
    breadcrumb: Breadcrumb[];
    pageHistory: HistoryEntry[];
    storageState: unknown;
    pageStatus: PageStatus;
    startLoading: (message?: string) => void;
    stopLoading: () => void;
    setErrorState: (error: Error, message?: string) => void;
    clearError: () => void;
    showSuccess: (message: string, duration?: number) => void;
    clearSuccess: () => void;
    updatePageMeta: (title: string, description: string) => void;
    updateBreadcrumb: (crumbs: Breadcrumb[]) => void;
    addBreadcrumb: (crumb: Breadcrumb) => void;
    addToHistory: (page: HistoryEntry) => void;
    updateStorageState: (newState: unknown) => void;
    clearStorageState: () => void;
    resetPageState: () => void;
}

// useCardActions Types
export interface CardActionsOptions {
    enableMusicPlayer?: boolean;
    enableModal?: boolean;
}

export interface MusicPlayerState {
    playlist: Work[];
    musicPlayerVisible: boolean;
    openMusicPlayer: (works: Work | Work[]) => void;
    closeMusicPlayer: () => void;
}

export interface ModalState {
    selectedItem: Work | null;
    isModalOpen: boolean;
    openModal: (item: Work) => void;
    closeModal: () => void;
}

export interface CardActions {
    handleCardClick: (work: Work) => void;
    openExternalLink: (url: string) => void;
    shareWork: (work: Work) => Promise<void>;
    toggleFavorite: (work: Work) => void;
    isFavorite: (workId: string) => boolean;
}

export interface CardActionsReturn {
    musicPlayer: MusicPlayerState;
    modal: ModalState;
    actions: CardActions;
    favorites: string[];
}

// useFormState Types
export interface FormStatus {
    isValid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    isSubmitting: boolean;
}

export interface FieldProps<T> {
    value: T;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
    error?: string;
    touched: boolean;
}

export interface FormStateReturn<T extends Record<string, unknown>> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isSubmitting: boolean;
    formStatus: FormStatus;
    handleChange: (name: keyof T, value: T[keyof T]) => void;
    handleBlur: (name: keyof T) => void;
    handleSubmit: (onSubmit: (values: T) => Promise<void>) => Promise<boolean>;
    validate: () => Partial<Record<keyof T, string>>;
    resetForm: () => void;
    resetField: (name: keyof T) => void;
    getFieldProps: <K extends keyof T>(name: K) => FieldProps<T[K]>;
}

// usePageData Types
export interface PageDataReturn<T = unknown> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}
