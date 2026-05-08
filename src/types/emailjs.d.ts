// emailjs-com 타입 declaration
declare module 'emailjs-com' {
    interface EmailJS {
        init(publicKey: string): void;
        send(serviceId: string, templateId: string, templateParams: Record<string, unknown>): Promise<{ status: number; text: string }>;
        sendCustom(serviceUrl: string, templateParams: Record<string, unknown>): Promise<{ status: number; text: string }>;
    }

    const emailjs: EmailJS;
    export = emailjs;
}
