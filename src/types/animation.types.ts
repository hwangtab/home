import type { Transition, TargetAndTransition, HTMLMotionProps } from 'framer-motion';

// Animation States
export const ANIMATION_STATES = {
    IDLE: 'idle',
    PAGE_TRANSITION: 'page_transition',
    INTERACTIVE: 'interactive',
    BACKGROUND: 'background'
} as const;

export type AnimationState = typeof ANIMATION_STATES[keyof typeof ANIMATION_STATES];

// Animation Priorities
export const ANIMATION_PRIORITY = {
    PAGE_TRANSITION: 10,
    INTERACTIVE: 5,
    BACKGROUND: 1
} as const;

export type AnimationPriorityValue = typeof ANIMATION_PRIORITY[keyof typeof ANIMATION_PRIORITY];

// Animation Context
export interface AnimationContextValue {
    currentState: AnimationState;
    runningAnimations: Set<string>;
    startPageTransition: () => void;
    endPageTransition: () => void;
    registerAnimation: (id: string, priority?: AnimationPriorityValue) => boolean;
    unregisterAnimation: (id: string) => void;
    isAnimationAllowed: (priority?: AnimationPriorityValue) => boolean;
    shouldReduceAnimations: () => boolean;
    cleanup: () => void;
}

// Animation Presets
export interface AnimationPreset {
    initial?: TargetAndTransition;
    animate?: TargetAndTransition;
    exit?: TargetAndTransition;
    transition?: Transition;
}

export interface CardAnimation {
    whileHover?: TargetAndTransition;
    whileTap?: TargetAndTransition;
    layout?: boolean;
    transition?: Transition;
    style?: React.CSSProperties;
}

// Motion component prop types
export type MotionDivProps = HTMLMotionProps<'div'>;
export type MotionButtonProps = HTMLMotionProps<'button'>;
export type MotionSpanProps = HTMLMotionProps<'span'>;
export type MotionAProps = HTMLMotionProps<'a'>;
export type MotionImgProps = HTMLMotionProps<'img'>;
export type MotionUlProps = HTMLMotionProps<'ul'>;
export type MotionLiProps = HTMLMotionProps<'li'>;
