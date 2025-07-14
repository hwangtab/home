import React from 'react';
// 선별적 import로 번들 크기 최적화
import { Music } from 'lucide-react/dist/esm/icons/music';
import { BookOpen } from 'lucide-react/dist/esm/icons/book-open';
import { Camera } from 'lucide-react/dist/esm/icons/camera';
import { Mic } from 'lucide-react/dist/esm/icons/mic';

const DefaultImageComponent = ({ category, title }) => {
  const getIconAndColor = () => {
    switch (category) {
      case 'music':
        return {
          icon: <Music size={48} />,
          gradient: 'from-blue-600 to-blue-800',
          label: 'MUSIC'
        };
      case 'writing':
        return {
          icon: <BookOpen size={48} />,
          gradient: 'from-green-600 to-green-800',
          label: 'WRITING'
        };
      case 'visual':
        return {
          icon: <Camera size={48} />,
          gradient: 'from-purple-600 to-purple-800',
          label: 'VISUAL'
        };
      case 'performance':
        return {
          icon: <Mic size={48} />,
          gradient: 'from-red-600 to-red-800',
          label: 'PERFORMANCE'
        };
      default:
        return {
          icon: <Music size={48} />,
          gradient: 'from-gray-600 to-gray-800',
          label: 'CONTENT'
        };
    }
  };

  const { icon, gradient, label } = getIconAndColor();

  return (
    <div className={`w-full aspect-square bg-gradient-to-br ${gradient} flex flex-col items-center justify-center relative overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white rounded-full"></div>
        <div className="absolute bottom-12 right-4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
      
      {/* Main icon */}
      <div className="text-white opacity-90 mb-4">
        {icon}
      </div>
      
      {/* Label */}
      <span className="text-white text-sm font-medium opacity-80 tracking-wider">
        {label}
      </span>
      
      {/* Subtle border */}
      <div className="absolute inset-0 border border-white border-opacity-20 rounded-t-lg"></div>
    </div>
  );
};

export default DefaultImageComponent;