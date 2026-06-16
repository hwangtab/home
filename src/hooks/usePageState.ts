import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

interface PageStateOptions {
    initialLoading?: boolean;
    enableBreadcrumb?: boolean;
    enableHistory?: boolean;
    storageKey?: string | null;
}

interface Breadcrumb {
    label: string;
    path?: string;
}

interface HistoryEntry {
    path: string;
    title?: string;
}

interface PageStatus {
    isLoading: boolean;
    hasError: boolean;
    hasSuccess: boolean;
    isEmpty: boolean;
}

interface PageStateReturn {
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

/**
 * 페이지 상태 관리를 위한 통합 훅
 */
export const usePageState = (options: PageStateOptions = {}): PageStateReturn => {
    const {
        initialLoading = true,
        enableBreadcrumb = false,
        enableHistory = false,
        storageKey = null
    } = options;

    const [isLoading, setIsLoading] = useState(initialLoading);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<Error | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [pageTitle, setPageTitle] = useState('');
    const [pageDescription, setPageDescription] = useState('');
    const [breadcrumb, setBreadcrumb] = useState<Breadcrumb[]>([]);
    const [pageHistory, setPageHistory] = useState<HistoryEntry[]>([]);
    const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [storageState, setStorageState] = useState<unknown>(() => {
        if (!storageKey || typeof window === 'undefined') return null;
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : null;
        } catch (err) {
            console.warn('Failed to load localStorage state:', err);
            return null;
        }
    });

    const startLoading = useCallback((message = 'Loading...') => {
        setIsLoading(true);
        setLoadingMessage(message);
        setError(null);
    }, []);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
        setLoadingMessage('');
    }, []);

    const setErrorState = useCallback((err: Error, message = 'An error occurred.') => {
        setError(err);
        setErrorMessage(message);
        setIsLoading(false);
        console.error('Page Error:', err);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
        setErrorMessage('');
    }, []);

    const showSuccess = useCallback((message: string, duration = 3000) => {
        if (successTimerRef.current) {
            clearTimeout(successTimerRef.current);
            successTimerRef.current = null;
        }

        setSuccessMessage(message);
        if (duration > 0) {
            successTimerRef.current = setTimeout(() => {
                setSuccessMessage('');
                successTimerRef.current = null;
            }, duration);
        }
    }, []);

    const clearSuccess = useCallback(() => {
        if (successTimerRef.current) {
            clearTimeout(successTimerRef.current);
            successTimerRef.current = null;
        }
        setSuccessMessage('');
    }, []);

    const updatePageMeta = useCallback((title: string, description: string) => {
        setPageTitle(title);
        setPageDescription(description);
        if (title) document.title = title;
        if (description) {
            const metaTag = document.querySelector('meta[name="description"]');
            if (metaTag) metaTag.setAttribute('content', description);
        }
    }, []);

    const updateBreadcrumb = useCallback((crumbs: Breadcrumb[]) => {
        if (!enableBreadcrumb) return;
        setBreadcrumb(Array.isArray(crumbs) ? crumbs : []);
    }, [enableBreadcrumb]);

    const addBreadcrumb = useCallback((crumb: Breadcrumb) => {
        if (!enableBreadcrumb) return;
        setBreadcrumb(prev => [...prev, crumb]);
    }, [enableBreadcrumb]);

    const addToHistory = useCallback((page: HistoryEntry) => {
        if (!enableHistory) return;
        setPageHistory(prev => {
            const newHistory = [page, ...prev.filter(p => p.path !== page.path)];
            return newHistory.slice(0, 10);
        });
    }, [enableHistory]);

    const updateStorageState = useCallback((newState: unknown) => {
        if (!storageKey) return;
        setStorageState(newState);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newState));
        } catch (err) {
            console.error('Failed to save to localStorage:', err);
        }
    }, [storageKey]);

    const clearStorageState = useCallback(() => {
        if (!storageKey) return;
        setStorageState(null);
        try {
            localStorage.removeItem(storageKey);
        } catch (err) {
            console.error('Failed to clear localStorage:', err);
        }
    }, [storageKey]);

    const resetPageState = useCallback(() => {
        setIsLoading(false);
        setLoadingMessage('');
        setError(null);
        setErrorMessage('');
        setSuccessMessage('');
        if (enableBreadcrumb) setBreadcrumb([]);
    }, [enableBreadcrumb]);

    useEffect(() => {
        return () => {
            if (successTimerRef.current) {
                clearTimeout(successTimerRef.current);
            }
        };
    }, []);

    const pageStatus = useMemo((): PageStatus => ({
        isLoading,
        hasError: !!error,
        hasSuccess: !!successMessage,
        isEmpty: !isLoading && !error && !successMessage
    }), [isLoading, error, successMessage]);

    return {
        isLoading, loadingMessage, error, errorMessage, successMessage,
        pageTitle, pageDescription, breadcrumb, pageHistory, storageState, pageStatus,
        startLoading, stopLoading, setErrorState, clearError,
        showSuccess, clearSuccess, updatePageMeta,
        updateBreadcrumb, addBreadcrumb, addToHistory,
        updateStorageState, clearStorageState, resetPageState
    };
};

// Form State types
interface FormStatus {
    isValid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    isSubmitting: boolean;
}

interface FieldProps<T> {
    value: T;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
    error?: string;
    touched: boolean;
}

type ValidatorFunction<T> = (values: T, field?: keyof T) => Partial<Record<keyof T, string>> | null;

interface FormStateReturn<T extends Record<string, unknown>> {
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

/**
 * 폼 상태 관리를 위한 훅
 */
export const useFormState = <T extends Record<string, unknown>>(
    initialValues: T,
    validator: ValidatorFunction<T> | null = null
): FormStateReturn<T> => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((name: keyof T, value: T[keyof T]) => {
        setValues(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }, [errors]);

    const handleBlur = useCallback((name: keyof T) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        if (validator) {
            const fieldErrors = validator(values, name);
            if (fieldErrors && fieldErrors[name]) {
                setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
            }
        }
    }, [values, validator]);

    const validate = useCallback(() => {
        if (!validator) return {};
        const validationErrors = validator(values) || {};
        setErrors(validationErrors);
        return validationErrors;
    }, [values, validator]);

    const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
        setIsSubmitting(true);
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setIsSubmitting(false);
            return false;
        }
        try {
            await onSubmit(values);
            return true;
        } catch (err) {
            console.error('Form submission error:', err);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [values, validate]);

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    const resetField = useCallback((name: keyof T) => {
        setValues(prev => ({ ...prev, [name]: initialValues[name] ?? ('' as T[keyof T]) }));
        setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
        setTouched(prev => { const n = { ...prev }; delete n[name]; return n; });
    }, [initialValues]);

    const formStatus = useMemo((): FormStatus => ({
        isValid: Object.keys(errors).length === 0,
        isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
        isTouched: Object.keys(touched).length > 0,
        isSubmitting
    }), [values, initialValues, errors, touched, isSubmitting]);

    const getFieldProps = useCallback(<K extends keyof T>(name: K): FieldProps<T[K]> => ({
        value: values[name],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const value = e.target.value;
          // String input에서 오는 값은 기본적으로 string 타입
          // T[K]가 string을 포함하는 경우에만 안전
          handleChange(name, value as unknown as T[K]);
        },
        onBlur: () => handleBlur(name),
        error: errors[name],
        touched: !!touched[name]
    }), [values, errors, touched, handleChange, handleBlur]);

    return {
        values, errors, touched, isSubmitting, formStatus,
        handleChange, handleBlur, handleSubmit, validate, resetForm, resetField, getFieldProps
    };
};

export default usePageState;
