// EmailJS 설정 중앙화
export const EMAILJS_CONFIG = {
  serviceId: 'service_lop4659',
  templateId: 'template_wxwj093',
  publicKey: 'E5wHxyFgSkrjQhYVG'
};

// EmailJS 초기화 함수
export const initEmailJS = async () => {
  try {
    const emailjs = await import('emailjs-com');
    emailjs.default.init(EMAILJS_CONFIG.publicKey);
    return emailjs.default;
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    throw error;
  }
};

// 이메일 전송 함수
export const sendEmail = async (formData) => {
  try {
    const emailjs = await initEmailJS();
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      formData
    );
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};