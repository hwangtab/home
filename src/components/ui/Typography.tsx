
import React, { memo, forwardRef, ReactNode, ElementType, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline' | 'button';
type ColorVariant = 'primary' | 'secondary' | 'muted' | 'accent' | 'accent-hover' | 'success' | 'warning' | 'error' | 'white' | 'disabled' | 'subtitle';
type AlignVariant = 'left' | 'center' | 'right' | 'justify';

interface TypographyScale {
    fontSize: string; fontWeight: string; lineHeight: string; letterSpacing: string;
    fontFamily: string; marginBottom?: string; textTransform?: string;
}

const TYPOGRAPHY_SCALES: Record<TypographyVariant, TypographyScale> = {
    h1: { fontSize: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl', fontWeight: 'font-bold', lineHeight: 'leading-[1.1]', letterSpacing: 'tracking-tight', fontFamily: '', marginBottom: 'mb-4 md:mb-6' },
    h2: { fontSize: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl', fontWeight: 'font-bold', lineHeight: 'leading-[1.2]', letterSpacing: 'tracking-tight', fontFamily: 'font-santokki', marginBottom: 'mb-3 md:mb-4' },
    h3: { fontSize: 'text-2xl md:text-3xl lg:text-4xl', fontWeight: 'font-bold', lineHeight: 'leading-[1.2]', letterSpacing: 'tracking-normal', fontFamily: 'font-santokki', marginBottom: 'mb-4' },
    h4: { fontSize: 'text-xl md:text-2xl lg:text-3xl', fontWeight: 'font-bold', lineHeight: 'leading-[1.25]', letterSpacing: 'tracking-normal', fontFamily: 'font-santokki', marginBottom: 'mb-3' },
    h5: { fontSize: 'text-lg md:text-xl lg:text-2xl', fontWeight: 'font-semibold', lineHeight: 'leading-[1.3]', letterSpacing: 'tracking-normal', fontFamily: 'font-wanted-sans', marginBottom: 'mb-3' },
    h6: { fontSize: 'text-base md:text-lg lg:text-xl', fontWeight: 'font-semibold', lineHeight: 'leading-[1.35]', letterSpacing: 'tracking-normal', fontFamily: 'font-wanted-sans', marginBottom: 'mb-2' },
    body1: { fontSize: 'text-base md:text-lg', fontWeight: 'font-normal', lineHeight: 'leading-[1.65]', letterSpacing: 'tracking-[0.01em]', fontFamily: 'font-wanted-sans', marginBottom: 'mb-4' },
    body2: { fontSize: 'text-sm md:text-base', fontWeight: 'font-normal', lineHeight: 'leading-[1.6]', letterSpacing: 'tracking-[0.01em]', fontFamily: 'font-wanted-sans', marginBottom: 'mb-3' },
    caption: { fontSize: 'text-xs md:text-sm', fontWeight: 'font-normal', lineHeight: 'leading-[1.4]', letterSpacing: 'tracking-wide', fontFamily: 'font-wanted-sans', marginBottom: 'mb-2' },
    overline: { fontSize: 'text-xs', fontWeight: 'font-medium', lineHeight: 'leading-[1.2]', letterSpacing: 'tracking-widest', fontFamily: 'font-wanted-sans', textTransform: 'uppercase', marginBottom: 'mb-1' },
    button: { fontSize: 'text-sm md:text-base', fontWeight: 'font-medium', lineHeight: 'leading-[1.2]', letterSpacing: 'tracking-[0.02em]', fontFamily: 'font-wanted-sans' }
};

const COLOR_VARIANTS: Record<ColorVariant, string> = {
    primary: 'text-gray-50', secondary: 'text-gray-200', muted: 'text-gray-400', accent: 'text-blue-400',
    'accent-hover': 'text-blue-300', success: 'text-green-400', warning: 'text-yellow-400', error: 'text-red-400',
    white: 'text-white', disabled: 'text-gray-500', subtitle: 'text-gray-300'
};

const ALIGN_VARIANTS: Record<AlignVariant, string> = { left: 'text-left', center: 'text-center', right: 'text-right', justify: 'text-justify' };

interface TypographyProps extends HTMLAttributes<HTMLElement> {
    variant?: TypographyVariant;
    color?: ColorVariant;
    align?: AlignVariant;
    component?: ElementType;
    animate?: boolean;
    children?: ReactNode;
}

const Typography = memo(forwardRef<HTMLElement, TypographyProps>(({
    variant = 'body1', color = 'primary', align = 'left', component: Component = 'p',
    className = '', children, animate = false, ...props
}, ref) => {
    const scale = TYPOGRAPHY_SCALES[variant] || TYPOGRAPHY_SCALES.body1;
    const colorClass = COLOR_VARIANTS[color] || COLOR_VARIANTS.primary;
    const alignClass = ALIGN_VARIANTS[align] || ALIGN_VARIANTS.left;
    const classes = [scale.fontSize, scale.fontWeight, scale.lineHeight, scale.letterSpacing, scale.fontFamily, scale.textTransform, scale.marginBottom, colorClass, alignClass, className].filter(Boolean).join(' ');

    if (animate) {
        return (
            <motion.div ref={ref as React.Ref<HTMLDivElement>} className={classes} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }} {...props}>
                <Component className="w-full">{children}</Component>
            </motion.div>
        );
    }
    return <Component ref={ref} className={classes} {...props}>{children}</Component>;
}));

export const Heading1 = memo(forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'component'>>((props, ref) => <Typography ref={ref} variant="h1" component="h1" {...props} />));
export const Heading2 = memo(forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'component'>>((props, ref) => <Typography ref={ref} variant="h2" component="h2" {...props} />));
export const Heading3 = memo(forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'component'>>((props, ref) => <Typography ref={ref} variant="h3" component="h3" {...props} />));
export const Heading4 = memo(forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'component'>>((props, ref) => <Typography ref={ref} variant="h4" component="h4" {...props} />));
export const Heading5 = memo(forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'component'>>((props, ref) => <Typography ref={ref} variant="h5" component="h5" {...props} />));
export const Heading6 = memo(forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'component'>>((props, ref) => <Typography ref={ref} variant="h6" component="h6" {...props} />));
export const BodyText = memo(forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant' | 'component'>>((props, ref) => <Typography ref={ref} variant="body1" component="p" {...props} />));
export const BodyText2 = memo(forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant' | 'component'>>((props, ref) => <Typography ref={ref} variant="body2" component="p" {...props} />));
export const Caption = memo(forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant' | 'component'>>((props, ref) => <Typography ref={ref} variant="caption" component="span" {...props} />));
export const Overline = memo(forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant' | 'component'>>((props, ref) => <Typography ref={ref} variant="overline" component="span" {...props} />));
export const Label = memo(forwardRef<HTMLLabelElement, Omit<TypographyProps, 'variant' | 'component'>>((props, ref) => <Typography ref={ref} variant="body2" component="label" color="secondary" {...props} />));
export const SmallText = memo(forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant' | 'component'>>((props, ref) => <Typography ref={ref} variant="caption" component="span" color="muted" {...props} />));

Typography.displayName = 'Typography';
Heading1.displayName = 'Heading1'; Heading2.displayName = 'Heading2'; Heading3.displayName = 'Heading3';
Heading4.displayName = 'Heading4'; Heading5.displayName = 'Heading5'; Heading6.displayName = 'Heading6';
BodyText.displayName = 'BodyText'; BodyText2.displayName = 'BodyText2'; Caption.displayName = 'Caption';
Overline.displayName = 'Overline'; Label.displayName = 'Label';

export default Typography;
export { TYPOGRAPHY_SCALES, COLOR_VARIANTS, ALIGN_VARIANTS };
