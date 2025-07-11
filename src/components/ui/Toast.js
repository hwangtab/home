import React, { memo, createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

// 토스트 타입 정의
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// 토스트 컨텍스트
const ToastContext = createContext();

// 토스트 프로바이더
export const ToastProvider = memo(({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = TOAST_TYPES.INFO, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration: options.duration || 5000,
      action: options.action,
      persistent: options.persistent || false,
      ...options
    };

    setToasts(prev => [...prev, toast]);

    // 자동 제거 (persistent가 아닌 경우)
    if (!toast.persistent) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // 편의 함수들
  const showSuccess = useCallback((message, options) => {
    return addToast(message, TOAST_TYPES.SUCCESS, options);
  }, [addToast]);

  const showError = useCallback((message, options) => {
    return addToast(message, TOAST_TYPES.ERROR, { duration: 7000, ...options });
  }, [addToast]);

  const showWarning = useCallback((message, options) => {
    return addToast(message, TOAST_TYPES.WARNING, options);
  }, [addToast]);

  const showInfo = useCallback((message, options) => {
    return addToast(message, TOAST_TYPES.INFO, options);
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
});

// 토스트 훅
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// 개별 토스트 컴포넌트
const Toast = memo(({ toast, onRemove }) => {
  const { id, message, type, action } = toast;

  const icons = {
    [TOAST_TYPES.SUCCESS]: CheckCircle,
    [TOAST_TYPES.ERROR]: AlertCircle,
    [TOAST_TYPES.WARNING]: AlertTriangle,
    [TOAST_TYPES.INFO]: Info
  };

  const colors = {
    [TOAST_TYPES.SUCCESS]: {
      bg: 'bg-green-800',
      border: 'border-green-600',
      icon: 'text-green-400',
      text: 'text-green-100'
    },
    [TOAST_TYPES.ERROR]: {
      bg: 'bg-red-800',
      border: 'border-red-600',
      icon: 'text-red-400',
      text: 'text-red-100'
    },
    [TOAST_TYPES.WARNING]: {
      bg: 'bg-yellow-800',
      border: 'border-yellow-600',
      icon: 'text-yellow-400',
      text: 'text-yellow-100'
    },
    [TOAST_TYPES.INFO]: {
      bg: 'bg-blue-800',
      border: 'border-blue-600',
      icon: 'text-blue-400',
      text: 'text-blue-100'
    }
  };

  const IconComponent = icons[type];
  const colorClasses = colors[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.5, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: [0.25, 0.25, 0, 1] }}
      className={`${colorClasses.bg} ${colorClasses.border} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-[500px]`}
    >
      <div className="flex items-start space-x-3">
        {/* 아이콘 */}
        <IconComponent className={`${colorClasses.icon} flex-shrink-0 mt-0.5`} size={20} />
        
        {/* 메시지 */}
        <div className="flex-1">
          <p className={`${colorClasses.text} font-wanted-sans text-sm leading-relaxed`}>
            {message}
          </p>
          
          {/* 액션 버튼 */}
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-2 text-xs font-medium ${colorClasses.text} hover:underline`}
            >
              {action.label}
            </button>
          )}
        </div>
        
        {/* 닫기 버튼 */}
        <button
          onClick={() => onRemove(id)}
          className={`${colorClasses.text} hover:opacity-75 transition-opacity flex-shrink-0`}
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
});

// 토스트 컨테이너
const ToastContainer = memo(() => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});

// 알림 배너 컴포넌트
export const NotificationBanner = memo(({ 
  message, 
  type = TOAST_TYPES.INFO,
  isVisible = true,
  onClose,
  action,
  className = ''
}) => {
  const colors = {
    [TOAST_TYPES.SUCCESS]: 'bg-green-900 border-green-600 text-green-100',
    [TOAST_TYPES.ERROR]: 'bg-red-900 border-red-600 text-red-100',
    [TOAST_TYPES.WARNING]: 'bg-yellow-900 border-yellow-600 text-yellow-100',
    [TOAST_TYPES.INFO]: 'bg-blue-900 border-blue-600 text-blue-100'
  };

  const icons = {
    [TOAST_TYPES.SUCCESS]: CheckCircle,
    [TOAST_TYPES.ERROR]: AlertCircle,
    [TOAST_TYPES.WARNING]: AlertTriangle,
    [TOAST_TYPES.INFO]: Info
  };

  const IconComponent = icons[type];

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`${colors[type]} border-l-4 p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <IconComponent size={20} />
          <span className="font-wanted-sans text-sm">{message}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium hover:underline"
            >
              {action.label}
            </button>
          )}
          
          {onClose && (
            <button
              onClick={onClose}
              className="hover:opacity-75 transition-opacity"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// 인라인 메시지 컴포넌트
export const InlineMessage = memo(({ 
  message, 
  type = TOAST_TYPES.INFO,
  showIcon = true,
  className = ''
}) => {
  const colors = {
    [TOAST_TYPES.SUCCESS]: 'text-green-400',
    [TOAST_TYPES.ERROR]: 'text-red-400',
    [TOAST_TYPES.WARNING]: 'text-yellow-400',
    [TOAST_TYPES.INFO]: 'text-blue-400'
  };

  const icons = {
    [TOAST_TYPES.SUCCESS]: CheckCircle,
    [TOAST_TYPES.ERROR]: AlertCircle,
    [TOAST_TYPES.WARNING]: AlertTriangle,
    [TOAST_TYPES.INFO]: Info
  };

  const IconComponent = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center space-x-2 ${className}`}
    >
      {showIcon && <IconComponent className={colors[type]} size={16} />}
      <span className={`${colors[type]} font-wanted-sans text-sm`}>
        {message}
      </span>
    </motion.div>
  );
});

ToastProvider.displayName = 'ToastProvider';
Toast.displayName = 'Toast';
ToastContainer.displayName = 'ToastContainer';
NotificationBanner.displayName = 'NotificationBanner';
InlineMessage.displayName = 'InlineMessage';

export { TOAST_TYPES };