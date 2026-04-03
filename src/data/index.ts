import { getSiteData } from './siteContent';

const siteData = getSiteData('ko');

export default siteData;

export const { metadata, artist, works, events, news } = siteData;

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

export * from './siteContent';
