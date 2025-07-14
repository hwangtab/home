import React, { memo, useState, useEffect, useRef, useMemo, useCallback } from 'react';

/**
 * 가상화된 그리드 컴포넌트
 * 대용량 데이터 렌더링 성능 최적화
 * @param {Array} items - 렌더링할 아이템 배열
 * @param {Function} renderItem - 각 아이템을 렌더링하는 함수
 * @param {number} itemHeight - 각 아이템의 높이 (px)
 * @param {number} containerHeight - 컨테이너 높이 (px)
 * @param {number} columns - 그리드 컬럼 수
 * @param {number} gap - 아이템 간 간격 (px)
 * @param {number} overscan - 뷰포트 외부에 렌더링할 추가 아이템 수
 */
const VirtualGrid = memo(({
  items = [],
  renderItem,
  itemHeight = 400,
  containerHeight = 600,
  columns = 3,
  gap = 24,
  overscan = 2,
  className = ""
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // 그리드 계산
  const {
    rowHeight,
    totalRows,
    totalHeight,
    visibleStart,
    visibleEnd,
    visibleItems
  } = useMemo(() => {
    const rowHeight = itemHeight + gap;
    const totalRows = Math.ceil(items.length / columns);
    const totalHeight = totalRows * rowHeight - gap; // 마지막 gap 제거

    // 현재 보이는 영역 계산
    const visibleRowStart = Math.floor(scrollTop / rowHeight);
    const visibleRowEnd = Math.min(
      totalRows,
      Math.ceil((scrollTop + containerHeight) / rowHeight)
    );

    // overscan 적용
    const startRow = Math.max(0, visibleRowStart - overscan);
    const endRow = Math.min(totalRows, visibleRowEnd + overscan);

    const startIndex = startRow * columns;
    const endIndex = Math.min(items.length, endRow * columns);

    return {
      rowHeight,
      totalRows,
      totalHeight,
      visibleStart: startIndex,
      visibleEnd: endIndex,
      visibleItems: items.slice(startIndex, endIndex)
    };
  }, [items, columns, itemHeight, gap, scrollTop, containerHeight, overscan]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  // 스크롤 이벤트 등록
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 아이템 위치 계산
  const getItemPosition = useCallback((index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    
    return {
      top: row * rowHeight,
      left: `${(col / columns) * 100}%`,
      width: `${(1 / columns) * 100}%`
    };
  }, [columns, rowHeight]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      {/* 전체 스크롤 높이를 위한 컨테이너 */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* 실제 렌더링되는 아이템들 */}
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
});

VirtualGrid.displayName = 'VirtualGrid';

/**
 * 가상화된 리스트 컴포넌트 (단일 컬럼)
 */
export const VirtualList = memo(({
  items = [],
  renderItem,
  itemHeight = 100,
  containerHeight = 600,
  gap = 8,
  overscan = 5,
  className = ""
}) => {
  return (
    <VirtualGrid
      items={items}
      renderItem={renderItem}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      columns={1}
      gap={gap}
      overscan={overscan}
      className={className}
    />
  );
});

VirtualList.displayName = 'VirtualList';

/**
 * 무한 스크롤 가상화 컴포넌트
 */
export const InfiniteVirtualGrid = memo(({
  items = [],
  renderItem,
  loadMore,
  hasMore = false,
  isLoading = false,
  threshold = 200,
  ...virtualGridProps
}) => {
  const containerRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 무한 스크롤 감지
  const handleScroll = useCallback(async (e) => {
    if (!hasMore || isLoading || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom < threshold) {
      setIsLoadingMore(true);
      try {
        await loadMore();
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [hasMore, isLoading, isLoadingMore, threshold, loadMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <VirtualGrid
      ref={containerRef}
      items={items}
      renderItem={renderItem}
      {...virtualGridProps}
    />
  );
});

InfiniteVirtualGrid.displayName = 'InfiniteVirtualGrid';

/**
 * 적응형 가상화 그리드 - 화면 크기에 따라 컬럼 수 자동 조정
 */
export const ResponsiveVirtualGrid = memo((props) => {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setColumns(1);
      } else if (width < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return <VirtualGrid {...props} columns={columns} />;
});

ResponsiveVirtualGrid.displayName = 'ResponsiveVirtualGrid';

export default VirtualGrid;