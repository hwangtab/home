// react-player 타입 정의 — 라이브러리의 타입이 불완전하여 직접 정의
import type { ComponentType, HTMLAttributes, RefAttributes } from 'react';

interface ReactPlayerConfig {
    html?: Record<string, unknown>;
    hls?: Record<string, unknown>;
    dash?: Record<string, unknown>;
    mux?: Record<string, unknown>;
    youtube?: Record<string, unknown>;
    vimeo?: Record<string, unknown>;
    wistia?: Record<string, unknown>;
}

interface ReactPlayerPreviewProps {
    src?: string;
    light?: boolean | string | React.ReactNode;
    oEmbedUrl?: string;
    onClickPreview?: (event: React.SyntheticEvent) => void;
    playIcon?: React.ReactNode;
    previewAriaLabel?: string;
    previewTabIndex?: number;
}

interface ReactPlayerVideoElementProps {
    playbackRate?: number;
    volume?: number;
    config?: ReactPlayerConfig;
}

export interface ReactPlayerProps
    extends ReactPlayerPreviewProps,
        ReactPlayerVideoElementProps,
        Omit<HTMLAttributes<HTMLVideoElement>, 'onDuration' | 'onEnded'> {
    fallback?: React.ReactNode;
    onReady?: () => void;
    onStart?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
    pip?: boolean;
    playing?: boolean;
    wrapper?: string | ComponentType<HTMLAttributes<HTMLDivElement>>;
    // HTMLMediaElement 이벤트 (타입 정의 누락 보완)
    onDuration?: (duration: number) => void;
    onEnded?: () => void;
}

declare const ReactPlayer: React.ForwardRefExoticComponent<
    Omit<ReactPlayerProps, 'ref'> & RefAttributes<HTMLVideoElement>
>;

export default ReactPlayer;
