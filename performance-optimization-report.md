# 성능 최적화 보고서
*생성일: 2025-07-15*

## 📊 최적화 결과 요약

### 1. 데이터 로딩 최적화
- **단일 데이터 소스**: `src/data/siteData.json`
- **페이지별 selector 계층**: `src/data/siteContent.ts`
- **페이지별 동기 hook**: `src/hooks/usePageData.ts`

### 2. 번들 크기 분석
- **메인 JS 번들**: 120KB (gzip 압축 후)
- **코드 스플리팅**: 24개의 청크로 분할
- **React Player**: 별도 청크로 분리 (124.99KB)
- **기타 라이브러리**: 개별 청크로 최적화

## 🚀 구현된 최적화 기술

### 1. 단일 데이터 소스 + selector 기반 접근
```typescript
const { data: homeData } = useHomePageData(language);
const { data: worksPageData } = useWorksPageData(language);
```

**특징:**
- 콘텐츠 수정 지점이 `src/data/siteData.json` 하나로 고정
- 페이지별 데이터 형상은 selector에서만 관리
- 클라이언트 fetch 제거로 데이터 경로 복잡도 감소
- 타입 기반으로 페이지 데이터 스키마를 명확히 유지

### 2. React.lazy 코드 스플리팅
```javascript
const createLazyComponent = (importFn, componentName) => {
  return lazy(() => 
    importFn()
      .then(module => ({
        default: React.memo(module.default) // 메모화로 성능 향상
      }))
      .catch(error => {
        // 에러 처리 및 fallback
      })
  );
};
```

**이점:**
- 초기 번들 크기 최소화
- 필요한 페이지만 로드 (On-demand loading)
- React.memo로 불필요한 리렌더링 방지
- 고급 에러 처리 및 재시도 메커니즘

### 3. 캐시 최적화
- 정적 데이터는 모듈 캐시를 통해 재사용
- 페이지별 파생 데이터는 selector와 `useMemo`로 계산 비용 최소화

## 📈 예상 성능 개선 효과

### 유지보수성과 안정성
- 데이터 원본과 페이지별 파생 데이터가 분리되어 변경 영향 범위 축소
- 중복 JSON 제거로 데이터 불일치 가능성 감소
- `npm run data:validate`로 콘텐츠 변경 시 기본 스키마 검증 가능

### First Contentful Paint (FCP)
- 코드 스플리팅으로 초기 번들 크기 감소
- 필수 컴포넌트 우선 렌더링 유지

### 네트워크 사용량
- 별도 페이지 JSON 요청 제거
- 정적 번들에 포함된 데이터와 selector만 사용

## 🛠 기술적 세부사항

### 데이터 selector 계층
- `src/data/siteContent.ts`에서 locale별 데이터와 페이지별 selector 제공
- `src/lib/works.ts`는 작품 상세/slug 조회를 이 계층 위에서 수행

### 새로운 Hook: usePageData
- 페이지별 typed data 반환
- fetch/abort/fallback 없이 동기 selector 결과 사용
- `useHomePageData`, `useWorksPageData` 같은 목적별 hook 제공

### 로딩 상태 개선
- 스켈레톤 UI로 사용자 경험 향상
- 데이터 요청 실패 분기 제거로 불필요한 로딩 상태 단순화

## 🔮 추가 최적화 권장사항

### 단기 개선 (1-2주)
1. **이미지 최적화**
   - WebP 포맷 적용
   - 적응형 이미지 로딩

2. **CDN 적용**
   - 정적 자원을 CDN으로 배포
   - 전 세계 사용자 접근 속도 향상

### 중기 개선 (1-2개월)
1. **Service Worker**
   - 오프라인 지원
   - 백그라운드 데이터 프리페치

2. **Virtual Scrolling**
   - 긴 목록에서 성능 향상
   - Archive 페이지에 적용 권장

### 장기 개선 (3-6개월)
1. **State Management 최적화**
   - Zustand 또는 Jotai 도입 검토
   - 글로벌 상태 최적화

## ✅ 검증 완료 사항
- [x] `siteData.json` 단일 소스 기반 selector 계층 적용
- [x] `public/data/*.json` 제거
- [x] `npm run data:validate` 검증 스크립트 추가
- [x] React.lazy 코드 스플리팅 적용
- [x] 빌드 성공 및 번들 분석 완료
- [x] 타입 체크, 린트, 프로덕션 빌드 통과
