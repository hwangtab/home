import React, { memo, forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, X, AlertCircle, Search } from 'lucide-react';
import { InlineMessage, TOAST_TYPES } from './Toast';

// 입력 필드 베이스 컴포넌트
const InputBase = memo(forwardRef(({
  label,
  error,
  helper,
  required = false,
  className = '',
  inputClassName = '',
  labelClassName = '',
  children,
  ...props
}, ref) => {
  const hasError = !!error;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 라벨 */}
      {label && (
        <label 
          htmlFor={props.id}
          className={`block text-sm font-medium text-gray-200 font-wanted-sans ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {/* 입력 필드 */}
      <div className="relative">
        {children}
      </div>
      
      {/* 에러 또는 헬퍼 텍스트 */}
      <AnimatePresence mode="wait">
        {error && (
          <InlineMessage 
            key="error"
            message={error} 
            type={TOAST_TYPES.ERROR}
            showIcon={true}
          />
        )}
        {!error && helper && (
          <motion.p
            key="helper"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-gray-400 font-wanted-sans"
          >
            {helper}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}));

// 텍스트 입력 필드
export const Input = memo(forwardRef(({
  type = 'text',
  size = 'md',
  variant = 'default',
  leftIcon = null,
  rightIcon = null,
  validation = null,
  realTimeValidation = false,
  className = '',
  onChange,
  onBlur,
  value,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const [isValid, setIsValid] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  // 크기 스타일
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  // 변형 스타일
  const variantClasses = {
    default: 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400',
    filled: 'bg-gray-800 border-transparent text-gray-100 placeholder-gray-400',
    outlined: 'bg-transparent border-gray-500 text-gray-100 placeholder-gray-400'
  };

  // 상태별 보더 스타일
  const getBorderClass = () => {
    if (props.error) return 'border-red-500 focus:border-red-400';
    if (isValid === true) return 'border-green-500 focus:border-green-400';
    if (isFocused) return 'border-blue-500 focus:border-blue-400';
    return 'focus:border-blue-500';
  };

  // 실시간 유효성 검사
  useEffect(() => {
    if (realTimeValidation && validation && internalValue) {
      const result = validation(internalValue);
      setIsValid(result === true);
    }
  }, [internalValue, validation, realTimeValidation]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (onChange) onChange(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (validation && internalValue) {
      const result = validation(internalValue);
      setIsValid(result === true);
    }
    if (onBlur) onBlur(e);
  };

  const baseClasses = [
    'w-full',
    'border rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
    'font-wanted-sans',
    sizeClasses[size],
    variantClasses[variant],
    getBorderClass(),
    leftIcon ? 'pl-10' : '',
    rightIcon || (realTimeValidation && isValid !== null) ? 'pr-10' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="relative">
      {/* 왼쪽 아이콘 */}
      {leftIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
      )}
      
      {/* 입력 필드 */}
      <input
        ref={ref}
        type={type}
        value={value !== undefined ? value : internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => setIsFocused(true)}
        className={baseClasses}
        {...props}
      />
      
      {/* 오른쪽 아이콘 또는 유효성 검사 표시 */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        {realTimeValidation && isValid !== null && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {isValid ? (
              <Check className="text-green-500" size={16} />
            ) : (
              <X className="text-red-500" size={16} />
            )}
          </motion.div>
        )}
        {!realTimeValidation && rightIcon && (
          <div className="text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}));

// 비밀번호 입력 필드
export const PasswordInput = memo(forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
      {...props}
    />
  );
}));

// 검색 입력 필드
export const SearchInput = memo(forwardRef(({
  onSearch,
  searchDelay = 300,
  placeholder = '검색...',
  ...props
}, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!onSearch) return;
    
    const delayedSearch = setTimeout(() => {
      if (searchTerm) {
        onSearch(searchTerm);
      }
    }, searchDelay);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, onSearch, searchDelay]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Input
      ref={ref}
      type="text"
      placeholder={placeholder}
      leftIcon={<Search size={16} />}
      value={searchTerm}
      onChange={handleChange}
      {...props}
    />
  );
}));

// 텍스트 영역
export const Textarea = memo(forwardRef(({
  rows = 4,
  resize = 'vertical',
  className = '',
  ...props
}, ref) => {
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };

  const baseClasses = [
    'w-full',
    'px-4 py-3',
    'bg-gray-700 border border-gray-600',
    'text-gray-100 placeholder-gray-400',
    'rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
    'focus:border-blue-500',
    'font-wanted-sans',
    resizeClasses[resize],
    className
  ].filter(Boolean).join(' ');

  return (
    <textarea
      ref={ref}
      rows={rows}
      className={baseClasses}
      {...props}
    />
  );
}));

// 선택 박스
export const Select = memo(forwardRef(({
  options = [],
  placeholder = '선택하세요',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const baseClasses = [
    'w-full',
    'bg-gray-700 border border-gray-600',
    'text-gray-100',
    'rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
    'focus:border-blue-500',
    'font-wanted-sans',
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <select
      ref={ref}
      className={baseClasses}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}));

// 체크박스
export const Checkbox = memo(forwardRef(({
  label,
  error,
  size = 'md',
  color = 'blue',
  className = '',
  labelClassName = '',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const colorClasses = {
    blue: 'text-blue-600 focus:ring-blue-500',
    green: 'text-green-600 focus:ring-green-500',
    purple: 'text-purple-600 focus:ring-purple-500'
  };

  return (
    <div className={className}>
      <div className="flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className={`
            ${sizeClasses[size]}
            ${colorClasses[color]}
            bg-gray-700 border-gray-600 rounded
            focus:ring-2 focus:ring-opacity-50
            transition-colors duration-200
          `}
          {...props}
        />
        {label && (
          <label 
            htmlFor={props.id}
            className={`ml-3 text-sm text-gray-200 font-wanted-sans cursor-pointer ${labelClassName}`}
          >
            {label}
          </label>
        )}
      </div>
      
      {error && (
        <div className="mt-1">
          <InlineMessage 
            message={error} 
            type={TOAST_TYPES.ERROR}
            showIcon={true}
          />
        </div>
      )}
    </div>
  );
}));

// 라디오 버튼
export const RadioGroup = memo(({ 
  options = [], 
  name, 
  value, 
  onChange,
  error,
  className = '',
  orientation = 'vertical'
}) => {
  const orientationClasses = orientation === 'horizontal' ? 'flex flex-wrap gap-6' : 'space-y-3';

  return (
    <div className={className}>
      <div className={orientationClasses}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange && onChange(e.target.value)}
              className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
            />
            <label 
              htmlFor={`${name}-${option.value}`}
              className="ml-3 text-sm text-gray-200 font-wanted-sans cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="mt-2">
          <InlineMessage 
            message={error} 
            type={TOAST_TYPES.ERROR}
            showIcon={true}
          />
        </div>
      )}
    </div>
  );
});

// 스위치 토글
export const Switch = memo(forwardRef(({
  label,
  description,
  size = 'md',
  color = 'blue',
  className = '',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: { container: 'h-5 w-9', toggle: 'h-4 w-4' },
    md: { container: 'h-6 w-11', toggle: 'h-5 w-5' },
    lg: { container: 'h-7 w-14', toggle: 'h-6 w-6' }
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600'
  };

  const { container, toggle } = sizeClasses[size];

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1">
        {label && (
          <label 
            htmlFor={props.id}
            className="text-sm font-medium text-gray-200 font-wanted-sans cursor-pointer"
          >
            {label}
          </label>
        )}
        {description && (
          <p className="text-sm text-gray-400 font-wanted-sans">
            {description}
          </p>
        )}
      </div>
      
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={props.checked}
        onClick={() => props.onChange && props.onChange(!props.checked)}
        className={`
          relative inline-flex flex-shrink-0 ${container} border-2 border-transparent 
          rounded-full cursor-pointer transition-colors ease-in-out duration-200 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${props.checked ? colorClasses[color] : 'bg-gray-600'}
        `}
      >
        <span
          className={`
            ${toggle} inline-block bg-white rounded-full shadow transform ring-0 
            transition ease-in-out duration-200
            ${props.checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}));

InputBase.displayName = 'InputBase';
Input.displayName = 'Input';
PasswordInput.displayName = 'PasswordInput';
SearchInput.displayName = 'SearchInput';
Textarea.displayName = 'Textarea';
Select.displayName = 'Select';
Checkbox.displayName = 'Checkbox';
RadioGroup.displayName = 'RadioGroup';
Switch.displayName = 'Switch';

export default Input;