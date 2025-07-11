import React, { memo } from 'react';

// 색상 팔레트 정의
export const COLORS = {
  // 기본 그레이 스케일
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    850: '#1a202c',
    900: '#111827',
    950: '#0d1117'
  },
  
  // 브랜드 색상
  brand: {
    primary: '#3b82f6',    // blue-500
    secondary: '#8b5cf6',  // purple-500
    accent: '#06b6d4',     // cyan-500
    dark: '#1e293b',       // slate-800
    light: '#f1f5f9'       // slate-100
  },
  
  // 상태 색상
  state: {
    success: '#10b981',    // emerald-500
    warning: '#f59e0b',    // amber-500
    error: '#ef4444',      // red-500
    info: '#3b82f6'        // blue-500
  },
  
  // 한국적 색상 (전통 색상 모티브)
  korean: {
    hanbok: {
      red: '#c93f37',      // 한복 빨강
      blue: '#4a69bd',     // 한복 파랑
      yellow: '#f39c12',   // 한복 노랑
      green: '#27ae60',    // 한복 초록
      purple: '#8e44ad'    // 한복 보라
    },
    natural: {
      earth: '#8d6e63',    // 흙색
      sky: '#87ceeb',      // 하늘색
      mountain: '#5d6d7e', // 산색
      water: '#48c9b0',    // 물색
      sunset: '#e67e22'    // 노을색
    }
  }
};

// 색상 토큰 매핑
export const COLOR_TOKENS = {
  // 텍스트 색상
  text: {
    primary: COLORS.gray[100],
    secondary: COLORS.gray[300],
    muted: COLORS.gray[400],
    disabled: COLORS.gray[500],
    inverse: COLORS.gray[900]
  },
  
  // 배경 색상
  background: {
    primary: COLORS.gray[900],
    secondary: COLORS.gray[800],
    tertiary: COLORS.gray[850],
    overlay: 'rgba(0, 0, 0, 0.5)',
    glass: 'rgba(255, 255, 255, 0.1)'
  },
  
  // 경계선 색상
  border: {
    default: COLORS.gray[600],
    muted: COLORS.gray[700],
    accent: COLORS.brand.primary,
    error: COLORS.state.error
  },
  
  // 인터랙션 색상
  interactive: {
    primary: COLORS.brand.primary,
    primaryHover: '#2563eb',
    secondary: COLORS.gray[600],
    secondaryHover: COLORS.gray[500],
    accent: COLORS.brand.accent,
    accentHover: '#0891b2'
  }
};

// 그라디언트 정의
export const GRADIENTS = {
  primary: 'bg-gradient-to-r from-blue-500 to-purple-600',
  secondary: 'bg-gradient-to-r from-gray-700 to-gray-800',
  accent: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  warm: 'bg-gradient-to-r from-orange-400 to-red-500',
  cool: 'bg-gradient-to-r from-blue-400 to-indigo-600',
  korean: 'bg-gradient-to-r from-red-500 to-blue-600',
  sunset: 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500',
  ocean: 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800',
  forest: 'bg-gradient-to-r from-green-400 to-blue-500',
  
  // 텍스트 그라디언트
  text: {
    primary: 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent',
    accent: 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent',
    warm: 'bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent',
    korean: 'bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent'
  }
};

// 색상 유틸리티 함수들
export const colorUtils = {
  // 투명도 추가
  withOpacity: (color, opacity) => {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },
  
  // 색상 밝기 조절
  lighten: (color, amount) => {
    // 간단한 구현 - 실제로는 더 복잡한 색상 조작 라이브러리 사용 권장
    return color;
  },
  
  // 색상 어둡게 조절
  darken: (color, amount) => {
    // 간단한 구현 - 실제로는 더 복잡한 색상 조작 라이브러리 사용 권장
    return color;
  }
};

// 기본 테마 정의 (다크 테마만 유지)
export const THEMES = {
  dark: {
    name: 'dark',
    colors: {
      background: {
        primary: COLORS.gray[900],
        secondary: COLORS.gray[800],
        tertiary: COLORS.gray[850]
      },
      text: {
        primary: COLORS.gray[100],
        secondary: COLORS.gray[300],
        muted: COLORS.gray[400]
      },
      border: {
        default: COLORS.gray[600],
        muted: COLORS.gray[700]
      }
    }
  }
};

// 색상 표시 컴포넌트 (개발/디자인 시스템 문서용)
export const ColorSwatch = memo(({ 
  color, 
  name, 
  size = 'md',
  showHex = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-lg border border-gray-600 shadow-sm`}
        style={{ backgroundColor: color }}
      />
      {name && (
        <div className="text-center">
          <p className="text-xs font-medium text-gray-200">{name}</p>
          {showHex && (
            <p className="text-xs text-gray-400 font-mono">{color}</p>
          )}
        </div>
      )}
    </div>
  );
});

// 색상 팔레트 표시 컴포넌트
export const ColorPalette = memo(({ 
  colors, 
  title,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-200 font-wanted-sans">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
        {Object.entries(colors).map(([name, color]) => (
          <ColorSwatch 
            key={name}
            color={color}
            name={name}
            size="md"
          />
        ))}
      </div>
    </div>
  );
});

ColorSwatch.displayName = 'ColorSwatch';
ColorPalette.displayName = 'ColorPalette';