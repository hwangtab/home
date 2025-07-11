import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * 페이지 상태 관리를 위한 통합 훅
 * @param {Object} options - 옵션 설정
 * @returns {Object} 페이지 상태와 관리 함수들
 */
export const usePageState = (options = {}) => {
  const {
    initialLoading = true,
    enableBreadcrumb = false,
    enableHistory = false,
    storageKey = null
  } = options;

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [loadingMessage, setLoadingMessage] = useState('');

  // 에러 상태
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // 성공 메시지
  const [successMessage, setSuccessMessage] = useState('');

  // 페이지 메타데이터
  const [pageTitle, setPageTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');

  // 브레드크럼 (옵션)
  const [breadcrumb, setBreadcrumb] = useState([]);

  // 페이지 히스토리 (옵션)
  const [pageHistory, setPageHistory] = useState([]);

  // 로컬 스토리지 상태 동기화 (옵션)
  const [storageState, setStorageState] = useState(() => {
    if (!storageKey) return null;
    
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 로딩 관리
  const startLoading = useCallback((message = '로딩 중...') => {
    setIsLoading(true);
    setLoadingMessage(message);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  // 에러 관리
  const setErrorState = useCallback((error, message = '오류가 발생했습니다.') => {
    setError(error);
    setErrorMessage(message);
    setIsLoading(false);
    console.error('Page Error:', error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setErrorMessage('');
  }, []);

  // 성공 메시지 관리
  const showSuccess = useCallback((message, duration = 3000) => {
    setSuccessMessage(message);
    if (duration > 0) {
      setTimeout(() => setSuccessMessage(''), duration);
    }
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccessMessage('');
  }, []);

  // 페이지 메타데이터 관리
  const updatePageMeta = useCallback((title, description) => {
    setPageTitle(title);
    setPageDescription(description);
    
    // 실제 document title 업데이트
    if (title) {
      document.title = title;
    }
    
    // 메타 태그 업데이트
    if (description) {
      const metaTag = document.querySelector('meta[name="description"]');
      if (metaTag) {
        metaTag.setAttribute('content', description);
      }
    }
  }, []);

  // 브레드크럼 관리
  const updateBreadcrumb = useCallback((crumbs) => {
    if (!enableBreadcrumb) return;
    setBreadcrumb(Array.isArray(crumbs) ? crumbs : []);
  }, [enableBreadcrumb]);

  const addBreadcrumb = useCallback((crumb) => {
    if (!enableBreadcrumb) return;
    setBreadcrumb(prev => [...prev, crumb]);
  }, [enableBreadcrumb]);

  // 페이지 히스토리 관리
  const addToHistory = useCallback((page) => {
    if (!enableHistory) return;
    
    setPageHistory(prev => {
      const newHistory = [page, ...prev.filter(p => p.path !== page.path)];
      return newHistory.slice(0, 10); // 최대 10개 유지
    });
  }, [enableHistory]);

  // 로컬 스토리지 상태 관리
  const updateStorageState = useCallback((newState) => {
    if (!storageKey) return;
    
    setStorageState(newState);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [storageKey]);

  // 스토리지 상태 초기화
  const clearStorageState = useCallback(() => {
    if (!storageKey) return;
    
    setStorageState(null);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, [storageKey]);

  // 페이지 상태 초기화
  const resetPageState = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
    setError(null);
    setErrorMessage('');
    setSuccessMessage('');
    if (enableBreadcrumb) setBreadcrumb([]);
  }, [enableBreadcrumb]);

  // 페이지 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 타이머나 구독 정리
      setSuccessMessage('');
    };
  }, []);

  // 상태 요약
  const pageStatus = useMemo(() => ({
    isLoading,
    hasError: !!error,
    hasSuccess: !!successMessage,
    isEmpty: !isLoading && !error && !successMessage
  }), [isLoading, error, successMessage]);

  return {
    // 상태들
    isLoading,
    loadingMessage,
    error,
    errorMessage,
    successMessage,
    pageTitle,
    pageDescription,
    breadcrumb,
    pageHistory,
    storageState,
    pageStatus,

    // 로딩 관리
    startLoading,
    stopLoading,

    // 에러 관리
    setErrorState,
    clearError,

    // 성공 메시지 관리
    showSuccess,
    clearSuccess,

    // 페이지 메타데이터 관리
    updatePageMeta,

    // 브레드크럼 관리
    updateBreadcrumb,
    addBreadcrumb,

    // 히스토리 관리
    addToHistory,

    // 스토리지 관리
    updateStorageState,
    clearStorageState,

    // 전체 상태 관리
    resetPageState
  };
};

/**
 * 폼 상태 관리를 위한 훅
 * @param {Object} initialValues - 초기값
 * @param {Function} validator - 유효성 검사 함수
 * @returns {Object} 폼 상태와 관리 함수들
 */
export const useFormState = (initialValues = {}, validator = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 값 변경 처리
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // 에러 상태 초기화
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // 필드 터치 처리
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // 유효성 검사 실행
    if (validator) {
      const fieldErrors = validator(values, name);
      if (fieldErrors && fieldErrors[name]) {
        setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
      }
    }
  }, [values, validator]);

  // 폼 유효성 검사
  const validate = useCallback(() => {
    if (!validator) return {};
    
    const validationErrors = validator(values);
    setErrors(validationErrors || {});
    return validationErrors || {};
  }, [values, validator]);

  // 폼 제출 처리
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return false;
    }
    
    try {
      await onSubmit(values);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // 특정 필드 초기화
  const resetField = useCallback((name) => {
    setValues(prev => ({ ...prev, [name]: initialValues[name] || '' }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    setTouched(prev => {
      const newTouched = { ...prev };
      delete newTouched[name];
      return newTouched;
    });
  }, [initialValues]);

  // 폼 상태 요약
  const formStatus = useMemo(() => ({
    isValid: Object.keys(errors).length === 0,
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
    isTouched: Object.keys(touched).length > 0,
    isSubmitting
  }), [values, initialValues, errors, touched, isSubmitting]);

  return {
    // 상태들
    values,
    errors,
    touched,
    isSubmitting,
    formStatus,

    // 핸들러들
    handleChange,
    handleBlur,
    handleSubmit,

    // 유틸리티들
    validate,
    resetForm,
    resetField,

    // 헬퍼 함수들
    getFieldProps: (name) => ({
      value: values[name] || '',
      onChange: (e) => handleChange(name, e.target.value),
      onBlur: () => handleBlur(name),
      error: errors[name],
      touched: touched[name]
    })
  };
};

export default usePageState;