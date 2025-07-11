import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { sendEmail } from '../config/emailjs';
import { COMMON_ANIMATIONS } from '../constants/animations';
import { THEME_STYLES } from '../constants/styles';
import { useToast } from './ui/Toast';
import { Input, Textarea } from './ui/FormElements';
import Button from './ui/Button';

const ContactForm = ({ 
  theme = 'dark', 
  includeSubject = true, 
  title = '문의하기',
  className = '',
  animation = COMMON_ANIMATIONS.slideInRight
}) => {
  const initialFormData = {
    name: '',
    email: '',
    ...(includeSubject && { subject: '' }),
    message: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { showSuccess, showError } = useToast();

  // 유효성 검사 함수
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim().length >= 2 ? null : '이름은 최소 2글자 이상이어야 합니다.';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : '올바른 이메일 형식을 입력해주세요.';
      case 'subject':
        return includeSubject && value.trim().length < 3 ? '제목은 최소 3글자 이상이어야 합니다.' : null;
      case 'message':
        return value.trim().length >= 10 ? null : '메시지는 최소 10글자 이상이어야 합니다.';
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // 실시간 유효성 검사
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 전체 유효성 검사
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      showError('입력 정보를 확인해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await sendEmail(formData);
      showSuccess('메시지가 성공적으로 전송되었습니다!', {
        action: {
          label: '확인',
          onClick: () => console.log('Success confirmed')
        }
      });
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error('Failed to send email:', error);
      showError('메시지 전송에 실패했습니다. 다시 시도해주세요.', {
        action: {
          label: '다시 시도',
          onClick: () => handleSubmit(e)
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const themeConfig = THEME_STYLES[theme];

  return (
    <motion.div 
      className={`${themeConfig.surface} ${themeConfig.text.primary} p-8 rounded-lg shadow-lg ${className}`}
      initial={animation.initial}
      animate={animation.animate}
      transition={animation.transition}
    >
      {title && (
        <h3 className="text-2xl font-bold font-santokki mb-6">
          {title}
        </h3>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="name"
          name="name"
          label="이름"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="성함을 입력해주세요"
          realTimeValidation={true}
          validation={(value) => validateField('name', value)}
        />
        
        <Input
          id="email"
          name="email"
          label="이메일"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="이메일 주소를 입력해주세요"
          realTimeValidation={true}
          validation={(value) => validateField('email', value)}
        />
        
        {includeSubject && (
          <Input
            id="subject"
            name="subject"
            label="제목"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            error={errors.subject}
            required
            placeholder="문의 제목을 입력해주세요"
            realTimeValidation={true}
            validation={(value) => validateField('subject', value)}
          />
        )}
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-200 font-wanted-sans mb-2">
            메시지 <span className="text-red-400">*</span>
          </label>
          <Textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            placeholder="문의 내용을 자세히 입력해주세요"
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
          loadingText="전송 중..."
          leftIcon={!isSubmitting ? <Send size={20} /> : null}
          animation="default"
        >
          메시지 보내기
        </Button>
      </form>
    </motion.div>
  );
};

export default memo(ContactForm);