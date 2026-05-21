# 황경하 포트폴리오 웹사이트 리팩토링 계획

## 📋 개요

본 문서는 황경하 아티스트 포트폴리오 웹사이트의 전체적인 리팩토링 계획을 제시합니다. 주요 목표는 코드 품질 개선, 성능 최적화, 유지보수성 향상입니다.

## 🎯 주요 목표

1. **데이터 일원화**: 모든 페이지가 통합된 데이터 소스 사용
2. **컴포넌트 재사용성**: 중복 코드 제거 및 공통 컴포넌트 활용
3. **성능 최적화**: 메모이제이션, 이미지 최적화, 번들 크기 감소
4. **사용자 경험 개선**: 에러 처리, 로딩 상태, 접근성 향상
5. **개발자 경험 개선**: 일관된 코드 구조, 타입 안정성

---

## 🔍 현재 상태 분석

### 장점
- ✅ React 18.2.0 기반의 모던 기술 스택
- ✅ 다국어 지원 시스템 구축
- ✅ Framer Motion을 활용한 풍부한 애니메이션
- ✅ 반응형 디자인 적용
- ✅ GitHub Pages 배포 자동화

### 개선 필요 사항
- ❌ 일부 계획 문서가 현재 구조와 불일치
- ❌ 컴포넌트 중복 (ContactForm, 카드 컴포넌트들)
- ❌ 성능 최적화 부족
- ❌ 에러 처리 및 로딩 상태 미흡
- ❌ 접근성 개선 필요

---

## 📊 리팩토링 우선순위 분석

| 카테고리 | 우선순위 | 예상 소요 시간 | 개선 효과 |
|----------|----------|----------------|-----------|
| 데이터 일원화 | 🔴 높음 | 2-3일 | 유지보수성 50% ↑ |
| 성능 최적화 | 🔴 높음 | 1-2일 | 로딩 속도 30% ↑ |
| 컴포넌트 통합 | 🔴 높음 | 2-3일 | 코드량 40% ↓ |
| 에러 처리 | 🔴 높음 | 1일 | 안정성 60% ↑ |
| 스타일링 시스템 | 🟡 중간 | 1-2일 | 일관성 ↑ |
| 접근성 개선 | 🟡 중간 | 1-2일 | 사용성 ↑ |
| 타입 안정성 | 🟢 낮음 | 3-4일 | 버그 감소 60% |

---

## 🚀 단계별 실행 계획

## 1단계: 데이터 일원화 및 통합 컴포넌트 시스템 (3-4일)

### 1.1 통합 데이터 구조 설계

**상태**: 완료

**목표**: 모든 페이지가 하나의 데이터 소스 사용

```json
{
  "timeline": [
    {
      "year": 2016,
      "events": [
        {
          "id": "gentrification-2016",
          "type": "album",
          "title": "젠트리피케이션",
          "description": "...",
          "cover": "...",
          "links": {...},
          "tags": [...],
          "featured": true,
          "pages": ["works", "archive", "about"]
        }
      ]
    }
  ]
}
```

**현재 적용 내용**:
- [x] `src/data/siteData.json`을 단일 콘텐츠 소스로 사용
- [x] `src/data/siteContent.ts`에서 페이지별 selector 제공
- [x] `src/hooks/usePageData.ts`에서 typed page hook 제공
- [x] `public/data/*.json` 제거

### 1.2 통합 카드 컴포넌트 시스템

**목표**: 재사용 가능한 카드 컴포넌트 생성

**파일 구조**:
```
src/components/cards/
├── CardRenderer.js      # 범용 카드 렌더러
├── MusicCard.js
├── VisualCard.js
├── WritingCard.js
├── PerformanceCard.js
└── cardConfigs.js       # 카드 타입별 설정
```

**작업 내용**:
- [ ] 기존 Works.js의 카드들을 독립 컴포넌트로 분리
- [ ] `CardRenderer.js` 생성 - 타입별 카드 렌더링 로직
- [ ] 카드 타입별 설정 파일 생성

### 1.3 페이지별 데이터 필터링 시스템

**목표**: 동일 데이터에서 페이지별 적절한 정보만 추출

```javascript
// src/hooks/useTimelineData.js
export const useTimelineData = (pageType) => {
  const data = siteData.timeline;
  
  switch(pageType) {
    case 'works':
      return data.flatMap(year => 
        year.events.filter(event => 
          event.pages?.includes('works') || event.featured
        )
      );
    case 'archive':
      return data;
    case 'about':
      return data.map(year => ({
        year: year.year,
        events: year.events.filter(event => 
          event.pages?.includes('about') || event.type === 'album'
        )
      }));
  }
};
```

**작업 내용**:
- [ ] `useTimelineData.js` 훅 생성
- [ ] 페이지별 데이터 필터링 로직 구현
- [ ] Works.js, Archive.js, About.js에 적용

---

## 2단계: 성능 최적화 및 에러 처리 (2-3일)

### 2.1 성능 최적화

**목표**: 렌더링 성능 개선 및 번들 크기 최적화

**작업 내용**:
- [ ] 주요 컴포넌트에 `React.memo` 적용
- [ ] `useMemo`, `useCallback` 활용한 메모이제이션
- [ ] 이미지 지연 로딩 및 최적화
- [ ] 번들 분석 및 코드 스플리팅

```javascript
// 예시: 메모이제이션 적용
const OptimizedCard = memo(({ data, type, onClick }) => {
  const config = useMemo(() => CARD_CONFIGS[type], [type]);
  const handleClick = useCallback(() => onClick?.(data), [onClick, data]);
  
  return <div onClick={handleClick}>{config.render(data)}</div>;
});
```

### 2.2 통합 에러 처리 시스템

**목표**: 일관된 에러 처리 및 사용자 피드백

**파일 구조**:
```
src/components/error/
├── ErrorBoundary.js
├── ErrorFallback.js
└── LoadingSpinner.js

src/hooks/
├── useErrorHandler.js
└── useAsyncData.js
```

**작업 내용**:
- [ ] `ErrorBoundary` 컴포넌트 생성
- [ ] 공통 로딩 스피너 및 에러 폴백 UI
- [ ] 이미지 로드 실패시 대체 이미지 시스템
- [ ] 네트워크 에러 처리 로직

### 2.3 이미지 최적화 시스템

**목표**: 이미지 로딩 성능 개선

```javascript
// src/components/OptimizedImage.js
const OptimizedImage = ({ src, alt, fallback, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Intersection Observer를 활용한 지연 로딩
  // WebP 지원 여부 확인 후 포맷 선택
  // 에러시 fallback 이미지 표시
};
```

**작업 내용**:
- [ ] `OptimizedImage` 컴포넌트 생성
- [ ] Intersection Observer 활용한 지연 로딩
- [ ] WebP 포맷 지원 및 fallback
- [ ] 이미지 에러 처리

---

## 3단계: 코드 품질 및 중복 제거 (2-3일)

### 3.1 중복 코드 제거

**목표**: DRY 원칙 적용 및 코드 중복 최소화

**작업 내용**:
- [ ] ContactForm 중복 제거 - 하나의 컴포넌트로 통합
- [ ] EmailJS 설정 중앙화
- [ ] 공통 애니메이션 설정 분리
- [ ] 반복되는 스타일 패턴 통합

```javascript
// src/config/index.js
export const CONFIG = {
  emailjs: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  },
  animations: {
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    }
  }
};
```

### 3.2 컴포넌트 분할

**목표**: 거대한 컴포넌트를 작은 단위로 분할

**Works.js 분할 계획**:
- `WorksFilter.js` - 필터링 UI
- `WorksGrid.js` - 그리드 레이아웃
- `WorksActions.js` - 액션 버튼들
- `VideoGallery.js` - 비디오 갤러리 (이미 존재)

**작업 내용**:
- [ ] Works.js (410줄) 분할
- [ ] Home.js (185줄) 분할
- [ ] 각 컴포넌트의 단일 책임 원칙 적용

### 3.3 공통 훅 시스템

**목표**: 재사용 가능한 커스텀 훅 생성

```javascript
// src/hooks/useUnifiedActions.js
export const useUnifiedActions = () => {
  const [lightboxData, setLightboxData] = useState(null);
  const [musicPlayer, setMusicPlayer] = useState(null);
  
  const handleCardClick = useCallback((item, action) => {
    switch(action) {
      case 'lightbox':
        if (item.images) setLightboxData(item.images);
        break;
      case 'music':
        if (item.audioUrl || item.links) setMusicPlayer(item);
        break;
      case 'external':
        if (item.links) window.open(item.links[Object.keys(item.links)[0]]);
        break;
    }
  }, []);
  
  return { handleCardClick, lightboxData, musicPlayer };
};
```

**작업 내용**:
- [ ] `useUnifiedActions.js` - 통합 액션 처리
- [ ] `useIntersectionObserver.js` - 교차점 감지
- [ ] `useLocalStorage.js` - 로컬 스토리지 관리

---

## 4단계: 스타일링 시스템 및 접근성 (2-3일)

### 4.1 통합 디자인 시스템

**목표**: 일관된 스타일링 시스템 구축

```javascript
// tailwind.config.js 확장
module.exports = {
  theme: {
    extend: {
      components: {
        '.card-base': {
          '@apply bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col': {}
        },
        '.btn-primary': {
          '@apply bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors': {}
        },
        '.text-heading': {
          '@apply text-2xl font-bold text-gray-200 font-santokki': {}
        }
      }
    }
  }
};
```

**작업 내용**:
- [ ] Tailwind 컴포넌트 클래스 정의
- [ ] 색상 팔레트 표준화
- [ ] 타이포그래피 시스템 정리
- [ ] 반응형 브레이크포인트 통일

### 4.2 접근성 개선

**목표**: WCAG 2.1 AA 수준 접근성 확보

**작업 내용**:
- [ ] 키보드 네비게이션 지원
- [ ] ARIA 레이블 및 속성 추가
- [ ] 색상 대비 개선
- [ ] 포커스 관리 시스템
- [ ] 스크린 리더 지원

```javascript
// src/components/AccessibleButton.js
const AccessibleButton = ({ 
  children, 
  onClick, 
  ariaLabel, 
  variant = 'primary',
  ...props 
}) => (
  <button
    className={cn('btn-base', `btn-${variant}`)}
    onClick={onClick}
    aria-label={ariaLabel}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(e);
      }
    }}
    {...props}
  >
    {children}
  </button>
);
```

---

## 5단계: 고급 기능 및 최적화 (2-3일)

### 5.1 상태 관리 개선

**목표**: 전역 상태 관리 및 Prop Drilling 해결

```javascript
// src/context/AppContext.js
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('ko');
  const [userPreferences, setUserPreferences] = useState({});
  
  const value = {
    theme,
    setTheme,
    language,
    setLanguage,
    userPreferences,
    setUserPreferences
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
```

**작업 내용**:
- [ ] Context API를 활용한 전역 상태 관리
- [ ] 사용자 설정 관리 시스템
- [ ] 테마 시스템 확장
- [ ] Prop Drilling 제거

### 5.2 SEO 및 메타데이터 개선

**목표**: 검색 엔진 최적화 및 동적 메타데이터

```javascript
// src/components/SEOHead.js
const SEOHead = ({ 
  title, 
  description, 
  image, 
  url,
  type = 'website',
  schema 
}) => (
  <Helmet>
    <title>{title} | 황경하</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content={type} />
    {schema && (
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    )}
  </Helmet>
);
```

**작업 내용**:
- [ ] React Helmet을 활용한 동적 SEO
- [ ] 페이지별 구조화된 데이터
- [ ] 사이트맵 자동 생성
- [ ] Open Graph 메타태그 최적화

---

## 6단계: 타입 안정성 및 테스팅 (3-4일)

### 6.1 TypeScript 점진적 도입

**목표**: 타입 안정성 확보 및 개발자 경험 개선

```typescript
// src/types/index.ts
export interface MusicWork {
  id: string;
  title: string;
  year: number;
  type: 'album' | 'single';
  cover: string;
  description: string;
  links: Record<string, string>;
  tags: string[];
  featured?: boolean;
  pages?: ('works' | 'archive' | 'about')[];
}

export interface TimelineEvent extends MusicWork {
  // 추가 타임라인 전용 필드들
}

export interface CardProps<T = any> {
  data: T;
  type: string;
  onClick?: (data: T) => void;
  className?: string;
}
```

**작업 내용**:
- [ ] 주요 인터페이스 타입 정의
- [ ] 점진적 TypeScript 마이그레이션
- [ ] 컴포넌트 Props 타입 정의
- [ ] API 응답 타입 정의

### 6.2 테스트 시스템 구축

**목표**: 주요 컴포넌트 및 기능 테스트

```javascript
// src/__tests__/components/CardRenderer.test.js
describe('CardRenderer', () => {
  it('should render music card correctly', () => {
    const mockData = { type: 'album', title: 'Test Album' };
    render(<CardRenderer data={mockData} type="music" />);
    expect(screen.getByText('Test Album')).toBeInTheDocument();
  });
  
  it('should handle click events', () => {
    const handleClick = jest.fn();
    const mockData = { type: 'album', title: 'Test Album' };
    render(<CardRenderer data={mockData} type="music" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Test Album'));
    expect(handleClick).toHaveBeenCalledWith(mockData);
  });
});
```

**작업 내용**:
- [ ] Jest 및 React Testing Library 설정
- [ ] 주요 컴포넌트 단위 테스트
- [ ] 통합 테스트 작성
- [ ] E2E 테스트 기본 설정

---

## 📁 최종 파일 구조

```
src/
├── components/
│   ├── cards/              # 통합 카드 시스템
│   │   ├── CardRenderer.js
│   │   ├── MusicCard.js
│   │   ├── VisualCard.js
│   │   ├── WritingCard.js
│   │   ├── PerformanceCard.js
│   │   └── cardConfigs.js
│   ├── timeline/           # 타임라인 시스템
│   │   ├── TimelineRenderer.js
│   │   ├── YearlyView.js
│   │   ├── GridView.js
│   │   └── VerticalView.js
│   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── Layout.js
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── media/              # 미디어 컴포넌트
│   │   ├── OptimizedImage.js
│   │   ├── MusicPlayer.js
│   │   ├── VideoGallery.js
│   │   └── Lightbox.js
│   ├── forms/              # 폼 컴포넌트
│   │   └── ContactForm.js
│   ├── error/              # 에러 처리
│   │   ├── ErrorBoundary.js
│   │   ├── ErrorFallback.js
│   │   └── LoadingSpinner.js
│   └── common/             # 공통 컴포넌트
│       ├── Section.js
│       ├── Button.js
│       └── SEOHead.js
├── pages/
│   ├── Home.js
│   ├── About.js
│   ├── Works.js
│   ├── Archive.js
│   ├── News.js
│   └── Contact.js
├── hooks/                  # 커스텀 훅
│   ├── useTimelineData.js
│   ├── useUnifiedActions.js
│   ├── useErrorHandler.js
│   ├── useIntersectionObserver.js
│   └── useLocalStorage.js
├── context/                # Context API
│   ├── AppContext.js
│   └── LanguageContext.js
├── utils/                  # 유틸리티 함수
│   ├── dataUtils.js
│   ├── dateUtils.js
│   └── imageUtils.js
├── config/                 # 설정 파일
│   ├── index.js
│   ├── animations.js
│   └── constants.js
├── types/                  # TypeScript 타입
│   └── index.ts
├── data/
│   └── siteData.json       # 통합 데이터 소스
└── __tests__/              # 테스트 파일
    ├── components/
    ├── hooks/
    └── utils/
```

---

## 📈 예상 개선 효과

### 성능 개선
- **번들 크기**: 20-30% 감소 (코드 스플리팅, 중복 제거)
- **초기 로딩 시간**: 15-25% 개선 (이미지 최적화, 지연 로딩)
- **런타임 성능**: 30-40% 개선 (메모이제이션, 리렌더링 최적화)

### 개발자 경험
- **코드 유지보수성**: 50% 개선 (컴포넌트 통합, 데이터 일원화)
- **버그 감소**: 60% 감소 (TypeScript, 테스트 코드)
- **개발 속도**: 40% 향상 (재사용 가능한 컴포넌트, 일관된 패턴)

### 사용자 경험
- **접근성**: WCAG 2.1 AA 수준 달성
- **안정성**: 에러 처리 및 폴백 UI로 60% 향상
- **반응성**: 로딩 상태 및 피드백으로 사용성 개선

---

## 🎯 성공 지표

### 기술적 지표
- [ ] Bundle size < 1MB
- [ ] Lighthouse Performance Score > 90
- [ ] Lighthouse Accessibility Score > 95
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

### 품질 지표
- [ ] TypeScript Coverage > 80%
- [ ] Test Coverage > 70%
- [ ] ESLint Errors = 0
- [ ] Code Duplication < 5%

### 사용자 지표
- [ ] Error Rate < 1%
- [ ] User Satisfaction Score > 4.5/5
- [ ] Mobile Usability Score > 95

---

## 📅 일정 계획

| 단계 | 기간 | 주요 마일스톤 |
|------|------|---------------|
| 1단계 | 3-4일 | 데이터 일원화 완료 |
| 2단계 | 2-3일 | 성능 최적화 완료 |
| 3단계 | 2-3일 | 코드 품질 개선 완료 |
| 4단계 | 2-3일 | 스타일링 및 접근성 완료 |
| 5단계 | 2-3일 | 고급 기능 구현 완료 |
| 6단계 | 3-4일 | TypeScript 및 테스트 완료 |
| **총 기간** | **14-20일** | **전체 리팩토링 완료** |

---

## 🚨 위험 요소 및 대응 방안

### 위험 요소
1. **기존 기능 손상**: 리팩토링 과정에서 기능 오류 발생
2. **데이터 구조 변경**: 기존 데이터와의 호환성 문제
3. **성능 저하**: 과도한 추상화로 인한 성능 이슈
4. **개발 일정 지연**: 예상보다 복잡한 이슈 발생

### 대응 방안
1. **점진적 마이그레이션**: 한 번에 모든 것을 변경하지 않고 단계적 진행
2. **철저한 테스트**: 각 단계마다 기능 테스트 수행
3. **백업 브랜치**: 각 단계별로 백업 브랜치 생성
4. **롤백 계획**: 문제 발생시 이전 버전으로 롤백 가능한 체계

---

## 📚 참고 자료

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [TypeScript React Best Practices](https://react-typescript-cheatsheet.netlify.app/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles/)
- [Tailwind CSS Components](https://tailwindcss.com/docs/reusing-styles)

---

**문서 버전**: 1.0  
**작성일**: 2024-07-06  
**작성자**: Claude Code Assistant  
**최종 업데이트**: 2024-07-06
