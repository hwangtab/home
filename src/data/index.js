/**
 * 통합 데이터 로더
 * siteData.json에서 모든 데이터를 가져와 export 합니다.
 */
import siteData from './siteData.json';

// 모든 데이터를 포함하는 기본 객체를 export
export default siteData;

// 구조 분해 할당을 통해 각 데이터 섹션을 개별적으로 export
export const {
  metadata,
  artist,
  works,
  events,
  news
} = siteData;

// 기존 load 함수들을 유지하여 호환성 보장
export const loadArtistData = () => ({
  metadata: siteData.metadata,
  artist: siteData.artist
});

export const loadMusicData = () => siteData.works.music;

export const loadWorksData = () => siteData.works;

// Deprecated: Use loadWorksData instead
export const loadTimelineData = () => {
  console.warn('loadTimelineData is deprecated. Use loadWorksData instead.');
  return [];
};

export const loadNewsData = () => siteData.news;

export const loadEventsData = () => siteData.events;
