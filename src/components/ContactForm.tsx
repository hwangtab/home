import React, { useState, useRef, memo, useMemo } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Send } from 'lucide-react';
import { sendEmail } from '../config/emailjs';
import { COMMON_ANIMATIONS } from '../constants/animations';
import { THEME_STYLES } from '../constants/styles';
import { useToast } from './ui/Toast';
import { Input, Textarea } from './ui/FormElements';
import Button from './ui/Button';
import { useLanguage } from '../i18n';

interface FormData {
    name: string;
    email: string;
    subject?: string;
    message: string;
    website?: string;
    [key: string]: string | undefined;
}

interface ContactFormProps {
    theme?: 'dark' | 'light';
    includeSubject?: boolean;
    title?: string;
    className?: string;
    animation?: HTMLMotionProps<"div">;
}

const ContactForm: React.FC<ContactFormProps> = ({
    theme = 'dark',
    includeSubject = true,
    title = '',
    className = '',
    animation = COMMON_ANIMATIONS.slideInRight
}) => {
    const { t } = useLanguage();
    const initialFormData = useMemo<FormData>(() => ({
        name: '',
        email: '',
        website: '',
        message: '',
        ...(includeSubject ? { subject: '' } : {})
    }), [includeSubject]);

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const formStartedAt = useRef<number>(Date.now());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const { showSuccess, showError } = useToast();

    // includeSubject 변경 시 formData를 초기값으로 리셋
    React.useEffect(() => {
        setFormData(initialFormData);
        setErrors({});
    }, [initialFormData]);

    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'name':
                return value.trim().length >= 2 ? null : t('contact.form.errors.nameMin');
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? null : t('contact.form.errors.emailInvalid');
            case 'subject':
                return includeSubject && value.trim().length < 3 ? t('contact.form.errors.subjectMin') : null;
            case 'message':
                return value.trim().length >= 10 ? null : t('contact.form.errors.messageMin');
            default:
                return null;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // 실시간 유효성 검사
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitForm();
    };

    const submitForm = async (): Promise<void> => {
        // Capture current state to avoid stale closure issues
        const currentFormData = formData;

        // Basic bot mitigation: hidden honeypot field + too-fast submit guard.
        if ((currentFormData.website || '').trim().length > 0) {
            setFormData(initialFormData);
            return;
        }

        if (Date.now() - formStartedAt.current < 1200) {
            showError(t('contact.form.errors.checkInput'));
            return;
        }

        // 전체 유효성 검사
        const newErrors: Record<string, string> = {};
        Object.keys(currentFormData).forEach(key => {
            const error = validateField(key, currentFormData[key] || '');
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showError(t('contact.form.errors.checkInput'));
            // Scroll to first invalid field
            const firstErrorId = Object.keys(newErrors)[0];
            setTimeout(() => {
                document.getElementById(firstErrorId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                document.getElementById(firstErrorId)?.focus();
            }, 100);
            return;
        }

        setIsSubmitting(true);

        try {
            await sendEmail(currentFormData);
            showSuccess(t('contact.form.success'), {
                action: {
                    label: t('common.confirm'),
                    onClick: () => console.log('Success confirmed')
                }
            });
            setFormData(initialFormData);
            formStartedAt.current = Date.now();
            setErrors({});
        } catch (error) {
            console.error('Failed to send email:', error);
            showError(t('contact.form.error'), {
                action: {
                    label: t('common.retry'),
                    onClick: () => void submitForm()
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const themeConfig = THEME_STYLES[theme as keyof typeof THEME_STYLES] || THEME_STYLES.dark;

    return (
        <motion.div
            className={`${themeConfig.surface} ${themeConfig.text.primary} p-8 rounded-lg shadow-lg ${className}`}
            {...animation}
        >
            {(title || t('contact.form.title')) && (
                <h3 className="text-2xl font-bold font-santokki mb-6">
                    {title || t('contact.form.title')}
                </h3>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bot honeypot — hidden via CSS so bots that fill all fields catch it */}
                <input
                    type="text"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    autoComplete="off"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none"
                />

                <Input
                    id="name"
                    name="name"
                    label={t('contact.form.name')}
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name || undefined}
                    required
                    placeholder={t('contact.form.namePlaceholder')}
                    realTimeValidation={true}
                    validation={(value) => !validateField('name', value)}
                />

                <Input
                    id="email"
                    name="email"
                    label={t('contact.form.email')}
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email || undefined}
                    required
                    placeholder={t('contact.form.emailPlaceholder')}
                    realTimeValidation={true}
                    validation={(value) => !validateField('email', value)}
                />

                {includeSubject && (
                    <Input
                        id="subject"
                        name="subject"
                        label={t('contact.form.subject')}
                        type="text"
                        value={formData.subject || ''}
                        onChange={handleChange}
                        error={errors.subject || undefined}
                        required
                        placeholder={t('contact.form.subjectPlaceholder')}
                        realTimeValidation={true}
                        validation={(value) => !validateField('subject', value)}
                    />
                )}

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-200 font-wanted-sans mb-2">
                        {t('contact.form.message')} <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('contact.form.messagePlaceholder')}
                        className={errors.message ? 'border-red-500' : ''}
                    />
                    {errors.message && (
                        <div className="mt-2">
                            <span className="text-sm text-red-400 font-wanted-sans">
                                {errors.message}
                            </span>
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth={true}
                    loading={isSubmitting}
                    loadingText={t('contact.form.sending')}
                    leftIcon={!isSubmitting ? <Send size={20} /> : null}
                    animation="default"
                >
                    {t('contact.form.send')}
                </Button>
            </form>
        </motion.div>
    );
};

export default memo(ContactForm);
