export const WORK_CATEGORIES = ['music', 'visual', 'writing', 'performance', 'struggle'] as const;
export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export type MusicType = 'album' | 'single';
export type WritingType = '칼럼' | '르포' | 'essay' | 'report';
export type ActionType = 'play' | 'read' | 'view' | 'watch' | 'link';

export const PAGE_TYPES = ['works', 'archive', 'about', 'all'] as const;
export type PageType = (typeof PAGE_TYPES)[number];

export interface PrimaryAction {
    type: ActionType;
    url: string;
    label: string;
}

export interface BaseWork {
    id: string;
    title: string;
    year: number;
    type?: string;
    cover?: string;
    description: string;
    shortDescription?: string;
    primaryAction?: PrimaryAction;
    tags?: string[];
    showInPages?: PageType[];
    archiveCategory?: WorkCategory;
    sortPriority?: number;
    role?: string;
    /** 플랫폼별 외부 링크 (e.g., { spotify: '...', youtube: '...' }) */
    links?: Record<string, string>;
}

export interface MusicWork extends BaseWork {
    archiveCategory: 'music';
    type: MusicType;
    featured?: boolean;
    purchaseUrl?: string;
    price?: string;
    coverUrl?: string;
}

export interface WritingWork extends BaseWork {
    archiveCategory: 'writing';
    type?: WritingType | string;
    publication?: string;
    excerpt?: string;
}

export interface VisualWork extends BaseWork {
    archiveCategory: 'visual';
    images?: string[];
}

export interface PerformanceWork extends BaseWork {
    archiveCategory: 'performance';
    location?: string;
    credits?: string[];
}

export interface StruggleWork extends BaseWork {
    archiveCategory: 'struggle';
}

export type Work = MusicWork | WritingWork | VisualWork | PerformanceWork | StruggleWork;

export interface Works {
    music: MusicWork[];
    visual: VisualWork[];
    writing: WritingWork[];
    performance: PerformanceWork[];
    struggle?: StruggleWork[];
}

export interface Contact {
    email: string;
    phone: string;
    address: string;
}

export interface ArtistAward {
    year: number;
    name: string;
    work: string;
    issuer: string;
}

export interface Artist {
    name: string;
    bio: string;
    philosophy: string;
    contact: Contact;
    awards?: ArtistAward[];
}

export type ConcertStatus = 'upcoming' | 'past' | 'cancelled';

export interface Concert {
    id: string;
    title: string;
    date: string;
    location: string;
    ticketUrl?: string;
    status: ConcertStatus;
}

export interface Events {
    concerts: Concert[];
}

export interface NewsItem {
    id: string;
    title: string;
    date: string;
    content: string;
    featured?: boolean;
}

export interface SiteMetadata {
    lastUpdated: string;
    version: string;
}

export interface SiteData {
    metadata: SiteMetadata;
    artist: Artist;
    works: Works;
    events: Events;
    news: NewsItem[];
}
