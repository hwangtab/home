import React, { memo, forwardRef, ReactNode, ReactElement } from 'react';
import { motion, MotionProps, useReducedMotion } from 'framer-motion';
import { ButtonLoadingSpinner } from './LoadingSpinner';

type ButtonVariant = 'primary' | 'solidarity' | 'earth' | 'harmony' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonAnimation = 'default' | 'bounce' | 'slide' | 'pulse' | 'subtle' | 'magnetic' | 'glow';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    animation?: ButtonAnimation;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    loadingText?: string;
    className?: string;
}


const BUTTON_VARIANTS: Record<ButtonVariant, { base: string; disabled: string; loading: string }> = {
    primary: {
        base: 'bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 hover:from-brand-primary-500 hover:to-brand-primary-600 text-white shadow-lg hover:shadow-xl border border-brand-primary-500/20 hover:border-brand-primary-400/30',
        disabled: 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50',
        loading: 'bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 text-white cursor-wait'
    },
    solidarity: {
        base: 'bg-gradient-to-r from-brand-solidarity-600 to-brand-solidarity-700 hover:from-brand-solidarity-500 hover:to-brand-solidarity-600 text-white shadow-lg hover:shadow-xl border border-brand-solidarity-500/20 hover:border-brand-solidarity-400/30',
        disabled: 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50',
        loading: 'bg-gradient-to-r from-brand-solidarity-600 to-brand-solidarity-700 text-white cursor-wait'
    },
    earth: {
        base: 'bg-gradient-to-r from-brand-earth-600 to-brand-earth-700 hover:from-brand-earth-500 hover:to-brand-earth-600 text-white shadow-lg hover:shadow-xl border border-brand-earth-500/20 hover:border-brand-earth-400/30',
        disabled: 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50',
        loading: 'bg-gradient-to-r from-brand-earth-600 to-brand-earth-700 text-white cursor-wait'
    },
    harmony: {
        base: 'bg-gradient-to-r from-brand-harmony-600 to-brand-harmony-700 hover:from-brand-harmony-500 hover:to-brand-harmony-600 text-white shadow-lg hover:shadow-xl border border-brand-harmony-500/20 hover:border-brand-harmony-400/30',
        disabled: 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50',
        loading: 'bg-gradient-to-r from-brand-harmony-600 to-brand-harmony-700 text-white cursor-wait'
    },
    secondary: {
        base: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-md hover:shadow-lg border border-gray-500/20 hover:border-gray-400/30',
        disabled: 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50',
        loading: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white cursor-wait'
    },
    accent: {
        base: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-md hover:shadow-lg border border-purple-500/20 hover:border-purple-400/30',
        disabled: 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50',
        loading: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white cursor-wait'
    },
    outline: {
        base: 'border-2 border-gray-400 hover:border-blue-400 bg-transparent text-gray-300 hover:text-blue-300 hover:bg-blue-500/10',
        disabled: 'border-gray-600 text-gray-500 cursor-not-allowed opacity-50',
        loading: 'border-gray-400 text-gray-300 cursor-wait'
    },
    ghost: {
        base: 'bg-transparent hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 text-gray-300 hover:text-white border border-transparent hover:border-gray-600/30',
        disabled: 'text-gray-500 cursor-not-allowed opacity-50',
        loading: 'text-gray-300 cursor-wait'
    },
    danger: {
        base: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-md hover:shadow-lg border border-red-500/20 hover:border-red-400/30',
        disabled: 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50',
        loading: 'bg-gradient-to-r from-red-600 to-red-700 text-white cursor-wait'
    },
    success: {
        base: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-md hover:shadow-lg border border-green-500/20 hover:border-green-400/30',
        disabled: 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50',
        loading: 'bg-gradient-to-r from-green-600 to-green-700 text-white cursor-wait'
    }
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
    xs: 'px-2 py-1 text-xs', sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base', xl: 'px-8 py-4 text-lg'
};

const buttonAnimations: Record<ButtonAnimation, MotionProps> = {
    default: { whileHover: { scale: 1.03, y: -1 }, whileTap: { scale: 0.97, y: 0 }, transition: { duration: 0.15, ease: "easeOut" } },
    bounce: { whileHover: { scale: 1.05, y: -3 }, whileTap: { scale: 0.95, y: 0 }, transition: { type: "spring", stiffness: 400, damping: 12 } },
    slide: { whileHover: { x: 4, scale: 1.02 }, whileTap: { x: 0, scale: 0.98 }, transition: { duration: 0.2, ease: "easeOut" } },
    pulse: { whileHover: { scale: [1, 1.05, 1] }, transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" } },
    subtle: { whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 }, transition: { duration: 0.2 } },
    magnetic: { whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 }, transition: { type: "spring", stiffness: 400, damping: 15 } },
    glow: { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, transition: { duration: 0.3 } }
};

const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(({
    children, variant = 'primary', size = 'md', animation = 'magnetic', loading = false, disabled = false,
    fullWidth = false, leftIcon = null, rightIcon = null, loadingText = '', className = '', onClick, type = 'button', ...props
}, ref) => {
    const isDisabled = disabled || loading;
    const shouldReduceMotion = useReducedMotion();
    const variantStyles = BUTTON_VARIANTS[variant!] || BUTTON_VARIANTS.primary;
    const sizeStyles = BUTTON_SIZES[size!] || BUTTON_SIZES.md;
    const getStateStyles = () => { if (loading) return variantStyles.loading; if (disabled) return variantStyles.disabled; return variantStyles.base; };

    const baseClasses = [
        'inline-flex items-center justify-center', 'font-wanted-sans font-medium', 'rounded-lg', 'transition-[transform,color,border-color,background-color] duration-200 ease-out',
        'focus:outline-none focus:ring-a11y focus:ring-offset-a11y focus:ring-offset-gray-900', 'focus:ring-brand-primary-400 focus:ring-opacity-80',
        'transform-gpu', 'focus-visible:ring-a11y focus-visible:ring-brand-primary-400', 'focus-visible:ring-offset-a11y focus-visible:ring-offset-gray-900',
        sizeStyles, getStateStyles(), fullWidth ? 'w-full' : '', className
    ].filter(Boolean).join(' ');

    const animationProps = (!isDisabled && !shouldReduceMotion) ? buttonAnimations[animation!] || buttonAnimations.default : {};

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isDisabled && onClick) onClick(e);
    };

    return (
        <motion.button
            ref={ref} type={type} className={baseClasses} onClick={handleClick} disabled={isDisabled}
            {...animationProps}
            {...(props as React.ComponentPropsWithoutRef<'button'> as Record<string, unknown>)}
        >
            {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
            {loading && <ButtonLoadingSpinner size={size === 'xs' || size === 'sm' ? 'small' : 'medium'} />}
            <span>{loading && loadingText ? loadingText : children}</span>
            {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
        </motion.button>
    );
}));

interface IconButtonProps extends ButtonProps {
    icon: ReactElement<{ size?: number }>;
    'aria-label'?: string;
}

export const IconButton = memo(forwardRef<HTMLButtonElement, IconButtonProps>(({
    icon, variant = 'ghost', size = 'md', animation = 'default', loading = false, disabled = false, className = '', 'aria-label': ariaLabel, ...props
}, ref) => {
    const isDisabled = disabled || loading;
    const shouldReduceMotion = useReducedMotion();
    const sizeMap: Record<ButtonSize, string> = { xs: 'p-1', sm: 'p-1.5', md: 'p-2', lg: 'p-3', xl: 'p-4' };
    const iconSizeMap: Record<ButtonSize, number> = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24 };

    const variantStyles = BUTTON_VARIANTS[variant!] || BUTTON_VARIANTS.ghost;
    const getStateStyles = () => { if (loading) return variantStyles.loading; if (disabled) return variantStyles.disabled; return variantStyles.base; };

    const baseClasses = [
        'inline-flex items-center justify-center', 'rounded-full', 'transition-[transform,color,border-color,background-color] duration-200',
        'focus:outline-none focus:ring-a11y focus:ring-offset-a11y focus:ring-offset-gray-900', 'focus:ring-brand-primary-400 focus:ring-opacity-80',
        'focus-visible:ring-a11y focus-visible:ring-brand-primary-400', 'focus-visible:ring-offset-a11y focus-visible:ring-offset-gray-900',
        sizeMap[size!], getStateStyles(), className
    ].filter(Boolean).join(' ');

    const animationProps = (!isDisabled && !shouldReduceMotion) ? buttonAnimations[animation!] || buttonAnimations.default : {};

    return (
        <motion.button
            ref={ref} className={baseClasses} disabled={isDisabled} aria-label={ariaLabel}
            {...animationProps}
            {...(props as React.ComponentPropsWithoutRef<'button'> as Record<string, unknown>)}
        >
            {loading ? <ButtonLoadingSpinner size="small" /> : React.cloneElement(icon, { size: iconSizeMap[size!] })}
        </motion.button>
    );
}));

interface ButtonGroupProps {
    children: ReactNode;
    orientation?: 'horizontal' | 'vertical';
    spacing?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
}

export const ButtonGroup = memo<ButtonGroupProps>(({ children, orientation = 'horizontal', spacing = 'sm', className = '' }) => {
    const spacingMap = { xs: 'gap-1', sm: 'gap-2', md: 'gap-3', lg: 'gap-4' };
    const orientationClasses = orientation === 'vertical' ? 'flex-col' : 'flex-row';
    return <div className={`flex ${orientationClasses} ${spacingMap[spacing]} ${className}`}>{children}</div>;
});

interface ToggleButtonProps extends ButtonProps {
    pressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
}

export const ToggleButton = memo(forwardRef<HTMLButtonElement, ToggleButtonProps>(({
    children, pressed = false, onPressedChange, variant = 'outline', size = 'md', className = '', ...props
}, ref) => {
    const pressedVariant = pressed ? 'primary' : variant;
    return (
        <Button ref={ref} variant={pressedVariant} size={size} className={`${pressed ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''} ${className}`} onClick={() => onPressedChange && onPressedChange(!pressed)} aria-pressed={pressed} {...props}>
            {children}
        </Button>
    );
}));

interface FloatingActionButtonProps extends IconButtonProps {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingActionButton = memo(forwardRef<HTMLButtonElement, FloatingActionButtonProps>(({
    icon, onClick, variant = 'primary', size = 'lg', position = 'bottom-right', className = '', ...props
}, ref) => {
    const positionClasses = {
        'bottom-right': 'fixed bottom-6 right-6', 'bottom-left': 'fixed bottom-6 left-6',
        'top-right': 'fixed top-6 right-6', 'top-left': 'fixed top-6 left-6'
    };

    return (
        <motion.div
            className={`${positionClasses[position]} z-50`}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            <IconButton ref={ref} icon={icon} variant={variant} size={size} animation="bounce" className={`shadow-lg ${className}`} onClick={onClick} {...props} />
        </motion.div>
    );
}));

Button.displayName = 'Button';
IconButton.displayName = 'IconButton';
ButtonGroup.displayName = 'ButtonGroup';
ToggleButton.displayName = 'ToggleButton';
FloatingActionButton.displayName = 'FloatingActionButton';

export default Button;
