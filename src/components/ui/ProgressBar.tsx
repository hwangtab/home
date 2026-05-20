
import React, { memo, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type ProgressSize = 'small' | 'medium' | 'large' | 'xlarge';
type ProgressColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray' | 'gradient';
type ProgressVariant = 'default' | 'circular';

interface ProgressBarProps {
    value?: number;
    max?: number;
    size?: ProgressSize;
    color?: ProgressColor;
    showLabel?: boolean;
    label?: string;
    showPercentage?: boolean;
    className?: string;
    variant?: ProgressVariant;
    animated?: boolean;
}

const sizeClasses: Record<ProgressSize, string> = {
    small: 'h-1', medium: 'h-2', large: 'h-3', xlarge: 'h-4'
};

const colorClasses: Record<ProgressColor, string> = {
    blue: 'bg-blue-500', green: 'bg-green-500', red: 'bg-red-500',
    yellow: 'bg-yellow-500', purple: 'bg-purple-500', gray: 'bg-gray-500',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-500'
};

const backgroundClasses: Record<ProgressColor, string> = {
    blue: 'bg-blue-900', green: 'bg-green-900', red: 'bg-red-900',
    yellow: 'bg-yellow-900', purple: 'bg-purple-900', gray: 'bg-gray-700', gradient: 'bg-gray-700'
};

const ProgressBar = memo<ProgressBarProps>(({
    value = 0, max = 100, size = 'medium', color = 'blue',
    showLabel = false, label = '', showPercentage = false,
    className = '', variant = 'default', animated = true
}) => {
    const shouldReduceMotion = useReducedMotion();
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => setDisplayValue(value), 100);
            return () => clearTimeout(timer);
        } else {
            setDisplayValue(value);
        }
    }, [value, animated]);

    const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100);

    if (variant === 'circular') {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <div className={`relative inline-flex items-center justify-center ${className}`}>
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700" />
                    <motion.circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeLinecap="round"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className={colorClasses[color] || colorClasses.blue}
                        initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }}
                        transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-200">{Math.round(percentage)}%</span>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            {(showLabel || label) && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-200 font-wanted-sans">{label}</span>
                    {showPercentage && <span className="text-sm text-gray-400">{Math.round(percentage)}%</span>}
                </div>
            )}
            <div className={`w-full ${backgroundClasses[color] || backgroundClasses.gray} rounded-full ${sizeClasses[size] || sizeClasses.medium}`}>
                <motion.div className={`${sizeClasses[size] || sizeClasses.medium} ${colorClasses[color] || colorClasses.blue} rounded-full relative overflow-hidden`}
                    initial={{ width: 0 }} animate={{ width: `${percentage}%` }}
                    transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
                >
                    {animated && percentage > 0 && !shouldReduceMotion && (
                        <motion.div className="absolute inset-0 bg-white opacity-20"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
});

interface MultiProgressItem {
    value: number;
    color: string;
    label: string;
}

interface MultiProgressBarProps {
    items?: MultiProgressItem[];
    showLegend?: boolean;
    className?: string;
}

export const MultiProgressBar = memo<MultiProgressBarProps>(({ items = [], showLegend = true, className = '' }) => {
    const total = items.reduce((sum, item) => sum + item.value, 0);
    return (
        <div className={className}>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div className="flex h-full">
                    {items.map((item, index) => {
                        const percentage = total > 0 ? (item.value / total) * 100 : 0;
                        return (
                            <motion.div key={index} className={item.color}
                                initial={{ width: 0 }} animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }} title={`${item.label}: ${item.value}`}
                            />
                        );
                    })}
                </div>
            </div>
            {showLegend && (
                <div className="flex flex-wrap gap-4 mt-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${item.color} mr-2`} />
                            <span className="text-sm text-gray-300 font-wanted-sans">{item.label}: {item.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

interface StepProgressProps {
    steps?: string[];
    currentStep?: number;
    className?: string;
}

export const StepProgress = memo<StepProgressProps>(({ steps = [], currentStep = 0, className = '' }) => (
    <div className={className}>
        <div className="flex items-center">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                        <motion.div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'}`}
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{ scale: index === currentStep ? 1.1 : 1, opacity: index <= currentStep ? 1 : 0.5 }}
                            transition={{ duration: 0.3 }}
                        >{index + 1}</motion.div>
                        <span className={`text-xs mt-2 text-center font-wanted-sans ${index <= currentStep ? 'text-gray-200' : 'text-gray-400'}`}>{step}</span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className="flex-1 mx-4">
                            <div className="h-0.5 bg-gray-700 relative">
                                <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: index < currentStep ? '100%' : '0%' }} transition={{ duration: 0.5, delay: index * 0.1 }} />
                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    </div>
));

interface LoadingProgressProps {
    message?: string;
    className?: string;
}

const LoadingProgressBase: React.FC<LoadingProgressProps> = ({ message = 'Loading...', className = '' }) => {
    const shouldReduceMotion = useReducedMotion();
    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                {shouldReduceMotion ? (
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '50%' }} />
                ) : (
                    <motion.div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{ width: '30%' }}
                    />
                )}
            </div>
            {message && <span className="text-sm text-gray-400 mt-2 font-wanted-sans">{message}</span>}
        </div>
    );
};
export const LoadingProgress = memo<LoadingProgressProps>(LoadingProgressBase);

ProgressBar.displayName = 'ProgressBar';
MultiProgressBar.displayName = 'MultiProgressBar';
StepProgress.displayName = 'StepProgress';
LoadingProgress.displayName = 'LoadingProgress';

export default ProgressBar;
