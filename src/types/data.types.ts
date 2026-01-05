// Work Categories
export type WorkCategory = 'music' | 'visual' | 'writing' | 'performance' | 'struggle';
export type MusicType = 'album' | 'single';
export type WritingType = '칼럼' | '르포' | 'essay' | 'report';
export type ActionType = 'play' | 'read' | 'view' | 'watch' | 'link';
export type PageType = 'works' | 'archive' | 'about' | 'all';

// Primary Action
export interface PrimaryAction {
    type: ActionType;
    url: string;
    label: string;
}

// Base Work Interface
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
}

// Specialized Work Types
export interface MusicWork extends BaseWork {
    archiveCategory: 'music';
    type: MusicType;
    featured?: boolean;
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

export type Work = MusicWork | WritingWork | VisualWork | PerformanceWork | StruggleWork | BaseWork;

// Works Collection
export interface Works {
    music: MusicWork[];
    visual: VisualWork[];
    writing: WritingWork[];
    performance: PerformanceWork[];
    struggle?: StruggleWork[];
}

// Artist
export interface Contact {
    email: string;
    phone: string;
    address: string;
}

export interface Artist {
    name: string;
    bio: string;
    philosophy: string;
    contact: Contact;
}

// Events
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

// News
export interface NewsItem {
    id: string;
    title: string;
    date: string;
    content: string;
    featured?: boolean;
}

// Metadata
export interface SiteMetadata {
    lastUpdated: string;
    version: string;
}

// Complete Site Data
export interface SiteData {
    metadata: SiteMetadata;
    artist: Artist;
    works: Works;
    events: Events;
    news: NewsItem[];
}
