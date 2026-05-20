
import React, { memo, forwardRef, useState, useEffect, ReactNode, ChangeEvent, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, X, Search } from 'lucide-react';
import { InlineMessage, TOAST_TYPES } from './Toast';

interface InputBaseProps {
    label?: string;
    error?: string;
    helper?: string;
    required?: boolean;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
    children?: ReactNode;
    id?: string;
}

const InputBase = memo(forwardRef<HTMLDivElement, InputBaseProps>(({
    label, error, helper, required = false, className = '', inputClassName = '', labelClassName = '', children, ...props
}, ref) => {
    return (
        <div className={`space-y-2 ${className}`} ref={ref}>
            {label && (
                <label htmlFor={props.id} className={`block text-sm font-medium text-gray-200 font-wanted-sans ${labelClassName}`}>
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <div className="relative">{children}</div>
            <AnimatePresence mode="wait">
                {error && <InlineMessage key="error" message={error} type={TOAST_TYPES.ERROR} showIcon={true} />}
                {!error && helper && (
                    <motion.p key="helper" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-sm text-gray-400 font-wanted-sans">
                        {helper}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}));

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    helper?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'filled' | 'outlined';
    validation?: (value: string) => boolean | string;
    realTimeValidation?: boolean;
}

export const Input = memo(forwardRef<HTMLInputElement, InputProps>(({
    type = 'text', size = 'md', variant = 'default', leftIcon = null, rightIcon = null, validation = null,
    realTimeValidation = false, className = '', onChange, onBlur, value, error, helper, label, ...props
}, ref) => {
    const [internalValue, setInternalValue] = useState<string | number | readonly string[]>(typeof value === 'string' || value === undefined ? '' : value);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const sizeClasses = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-4 py-3 text-base' };
    const variantClasses = {
        default: 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400',
        filled: 'bg-gray-800 border-transparent text-gray-100 placeholder-gray-400',
        outlined: 'bg-transparent border-gray-500 text-gray-100 placeholder-gray-400'
    };

    const getBorderClass = () => {
        if (error) return 'border-red-500 focus:border-red-400';
        if (isValid === true) return 'border-green-500 focus:border-green-400';
        if (isFocused) return 'border-blue-500 focus:border-blue-400';
        return 'focus:border-blue-500';
    };

    useEffect(() => {
        if (realTimeValidation && validation && internalValue) {
            const result = validation(String(internalValue));
            setIsValid(result === true);
        }
    }, [internalValue, validation, realTimeValidation]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        if (onChange) onChange(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (validation && internalValue) {
            const result = validation(String(internalValue));
            setIsValid(result === true);
        }
        if (onBlur) onBlur(e);
    };

    const baseClasses = [
        'w-full', 'border rounded-lg', 'transition-[border-color,box-shadow] duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50', 'font-wanted-sans',
        sizeClasses[size], variantClasses[variant], getBorderClass(),
        leftIcon ? 'pl-10' : '', rightIcon || (realTimeValidation && isValid !== null) ? 'pr-10' : '', className
    ].filter(Boolean).join(' ');

    return (
        <InputBase label={label} error={error} helper={helper} id={props.id} required={props.required}>
            {leftIcon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{leftIcon}</div>}
            <input
                ref={ref} type={type} value={value !== undefined ? value : internalValue} onChange={handleChange}
                onBlur={handleBlur} onFocus={() => setIsFocused(true)} className={baseClasses} {...props}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {realTimeValidation && isValid !== null && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                        {isValid ? <Check className="text-green-500" size={16} /> : <X className="text-red-500" size={16} />}
                    </motion.div>
                )}
                {!realTimeValidation && rightIcon && <div className="text-gray-400">{rightIcon}</div>}
            </div>
        </InputBase>
    );
}));

export const PasswordInput = memo(forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    return (
        <Input
            ref={ref} type={showPassword ? 'text' : 'password'}
            rightIcon={
                <button type="button" onClick={togglePasswordVisibility} className="text-gray-400 hover:text-gray-200 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            }
            {...props}
        />
    );
}));

interface SearchInputProps extends InputProps {
    onSearch?: (value: string) => void;
    searchDelay?: number;
}

export const SearchInput = memo(forwardRef<HTMLInputElement, SearchInputProps>(({ onSearch, searchDelay = 300, placeholder = 'Search...', ...props }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!onSearch) return;
        const delayedSearch = setTimeout(() => { if (searchTerm) onSearch(searchTerm); }, searchDelay);
        return () => clearTimeout(delayedSearch);
    }, [searchTerm, onSearch, searchDelay]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

    return <Input ref={ref} type="text" placeholder={placeholder} leftIcon={<Search size={16} />} value={searchTerm} onChange={handleChange} {...props} />;
}));

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helper?: string;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = memo(forwardRef<HTMLTextAreaElement, TextareaProps>(({ rows = 4, resize = 'vertical', className = '', ...props }, ref) => {
    const resizeClasses = { none: 'resize-none', vertical: 'resize-y', horizontal: 'resize-x', both: 'resize' };
    const baseClasses = [
        'w-full', 'px-4 py-3', 'bg-gray-700 border border-gray-600', 'text-gray-100 placeholder-gray-400',
        'rounded-lg', 'transition-[border-color,box-shadow] duration-200', 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
        'focus:border-blue-500', 'font-wanted-sans', resizeClasses[resize], className
    ].filter(Boolean).join(' ');

    return (
        <InputBase label={props.label} error={props.error} helper={props.helper} id={props.id} required={props.required}>
            <textarea ref={ref} rows={rows} className={baseClasses} {...props} />
        </InputBase>
    );
}));

interface Option { value: string | number; label: string; }

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    error?: string;
    helper?: string;
    options?: Option[];
    size?: 'sm' | 'md' | 'lg';
    placeholder?: string;
}

export const Select = memo(forwardRef<HTMLSelectElement, SelectProps>(({ options = [], placeholder = 'Select an option', size = 'md', className = '', ...props }, ref) => {
    const sizeClasses = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-4 py-3 text-base' };
    const baseClasses = [
        'w-full', 'bg-gray-700 border border-gray-600', 'text-gray-100', 'rounded-lg',
        'transition-[border-color,box-shadow] duration-200', 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
        'focus:border-blue-500', 'font-wanted-sans', sizeClasses[size], className
    ].filter(Boolean).join(' ');

    return (
        <InputBase label={props.label} error={props.error} helper={props.helper} id={props.id} required={props.required}>
            <select ref={ref} className={baseClasses} {...props}>
                {placeholder && <option value="" disabled>{placeholder}</option>}
                {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </InputBase>
    );
}));

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'green' | 'purple';
    labelClassName?: string;
}

export const Checkbox = memo(forwardRef<HTMLInputElement, CheckboxProps>(({ label, error, size = 'md', color = 'blue', className = '', labelClassName = '', ...props }, ref) => {
    const sizeClasses = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
    const colorClasses = { blue: 'text-blue-600 focus:ring-blue-500', green: 'text-green-600 focus:ring-green-500', purple: 'text-purple-600 focus:ring-purple-500' };

    return (
        <div className={className}>
            <div className="flex items-center">
                <input
                    ref={ref} type="checkbox" className={`${sizeClasses[size]} ${colorClasses[color]} bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-opacity-50 transition-colors duration-200`}
                    {...props}
                />
                {label && (
                    <label htmlFor={props.id} className={`ml-3 text-sm text-gray-200 font-wanted-sans cursor-pointer ${labelClassName}`}>
                        {label}
                    </label>
                )}
            </div>
            {error && <div className="mt-1"><InlineMessage message={error} type={TOAST_TYPES.ERROR} showIcon={true} /></div>}
        </div>
    );
}));

interface RadioGroupProps {
    options?: Option[];
    name?: string;
    value?: string | number;
    onChange?: (value: string) => void;
    error?: string;
    className?: string;
    orientation?: 'vertical' | 'horizontal';
}

export const RadioGroup = memo<RadioGroupProps>(({ options = [], name, value, onChange, error, className = '', orientation = 'vertical' }) => {
    const orientationClasses = orientation === 'horizontal' ? 'flex flex-wrap gap-6' : 'space-y-3';
    return (
        <div className={className}>
            <div className={orientationClasses}>
                {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                        <input
                            id={`${name}-${option.value}`} name={name} type="radio" value={option.value} checked={value === option.value}
                            onChange={(e) => onChange && onChange(e.target.value)}
                            className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor={`${name}-${option.value}`} className="ml-3 text-sm text-gray-200 font-wanted-sans cursor-pointer">
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
            {error && <div className="mt-2"><InlineMessage message={error} type={TOAST_TYPES.ERROR} showIcon={true} /></div>}
        </div>
    );
});

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLButtonElement>, 'onChange' | 'size'> {
    label?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'green' | 'purple';
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}

export const Switch = memo(forwardRef<HTMLButtonElement, SwitchProps>(({ label, description, size = 'md', color = 'blue', className = '', ...props }, ref) => {
    const sizeClasses = {
        sm: { container: 'h-5 w-9', toggle: 'h-4 w-4' }, md: { container: 'h-6 w-11', toggle: 'h-5 w-5' }, lg: { container: 'h-7 w-14', toggle: 'h-6 w-6' }
    };
    const colorClasses = { blue: 'bg-blue-600', green: 'bg-green-600', purple: 'bg-purple-600' };
    const { container, toggle } = sizeClasses[size];

    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div className="flex-1">
                {label && <label htmlFor={props.id} className="text-sm font-medium text-gray-200 font-wanted-sans cursor-pointer">{label}</label>}
                {description && <p className="text-sm text-gray-400 font-wanted-sans">{description}</p>}
            </div>
            <button
                ref={ref} type="button" role="switch" aria-checked={props.checked} onClick={() => props.onChange && props.onChange(!props.checked)}
                className={`relative inline-flex flex-shrink-0 ${container} border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${props.checked ? colorClasses[color] : 'bg-gray-600'}`}
            >
                <span className={`${toggle} inline-block bg-white rounded-full shadow transform ring-0 transition ease-in-out duration-200 ${props.checked ? 'translate-x-5' : 'translate-x-0'}`} />
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
