
import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../i18n';

type SpinnerSize = 'small' | 'medium' | 'large' | 'xlarge';
type SpinnerColor = 'gray' | 'blue' | 'white' | 'primary';
type SpinnerVariant = 'default' | 'dots' | 'pulse';

interface LoadingSpinnerProps {
    size?: SpinnerSize;
    color?: SpinnerColor;
    message?: string;
    className?: string;
    variant?: SpinnerVariant;
}

const sizeClasses: Record<SpinnerSize, string> = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
};

const colorClasses: Record<SpinnerColor, string> = {
    gray: 'border-gray-300',
    blue: 'border-blue-500',
    white: 'border-white',
    primary: 'border-gray-300'
};

const LoadingSpinner = memo<LoadingSpinnerProps>(({
    size = 'medium',
    color = 'gray',
    message = '',
    className = '',
    variant = 'default'
}) => {
    const shouldReduceMotion = useReducedMotion();

    if (variant === 'dots') {
        return (
            <div className={`flex items-center justify-center space-x-1 ${className}`}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={`${sizeClasses[size] || sizeClasses.medium} bg-gray-400 rounded-full`}
                        animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                        transition={shouldReduceMotion ? {} : { duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                    />
                ))}
                {message && <span className="ml-3 text-gray-400 font-wanted-sans text-sm">{message}</span>}
            </div>
        );
    }

    if (variant === 'pulse') {
        return (
            <div className={`flex flex-col items-center justify-center ${className}`}>
                <motion.div
                    className={`${sizeClasses[size] || sizeClasses.medium} bg-gray-400 rounded-full`}
                    animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={shouldReduceMotion ? {} : { duration: 1, repeat: Infinity }}
                />
                {message && <span className="mt-3 text-gray-400 font-wanted-sans text-sm">{message}</span>}
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div
                className={`${sizeClasses[size] || sizeClasses.medium} ${colorClasses[color] || colorClasses.gray} rounded-full animate-spin`}
                style={{ borderWidth: '2px', borderStyle: 'solid', borderTopColor: 'transparent' }}
            />
            {message && <span className="mt-3 text-gray-400 font-wanted-sans text-sm">{message}</span>}
        </div>
    );
});

interface PageLoadingSpinnerProps {
    message?: string;
}

const PageLoadingSpinnerBase: React.FC<PageLoadingSpinnerProps> = ({ message }) => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 transform-gpu">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.25, 0, 1] }}
                className="animate-optimized"
            >
                <LoadingSpinner size="large" color="primary" message={message || t('loading.page')} variant="pulse" />
            </motion.div>
        </div>
    );
};
export const PageLoadingSpinner = memo<PageLoadingSpinnerProps>(PageLoadingSpinnerBase);

interface InlineLoadingSpinnerProps {
    message?: string;
    size?: SpinnerSize;
}

const InlineLoadingSpinnerBase: React.FC<InlineLoadingSpinnerProps> = ({ message, size = 'small' }) => {
    const { t } = useLanguage();
    return (
        <div className="flex items-center justify-center py-8">
            <LoadingSpinner size={size} color="gray" message={message || t('loading.default')} variant="dots" />
        </div>
    );
};
export const InlineLoadingSpinner = memo<InlineLoadingSpinnerProps>(InlineLoadingSpinnerBase);

interface ButtonLoadingSpinnerProps {
    size?: SpinnerSize;
}

export const ButtonLoadingSpinner = memo<ButtonLoadingSpinnerProps>(({ size = 'small' }) => (
    <LoadingSpinner size={size} color="white" variant="default" className="mr-2" />
));

interface OverlayLoadingSpinnerProps {
    message?: string;
    isVisible?: boolean;
    backdrop?: boolean;
}

export const OverlayLoadingSpinner = memo<OverlayLoadingSpinnerProps>(({
    message,
    isVisible = false,
    backdrop = true
}) => {
    const { t } = useLanguage();
    if (!isVisible) return null;

    return (
        <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center ${backdrop ? 'bg-black bg-opacity-50' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="bg-gray-800 p-8 rounded-lg shadow-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <LoadingSpinner size="large" color="primary" message={message || t('loading.processing')} variant="default" />
            </motion.div>
        </motion.div>
    );
});

LoadingSpinner.displayName = 'LoadingSpinner';
PageLoadingSpinner.displayName = 'PageLoadingSpinner';
InlineLoadingSpinner.displayName = 'InlineLoadingSpinner';
ButtonLoadingSpinner.displayName = 'ButtonLoadingSpinner';
OverlayLoadingSpinner.displayName = 'OverlayLoadingSpinner';

export default LoadingSpinner;
