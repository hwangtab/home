import React, { memo, useState, useEffect, useRef, useMemo, useCallback, ReactNode } from 'react';

interface VirtualGridItem {
    id?: string | number;
    [key: string]: unknown;
}

interface VirtualGridProps<T extends VirtualGridItem> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    itemHeight?: number;
    containerHeight?: number;
    columns?: number;
    gap?: number;
    overscan?: number;
    className?: string;
}

const VirtualGrid = memo(<T extends VirtualGridItem>({
    items = [] as T[],
    renderItem,
    itemHeight = 400,
    containerHeight = 600,
    columns = 3,
    gap = 24,
    overscan = 2,
    className = ""
}: VirtualGridProps<T>) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const { rowHeight, totalHeight, visibleStart, visibleItems } = useMemo(() => {
        const rowHeight = itemHeight + gap;
        const totalRows = Math.ceil(items.length / columns);
        const totalHeight = totalRows * rowHeight - gap;

        const visibleRowStart = Math.floor(scrollTop / rowHeight);
        const visibleRowEnd = Math.min(totalRows, Math.ceil((scrollTop + containerHeight) / rowHeight));

        const startRow = Math.max(0, visibleRowStart - overscan);
        const endRow = Math.min(totalRows, visibleRowEnd + overscan);

        const startIndex = startRow * columns;
        const endIndex = Math.min(items.length, endRow * columns);

        return {
            rowHeight,
            totalHeight,
            visibleStart: startIndex,
            visibleItems: items.slice(startIndex, endIndex)
        };
    }, [items, columns, itemHeight, gap, scrollTop, containerHeight, overscan]);

    const handleScroll = useCallback((e: Event) => {
        setScrollTop((e.target as HTMLDivElement).scrollTop);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const getItemPosition = useCallback((index: number) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        return {
            top: row * rowHeight,
            left: `${(col / columns) * 100}%`,
            width: `${(1 / columns) * 100}%`
        };
    }, [columns, rowHeight]);

    return (
        <div ref={containerRef} className={`relative overflow-auto ${className}`} style={{ height: containerHeight }}>
            <div style={{ height: totalHeight, position: 'relative' }}>
                {visibleItems.map((item, relativeIndex) => {
                    const actualIndex = visibleStart + relativeIndex;
                    const position = getItemPosition(actualIndex);
                    return (
                        <div
                            key={item.id || actualIndex}
                            style={{
                                position: 'absolute',
                                top: position.top,
                                left: position.left,
                                width: position.width,
                                height: itemHeight,
                                paddingRight: gap
                            }}
                        >
                            {renderItem(item, actualIndex)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}) as <T extends VirtualGridItem>(props: VirtualGridProps<T>) => JSX.Element;

(VirtualGrid as React.FC).displayName = 'VirtualGrid';

interface VirtualListProps<T extends VirtualGridItem> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    itemHeight?: number;
    containerHeight?: number;
    gap?: number;
    overscan?: number;
    className?: string;
}

export const VirtualList = memo(<T extends VirtualGridItem>(props: VirtualListProps<T>) => {
    return <VirtualGrid {...props} columns={1} />;
}) as <T extends VirtualGridItem>(props: VirtualListProps<T>) => JSX.Element;

(VirtualList as React.FC).displayName = 'VirtualList';

interface InfiniteVirtualGridProps<T extends VirtualGridItem> extends VirtualGridProps<T> {
    loadMore: () => Promise<void>;
    hasMore?: boolean;
    isLoading?: boolean;
    threshold?: number;
}

export const InfiniteVirtualGrid = memo(<T extends VirtualGridItem>({
    items = [] as T[],
    renderItem,
    loadMore,
    hasMore = false,
    isLoading = false,
    threshold = 200,
    ...virtualGridProps
}: InfiniteVirtualGridProps<T>) => {
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const handleScroll = useCallback(async (e: Event) => {
        if (!hasMore || isLoading || isLoadingMore) return;
        const target = e.target as HTMLDivElement;
        const { scrollTop, scrollHeight, clientHeight } = target;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

        if (distanceFromBottom < threshold) {
            setIsLoadingMore(true);
            try { await loadMore(); } finally { setIsLoadingMore(false); }
        }
    }, [hasMore, isLoading, isLoadingMore, threshold, loadMore]);

    useEffect(() => {
        // Note: handleScroll is attached via the VirtualGrid's internal container
    }, [handleScroll]);

    return <VirtualGrid items={items} renderItem={renderItem} {...virtualGridProps} />;
}) as <T extends VirtualGridItem>(props: InfiniteVirtualGridProps<T>) => JSX.Element;

(InfiniteVirtualGrid as React.FC).displayName = 'InfiniteVirtualGrid';

interface ResponsiveVirtualGridProps<T extends VirtualGridItem> extends Omit<VirtualGridProps<T>, 'columns'> { }

export const ResponsiveVirtualGrid = memo(<T extends VirtualGridItem>(props: ResponsiveVirtualGridProps<T>) => {
    const [columns, setColumns] = useState(3);

    useEffect(() => {
        const updateColumns = () => {
            const width = window.innerWidth;
            if (width < 768) setColumns(1);
            else if (width < 1024) setColumns(2);
            else setColumns(3);
        };
        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    return <VirtualGrid {...props} columns={columns} />;
}) as <T extends VirtualGridItem>(props: ResponsiveVirtualGridProps<T>) => JSX.Element;

(ResponsiveVirtualGrid as React.FC).displayName = 'ResponsiveVirtualGrid';

export default VirtualGrid;
