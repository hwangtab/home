import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Mic, Headphones, Heart } from 'lucide-react';

/**
 * 애니메이션 직업 표시 컴포넌트
 * 아이콘과 함께 직업을 순차적으로 표시하는 애니메이션
 */
const AnimatedProfession = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const professions = [
    {
      text: '음악가',
      icon: Music,
      color: 'text-brand-primary-400',
      bgColor: 'bg-brand-primary-500/20'
    },
    {
      text: '사운드 엔지니어',
      icon: Headphones,
      color: 'text-brand-harmony-400',
      bgColor: 'bg-brand-harmony-500/20'
    },
    {
      text: '프로듀서',
      icon: Mic,
      color: 'text-brand-earth-400',
      bgColor: 'bg-brand-earth-500/20'
    },
    {
      text: '연대자',
      icon: Heart,
      color: 'text-brand-solidarity-400',
      bgColor: 'bg-brand-solidarity-500/20'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % professions.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [professions.length]);

  const currentProfession = professions[currentIndex];
  const IconComponent = currentProfession.icon;

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center gap-3"
        >
          {/* 아이콘 */}
          <motion.div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${currentProfession.bgColor} backdrop-blur-sm border border-white/20`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <IconComponent 
              className={`w-6 h-6 ${currentProfession.color}`}
            />
          </motion.div>
          
          {/* 텍스트 */}
          <motion.span
            className={`text-lg sm:text-xl md:text-2xl font-santokki ${currentProfession.color} font-medium`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {currentProfession.text}
          </motion.span>
        </motion.div>
      </AnimatePresence>
      
      {/* 인디케이터 */}
      <div className="flex gap-2 ml-4">
        {professions.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
            animate={{
              scale: index === currentIndex ? 1.2 : 1,
              opacity: index === currentIndex ? 1 : 0.5
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedProfession;