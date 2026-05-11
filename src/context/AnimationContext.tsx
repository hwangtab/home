import React, { createContext, useContext, useState, useCallback, useRef, useMemo, useEffect, ReactNode } from 'react';

// 애니메이션 상태 타입
export const ANIMATION_STATES = {
    IDLE: 'idle',
    PAGE_TRANSITION: 'page_transition',
    INTERACTIVE: 'interactive',
    BACKGROUND: 'background'
} as const;

type AnimationState = typeof ANIMATION_STATES[keyof typeof ANIMATION_STATES];

// 애니메이션 우선순위 (높을수록 우선순위 높음)
export const ANIMATION_PRIORITY = {
    PAGE_TRANSITION: 10,
    INTERACTIVE: 5,
    BACKGROUND: 1
} as const;

type AnimationPriority = typeof ANIMATION_PRIORITY[keyof typeof ANIMATION_PRIORITY];

interface AnimationContextType {
    currentState: AnimationState;
    runningAnimations: Set<string>;
    reducedMotion: boolean;
    startPageTransition: () => void;
    endPageTransition: () => void;
    registerAnimation: (id: string, priority?: AnimationPriority) => boolean;
    unregisterAnimation: (id: string) => void;
    isAnimationAllowed: (priority?: AnimationPriority) => boolean;
    shouldReduceAnimations: () => boolean;
    cleanup: () => void;
}

// 애니메이션 상태 관리 컨텍스트
const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
    children: ReactNode;
}

// prefers-reduced-motion 미디어 쿼리 감지
const getReducedMotionPreference = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
    const [currentState, setCurrentState] = useState<AnimationState>(ANIMATION_STATES.IDLE);
    const [runningAnimations, setRunningAnimations] = useState<Set<string>>(new Set());
    const [reducedMotion, setReducedMotion] = useState(getReducedMotionPreference);
    const animationTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // prefers-reduced-motion 변경 감지
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // 페이지 전환 시작
    const startPageTransition = useCallback(() => {
        setCurrentState(ANIMATION_STATES.PAGE_TRANSITION);

        // 750ms 후 자동으로 상태 해제 (페이지 전환 완료 0.5s + 여유 0.25s)
        const timeoutId = setTimeout(() => {
            setCurrentState(ANIMATION_STATES.IDLE);
        }, 750);

        animationTimeouts.current.set('pageTransition', timeoutId);
    }, []);

    // 페이지 전환 완료
    const endPageTransition = useCallback(() => {
        const timeoutId = animationTimeouts.current.get('pageTransition');
        if (timeoutId) {
            clearTimeout(timeoutId);
            animationTimeouts.current.delete('pageTransition');
        }

        setCurrentState(ANIMATION_STATES.IDLE);
    }, []);

    // 애니메이션 등록
    const registerAnimation = useCallback((id: string, priority: AnimationPriority = ANIMATION_PRIORITY.BACKGROUND) => {
        // 페이지 전환 중에는 낮은 우선순위 애니메이션 차단
        if (currentState === ANIMATION_STATES.PAGE_TRANSITION &&
            priority < ANIMATION_PRIORITY.PAGE_TRANSITION) {
            return false;
        }

        setRunningAnimations(prev => {
            if (prev.has(id)) return prev; // 중복 등록 방지
            return new Set([...prev, id]);
        });
        return true;
    }, [currentState]);

    // 애니메이션 해제
    const unregisterAnimation = useCallback((id: string) => {
        setRunningAnimations(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    }, []);

    // 애니메이션 허용 여부 확인
    const isAnimationAllowed = useCallback((priority: AnimationPriority = ANIMATION_PRIORITY.BACKGROUND) => {
        if (currentState === ANIMATION_STATES.PAGE_TRANSITION) {
            return priority >= ANIMATION_PRIORITY.PAGE_TRANSITION;
        }
        return true;
    }, [currentState]);

    // 성능 최적화를 위한 애니메이션 제한
    const shouldReduceAnimations = useCallback(() => {
        // prefers-reduced-motion 설정이 있으면 즉시 제한
        if (reducedMotion) {
            return true;
        }

        // 많은 애니메이션이 동시에 실행 중인 경우 제한
        if (runningAnimations.size > 3) {
            return true;
        }

        // 모바일 환경에서는 더 제한적
        if (typeof window !== 'undefined' && window.innerWidth < 768 && runningAnimations.size > 2) {
            return true;
        }

        return false;
    }, [runningAnimations.size, reducedMotion]);

    // 정리 함수 강화
    const cleanup = useCallback(() => {
        // 모든 타이머 정리
        animationTimeouts.current.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        animationTimeouts.current.clear();

        // 애니메이션 상태 초기화
        setRunningAnimations(new Set());
        setCurrentState(ANIMATION_STATES.IDLE);

        // body 스타일 정리
        document.body.style.willChange = 'auto';
    }, []);

    // 컴포넌트 언마운트 시 정리
    React.useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    const value = useMemo(() => ({
        currentState,
        runningAnimations,
        reducedMotion,
        startPageTransition,
        endPageTransition,
        registerAnimation,
        unregisterAnimation,
        isAnimationAllowed,
        shouldReduceAnimations,
        cleanup
    }), [
        currentState,
        runningAnimations,
        reducedMotion,
        startPageTransition,
        endPageTransition,
        registerAnimation,
        unregisterAnimation,
        isAnimationAllowed,
        shouldReduceAnimations,
        cleanup
    ]);

    return (
        <AnimationContext.Provider value={value}>
            {children}
        </AnimationContext.Provider>
    );
};

// 커스텀 훅
export const useAnimation = (): AnimationContextType => {
    const context = useContext(AnimationContext);
    if (!context) {
        throw new Error('useAnimation must be used within an AnimationProvider');
    }
    return context;
};

interface AnimationWrapperProps {
    children: React.ReactElement; // Should be a valid element to clone
    id: string;
    priority?: AnimationPriority;
    onPause?: () => void;
    onResume?: () => void;
}

// 애니메이션 컴포넌트 래퍼 (Context 기반 리팩토링)
export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
    children,
    id,
    priority = ANIMATION_PRIORITY.BACKGROUND,
    onPause,
    onResume
}) => {
    const { registerAnimation, unregisterAnimation, isAnimationAllowed } = useAnimation();
    const [isRegistered, setIsRegistered] = useState(false);

    // isAnimationAllowed를 기반으로 활성 상태 결정
    const isActive = isAnimationAllowed(priority);

    // 애니메이션 등록 관리
    useEffect(() => {
        if (!isRegistered) {
            const canRun = registerAnimation(id, priority);
            setIsRegistered(true);

            if (!canRun && onPause) {
                onPause();
            }
        }

        // 컴포넌트 언마운트 시 애니메이션 해제
        return () => {
            if (isRegistered) {
                unregisterAnimation(id);
            }
        };
    }, [id, priority, registerAnimation, unregisterAnimation, isRegistered, onPause]);

    // isActive 상태 변화에 따른 콜백 호출
    useEffect(() => {
        if (isRegistered) {
            if (!isActive) {
                onPause?.();
            } else {
                onResume?.();
            }
        }
    }, [isActive, onPause, onResume, isRegistered]);

    // 애니메이션이 비활성화된 경우 정적 버전 렌더링
    if (!isActive) {
        return React.cloneElement(children, {
            animate: false,
            transition: { duration: 0 }
        } as any);
    }

    return children;
};
