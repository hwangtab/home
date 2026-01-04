import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Heading1 } from './ui/Typography';
import { Container } from './ui/Layout';

const PageHero = memo(({ 
  title, 
  subtitle, 
  imagePath, 
  height = '50vh',
  overlayOpacity = 0.5,
  className = ''
}) => {
  return (
    <div 
      className={`relative w-full overflow-hidden flex items-center justify-center ${className}`}
      style={{ height }}
    >
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0 w-full h-full z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img 
          src={process.env.PUBLIC_URL + imagePath} 
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div 
          className="absolute inset-0 bg-gray-950 transition-opacity duration-300"
          style={{ opacity: overlayOpacity }}
        />
        {/* Gradient Overlay for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/30 via-transparent to-gray-950/90" />
      </motion.div>

      {/* Content */}
      <Container className="relative z-10 text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-1 bg-brand-primary-500 mb-6 rounded-full"
          />
          
          <Heading1 className="mb-4 text-white drop-shadow-lg">
            {title}
          </Heading1>
          
          {subtitle && (
            <motion.p 
              className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </Container>
    </div>
  );
});

PageHero.displayName = 'PageHero';

export default PageHero;
