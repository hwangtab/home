/**
 * 통합 데이터 로더
 * siteData.json에서 모든 데이터를 가져와 export 합니다.
 */
import siteDataJson from './siteData.json';
import type { SiteData } from '../types/data.types';

// Type assertion for JSON data
const siteData = siteDataJson as unknown as SiteData;
export default siteData;

export const {
    metadata,
    artist,
    works,
    events,
    news
} = siteData;

export const loadArtistData = () => ({
    metadata: siteData.metadata,
    artist: siteData.artist
});

export const loadMusicData = () => siteData.works.music;

export const loadWorksData = () => siteData.works;

export const loadTimelineData = () => {
    console.warn('loadTimelineData is deprecated. Use loadWorksData instead.');
    return [];
};

export const loadNewsData = () => siteData.news;

export const loadEventsData = () => siteData.events;
