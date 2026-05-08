import React, { memo, ReactNode } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { useAnimationTrigger } from '../hooks/useIntersectionObserver';
import { Heading2 } from './ui/Typography';
import { Container, Spacer } from './ui/Layout';

interface SectionProps {
    title?: string;
    subtitle?: string;
    children?: ReactNode;
    className?: string;
    containerSize?: 'default' | 'sm' | 'lg' | 'xl' | 'full';
    spacing?: 'none' | 'sm' | 'default' | 'lg' | 'xl';
    background?: 'transparent' | 'default' | 'accent' | 'muted';
    titleAlign?: 'left' | 'center' | 'right';
    variant?: 'default' | 'slideUp' | 'slideLeft' | 'slideRight' | 'fade' | 'scale';
    id?: string;
    enableScrollAnimation?: boolean;
}

const Section: React.FC<SectionProps> = memo(({
    title,
    subtitle,
    children,
    className = "",
    containerSize = 'default',
    spacing = 'default',
    background = 'transparent',
    titleAlign = 'left',
    variant = 'default',
    id,
    enableScrollAnimation = true, // 스크롤 애니메이션 활성화 여부
}) => {
    const [ref, shouldAnimate] = useAnimationTrigger({ once: false });
    const controls = useAnimation();

    // 다양한 애니메이션 변형
    const variants: Record<string, Variants> = {
        default: {
            hidden: {
                opacity: 0,
                y: 60,
                scale: 0.95
            },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    duration: 0.8,
                    delay: 0.15, // Added delay to let PageTransition complete first
                    ease: [0.25, 0.1, 0.25, 1],
                    staggerChildren: 0.1
                }
            }
        },
        slideUp: {
            hidden: {
                opacity: 0,
                y: 100,
                filter: 'blur(4px)'
            },
            visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: {
                    duration: 0.9,
                    ease: [0.165, 0.84, 0.44, 1],
                    staggerChildren: 0.15
                }
            }
        },
        slideLeft: {
            hidden: {
                opacity: 0,
                x: -80,
                scale: 0.9
            },
            visible: {
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                    duration: 0.7,
                    ease: [0.23, 1, 0.32, 1],
                    staggerChildren: 0.1
                }
            }
        },
        slideRight: {
            hidden: {
                opacity: 0,
                x: 80,
                scale: 0.9
            },
            visible: {
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                    duration: 0.7,
                    ease: [0.23, 1, 0.32, 1],
                    staggerChildren: 0.1
                }
            }
        },
        fade: {
            hidden: {
                opacity: 0,
                scale: 0.98
            },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    duration: 0.6,
                    ease: 'easeOut',
                    staggerChildren: 0.05
                }
            }
        },
        scale: {
            hidden: {
                opacity: 0,
                scale: 0.8,
                rotateY: -15
            },
            visible: {
                opacity: 1,
                scale: 1,
                rotateY: 0,
                transition: {
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    staggerChildren: 0.1
                }
            }
        }
    };

    React.useEffect(() => {
        if (shouldAnimate && enableScrollAnimation) {
            controls.start('visible');
        } else if (!enableScrollAnimation) {
            // 애니메이션 비활성화 시 즉시 visible 상태로 설정
            controls.start('visible');
        }
    }, [shouldAnimate, controls, enableScrollAnimation]);

    const spacingClasses = {
        none: 'mb-0',
        sm: 'mb-8',
        default: 'mb-16',
        lg: 'mb-20',
        xl: 'mb-24'
    };

    const backgroundClasses = {
        transparent: '',
        default: 'bg-gray-950',
        accent: 'bg-gray-900',
        muted: 'bg-gray-850'
    };

    return (
        <motion.section
            ref={ref}
            id={id}
            className={`transform-gpu ${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`}
            variants={variants[variant]}
            initial={enableScrollAnimation ? "hidden" : "visible"}
            animate={controls}
        >
            <Container size={containerSize}>
                {(title || subtitle) && (
                    <motion.div
                        className={`mb-12 ${titleAlign === 'center' ? 'text-center' : ''}`}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.6,
                                    ease: [0.25, 0.1, 0.25, 1]
                                }
                            }
                        }}
                    >
                        {title && (
                            <motion.div
                                className="relative inline-block"
                                variants={{
                                    hidden: { opacity: 0, scale: 0.95 },
                                    visible: {
                                        opacity: 1,
                                        scale: 1,
                                        transition: {
                                            duration: 0.5,
                                            ease: 'easeOut'
                                        }
                                    }
                                }}
                            >
                                <Heading2
                                    color="primary"
                                    align={titleAlign}
                                    className="relative z-10"
                                >
                                    {title}
                                </Heading2>
                                <motion.div
                                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-brand-primary-500 to-brand-solidarity-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0.25, 0.1, 0.25, 1],
                                        delay: 0.3
                                    }}
                                />
                            </motion.div>
                        )}
                        {subtitle && (
                            <>
                                <Spacer size="md" />
                                <motion.p
                                    className="text-lg text-gray-100 font-wanted-sans leading-relaxed max-w-2xl mx-auto"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                duration: 0.5,
                                                ease: 'easeOut',
                                                delay: 0.2
                                            }
                                        }
                                    }}
                                >
                                    {subtitle}
                                </motion.p>
                            </>
                        )}
                    </motion.div>
                )}
                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                duration: 0.5,
                                ease: 'easeOut',
                                delay: 0.1
                            }
                        }
                    }}
                >
                    {children}
                </motion.div>
            </Container>
        </motion.section>
    );
});

Section.displayName = 'Section';

interface SubSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    variant?: 'default' | 'card';
}

// 서브 섹션 컴포넌트
export const SubSection: React.FC<SubSectionProps> = memo(({ children, className = '', delay = 0, variant = 'default' }) => {
    const [ref, shouldAnimate] = useAnimationTrigger({ once: false });
    const controls = useAnimation();

    const variants: Record<string, Variants> = {
        default: {
            hidden: {
                opacity: 0,
                y: 30,
                scale: 0.98
            },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: delay / 1000
                }
            }
        },
        card: {
            hidden: {
                opacity: 0,
                y: 40,
                scale: 0.95,
                rotateX: 5
            },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                transition: {
                    duration: 0.7,
                    ease: [0.165, 0.84, 0.44, 1],
                    delay: delay / 1000
                }
            }
        }
    };

    React.useEffect(() => {
        if (shouldAnimate) {
            controls.start('visible');
        }
    }, [shouldAnimate, controls]);

    return (
        <motion.div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`transform-gpu ${className}`}
            variants={variants[variant]}
            initial="hidden"
            animate={controls}
        >
            {children}
        </motion.div>
    );
});

interface ItemProps {
    children: ReactNode;
    className?: string;
    index?: number;
    variant?: 'default' | 'grid';
}

// 아이템 컴포넌트
export const Item: React.FC<ItemProps> = memo(({ children, className = '', index = 0, variant = 'default' }) => {
    const [ref, shouldAnimate] = useAnimationTrigger({ once: false });
    const controls = useAnimation();

    const variants: Record<string, Variants> = {
        default: {
            hidden: {
                opacity: 0,
                y: 25,
                scale: 0.95
            },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: index * 0.05
                }
            }
        },
        grid: {
            hidden: {
                opacity: 0,
                y: 30,
                scale: 0.9,
                rotateY: 10
            },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateY: 0,
                transition: {
                    duration: 0.6,
                    ease: [0.165, 0.84, 0.44, 1],
                    delay: index * 0.08
                }
            }
        }
    };

    React.useEffect(() => {
        if (shouldAnimate) {
            controls.start('visible');
        }
    }, [shouldAnimate, controls]);

    return (
        <motion.div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`transform-gpu ${className}`}
            variants={variants[variant]}
            initial="hidden"
            animate={controls}
        >
            {children}
        </motion.div>
    );
});

// 프리셋 애니메이션 변형들
export const HeroSection = (props: SectionProps) => <Section variant="slideUp" {...props} />;
export const ContentSection = (props: SectionProps) => <Section variant="default" {...props} />;
export const GallerySection = (props: SectionProps) => <Section variant="fade" {...props} />;
export const AboutSection = (props: SectionProps) => <Section variant="slideLeft" {...props} />;
export const ContactSection = (props: SectionProps) => <Section variant="scale" {...props} />;

// 고성능 스크롤 애니메이션을 위한 추가 유틸리티
export const useScrollAnimation = (): [any, ReturnType<typeof useAnimation>] => {
    const controls = useAnimation();
    const [ref, inView] = useAnimationTrigger();

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    return [ref, controls];
};

// 디스플레이 네임 설정
SubSection.displayName = 'SubSection';
Item.displayName = 'Item';
HeroSection.displayName = 'HeroSection';
ContentSection.displayName = 'ContentSection';
GallerySection.displayName = 'GallerySection';
AboutSection.displayName = 'AboutSection';
ContactSection.displayName = 'ContactSection';

export default Section;
