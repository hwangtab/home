module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bombaram': ['var(--font-bombaram)', 'serif'],
        'myungjo': ['var(--font-myungjo)', 'serif'],
        'santokki': ['var(--font-santokki)', 'sans-serif'],
        'wanted-sans': ['Wanted Sans Variable', 'sans-serif'],
      },
      colors: {
        // 브랜드 컬러 시스템 - 황경하의 음악적 정체성 반영
        brand: {
          // Primary: 기존 파란색 유지하되 더 깊이 있게
          primary: {
            50: '#eff6ff',   // 매우 연한 파랑
            100: '#dbeafe',  // 연한 파랑
            200: '#bfdbfe',  // 중간 연한 파랑
            300: '#93c5fd',  // 중간 파랑
            400: '#60a5fa',  // 밝은 파랑
            500: '#3b82f6',  // 기본 파랑 (현재 사용중)
            600: '#2563eb',  // 진한 파랑
            700: '#1d4ed8',  // 더 진한 파랑
            800: '#1e40af',  // 매우 진한 파랑
            900: '#1e3a8a',  // 가장 진한 파랑
          },
          // Solidarity: 연대와 저항의 상징 - 한복의 빨강을 현대적으로
          solidarity: {
            50: '#fef2f2',   // 매우 연한 빨강
            100: '#fee2e2',  // 연한 빨강
            200: '#fecaca',  // 중간 연한 빨강
            300: '#fca5a5',  // 중간 빨강
            400: '#f87171',  // 밝은 빨강
            500: '#c93f37',  // 기본 연대 빨강 (한복 빨강 모티브)
            600: '#b91c1c',  // 진한 빨강
            700: '#991b1b',  // 더 진한 빨강
            800: '#7f1d1d',  // 매우 진한 빨강
            900: '#661414',  // 가장 진한 빨강
          },
          // Earth: 민중과 뿌리의 상징 - 흙색 계열
          earth: {
            50: '#f9f7f4',   // 매우 연한 흙색
            100: '#f0ebe3',  // 연한 흙색
            200: '#e6d5c3',  // 중간 연한 흙색
            300: '#d4b896',  // 중간 흙색
            400: '#bc9667',  // 밝은 흙색
            500: '#8d6e63',  // 기본 흙색 (민중의 땅)
            600: '#6d4c41',  // 진한 흙색
            700: '#5d4037',  // 더 진한 흙색
            800: '#4e342e',  // 매우 진한 흙색
            900: '#3e2723',  // 가장 진한 흙색
          },
          // Harmony: 희망과 화합의 상징 - 물색/하늘색 계열
          harmony: {
            50: '#f0fdfa',   // 매우 연한 청록
            100: '#ccfbf1',  // 연한 청록
            200: '#99f6e4',  // 중간 연한 청록
            300: '#5eead4',  // 중간 청록
            400: '#2dd4bf',  // 밝은 청록
            500: '#48c9b0',  // 기본 화합색 (희망의 물색)
            600: '#0d9488',  // 진한 청록
            700: '#0f766e',  // 더 진한 청록
            800: '#115e59',  // 매우 진한 청록
            900: '#134e4a',  // 가장 진한 청록
          }
        },
        // 접근성 개선된 gray 시스템 - WCAG 2.1 AA 준수
        gray: {
          50: '#f9fafb',   // 밝은 배경용
          100: '#f3f4f6',  // 연한 회색
          200: '#e5e7eb',  // 연한 보더용
          300: '#d1d5db',  // 중간 보더용
          400: '#a1a1aa',  // 개선된 텍스트 (대비 4.5:1)
          500: '#71717a',  // 보조 텍스트 (대비 7:1)
          600: '#52525b',  // 진한 텍스트
          700: '#3f3f46',  // 카드 배경
          750: '#323238',  // 커스텀 중간 그레이
          800: '#27272a',  // 다크 배경
          850: '#1c1c1e',  // 커스텀 다크 그레이
          900: '#18181b',  // 가장 다크 배경
          950: '#09090b',  // 커스텀 가장 다크
        }
      },
      spacing: {
        // 8px grid system - 정교한 spacing scale
        '0.5': '0.125rem',  // 2px
        '1.5': '0.375rem',  // 6px
        '2.5': '0.625rem',  // 10px
        '3.5': '0.875rem',  // 14px
        '4.5': '1.125rem',  // 18px
        '5.5': '1.375rem',  // 22px
        '6.5': '1.625rem',  // 26px
        '7.5': '1.875rem',  // 30px
        '8.5': '2.125rem',  // 34px
        '9.5': '2.375rem',  // 38px
        '10.5': '2.625rem', // 42px
        '11.5': '2.875rem', // 46px
        '12.5': '3.125rem', // 50px
        '13.5': '3.375rem', // 54px
        '14.5': '3.625rem', // 58px
        '15.5': '3.875rem', // 62px
        // Extended spacing for larger layouts
        '18': '4.5rem',     // 72px
        '22': '5.5rem',     // 88px
        '26': '6.5rem',     // 104px
        '30': '7.5rem',     // 120px
        '34': '8.5rem',     // 136px
        '38': '9.5rem',     // 152px
        '42': '10.5rem',    // 168px
        '46': '11.5rem',    // 184px
        '50': '12.5rem',    // 200px
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
      scale: {
        '102': '1.02',
      },
      perspective: {
        '1000': '1000px',
      },
      // 모바일 터치 최적화
      minHeight: {
        'touch': '44px',  // 최소 터치 영역 44px
        'touch-lg': '48px',  // 큰 터치 영역 48px
      },
      minWidth: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      // 접근성 - 포커스 링 스타일
      ringWidth: {
        'a11y': '3px',  // 접근성 권장 포커스 링 두께
      },
      ringOffsetWidth: {
        'a11y': '2px',  // 접근성 권장 오프셋
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}