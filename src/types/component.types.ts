import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Work } from './data.types';
import type { AnimationPreset } from './animation.types';

// Button Types
export type ButtonVariant =
    | 'primary'
    | 'solidarity'
    | 'earth'
    | 'harmony'
    | 'secondary'
    | 'accent'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'success';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonAnimation = 'default' | 'bounce' | 'slide' | 'pulse' | 'subtle' | 'magnetic' | 'glow';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    animation?: ButtonAnimation;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    loadingText?: string;
}

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    icon: React.ReactElement<{ size?: number }>;
    variant?: ButtonVariant;
    size?: ButtonSize;
    animation?: ButtonAnimation;
    loading?: boolean;
    disabled?: boolean;
    'aria-label': string;
}

// Card Types
export interface CategoryConfig {
    icon: LucideIcon;
    color: string;
    defaultSvg: string;
}

export interface UnifiedWorkCardProps {
    work: Work;
    onClick?: (work: Work) => void;
}

// Form Types
export interface ContactFormData {
    name: string;
    email: string;
    subject?: string;
    message: string;
}

export type ThemeType = 'dark' | 'light';

export interface ContactFormProps {
    theme?: ThemeType;
    includeSubject?: boolean;
    title?: string;
    className?: string;
    animation?: AnimationPreset;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export interface ToastOptions {
    duration?: number;
    action?: ToastAction;
    persistent?: boolean;
}

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
    action?: ToastAction;
    persistent: boolean;
}

export interface ToastContextValue {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType, options?: ToastOptions) => number;
    removeToast: (id: number) => void;
    clearAllToasts: () => void;
    showSuccess: (message: string, options?: ToastOptions) => number;
    showError: (message: string, options?: ToastOptions) => number;
    showWarning: (message: string, options?: ToastOptions) => number;
    showInfo: (message: string, options?: ToastOptions) => number;
}

// Layout Types
export interface LayoutProps {
    children: ReactNode;
}

export interface SectionProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    className?: string;
    animate?: boolean;
}

// Input Types
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    realTimeValidation?: boolean;
    validation?: (value: string) => string | null;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}
