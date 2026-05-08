import type { ContactFormData } from '../types/component.types';

interface EmailJSConfig {
    serviceId: string;
    templateId: string;
    publicKey: string;
}

interface SendResult {
    status: number;
    text: string;
}

const getEmailJsConfig = (): EmailJSConfig => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
        throw new Error(
            'EmailJS configuration is incomplete. ' +
            'Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, ' +
            'and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY environment variables.'
        );
    }

    return { serviceId, templateId, publicKey };
};

// EmailJS 설정 중앙화 — 환경변수 필수
// Lazily loaded to avoid build-time failures when env vars aren't set.
// The check still fires at runtime when the contact form is actually used.
let _config: EmailJSConfig | null = null;

const getConfig = (): EmailJSConfig => {
    if (!_config) {
        _config = getEmailJsConfig();
    }
    return _config;
};

// Lazily access config — getter ensures validation only happens on first use
// Each getter provides type-safe access with IDE autocomplete support
export const getEmailJsServiceId = (): string => getConfig().serviceId;
export const getEmailJsTemplateId = (): string => getConfig().templateId;
export const getEmailJsPublicKey = (): string => getConfig().publicKey;

// Backwards compat: export a proxy-like object for existing usages
export const EMAILJS_CONFIG: EmailJSConfig = new Proxy({} as EmailJSConfig, {
    get(_, prop) {
        return getConfig()[prop as keyof EmailJSConfig];
    }
});

// EmailJS 초기화 함수
export const initEmailJS = async (): Promise<{
    init: (publicKey: string) => void;
    send: (serviceId: string, templateId: string, formData: ContactFormData) => Promise<{ status: number; text: string }>;
}> => {
    try {
        const emailjs = await import('emailjs-com');
        const { default: emailjsDefault } = emailjs as unknown as { default: { init: (publicKey: string) => void; send: (serviceId: string, templateId: string, formData: ContactFormData) => Promise<{ status: number; text: string }> } };
        emailjsDefault.init(getEmailJsPublicKey());
        return emailjsDefault;
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        throw error;
    }
};

// 이메일 전송 함수
export const sendEmail = async (formData: ContactFormData): Promise<SendResult> => {
    try {
        const emailjs = await initEmailJS();
        const result = await emailjs.send(
            getEmailJsServiceId(),
            getEmailJsTemplateId(),
            formData
        );
        return result;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};
