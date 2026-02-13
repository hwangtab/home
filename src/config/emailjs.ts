import type { ContactFormData } from '../types/component.types';

interface EmailJSConfig {
    serviceId: string;
    templateId: string;
    publicKey: string;
}

interface EmailJSModule {
    init: (publicKey: string) => void;
    send: (serviceId: string, templateId: string, formData: ContactFormData) => Promise<{ status: number; text: string }>;
}

interface SendResult {
    status: number;
    text: string;
}

const DEFAULT_EMAILJS_CONFIG: EmailJSConfig = {
    serviceId: 'service_lop4659',
    templateId: 'template_wxwj093',
    publicKey: 'E5wHxyFgSkrjQhYVG'
};

const getEmailJsConfig = (): EmailJSConfig => ({
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || DEFAULT_EMAILJS_CONFIG.serviceId,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || DEFAULT_EMAILJS_CONFIG.templateId,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || DEFAULT_EMAILJS_CONFIG.publicKey
});

// EmailJS 설정 중앙화 (환경변수 우선, 미설정 시 기본값 사용)
export const EMAILJS_CONFIG: EmailJSConfig = {
    ...getEmailJsConfig()
};

// EmailJS 초기화 함수
export const initEmailJS = async (): Promise<EmailJSModule> => {
    try {
        const config = getEmailJsConfig();
        const emailjs = await import('emailjs-com');
        emailjs.default.init(config.publicKey);
        return emailjs.default as unknown as EmailJSModule;
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        throw error;
    }
};

// 이메일 전송 함수
export const sendEmail = async (formData: ContactFormData): Promise<SendResult> => {
    try {
        const config = getEmailJsConfig();
        const emailjs = await initEmailJS();
        const result = await emailjs.send(
            config.serviceId,
            config.templateId,
            formData
        );
        return result;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};
