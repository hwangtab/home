import React from 'react';

// CSS 기반 아이콘 컴포넌트들
const MusicIcon = () => (
  <div className="w-12 h-12 flex items-center justify-center">
    <div className="relative">
      <div className="w-8 h-8 border-2 border-white rounded-full"></div>
      <div className="absolute -top-2 right-1 w-1 h-6 bg-white"></div>
      <div className="absolute -top-1 right-0 w-3 h-1 bg-white rounded-full"></div>
    </div>
  </div>
);

const BookIcon = () => (
  <div className="w-12 h-12 flex items-center justify-center">
    <div className="relative">
      <div className="w-8 h-10 border-2 border-white border-l-4"></div>
      <div className="absolute top-2 left-1 w-5 h-0.5 bg-white"></div>
      <div className="absolute top-4 left-1 w-4 h-0.5 bg-white"></div>
      <div className="absolute top-6 left-1 w-5 h-0.5 bg-white"></div>
    </div>
  </div>
);

const CameraIcon = () => (
  <div className="w-12 h-12 flex items-center justify-center">
    <div className="relative">
      <div className="w-10 h-7 border-2 border-white rounded-lg"></div>
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-white rounded-sm"></div>
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-5 h-5 border-2 border-white rounded-full"></div>
    </div>
  </div>
);

const MicIcon = () => (
  <div className="w-12 h-12 flex items-center justify-center">
    <div className="relative">
      <div className="w-4 h-6 border-2 border-white rounded-full"></div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-4 border-2 border-white border-t-0 rounded-b-lg"></div>
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white"></div>
    </div>
  </div>
);

const DefaultImageComponent = ({ category, title }) => {
  const getIconAndColor = () => {
    switch (category) {
      case 'music':
        return {
          icon: <MusicIcon />,
          gradient: 'from-blue-600 to-blue-800',
          label: 'MUSIC'
        };
      case 'writing':
        return {
          icon: <BookIcon />,
          gradient: 'from-green-600 to-green-800',
          label: 'WRITING'
        };
      case 'visual':
        return {
          icon: <CameraIcon />,
          gradient: 'from-purple-600 to-purple-800',
          label: 'VISUAL'
        };
      case 'performance':
        return {
          icon: <MicIcon />,
          gradient: 'from-red-600 to-red-800',
          label: 'PERFORMANCE'
        };
      default:
        return {
          icon: <MusicIcon />,
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