import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * 앨범 커버 모자이크 컴포넌트
 * 앨범과 싱글 커버 이미지들을 무작위 그리드로 배치하여 배경 효과 생성
 */
const AlbumMosaic = memo(({ 
  albums = [], 
  singles = [], 
  className = '',
  opacity = 0.3,
  animationDelay = 0.1,
  enableHover = true,
  enableClick = true
}) => {
  const navigate = useNavigate();
  const [mosaicTiles, setMosaicTiles] = useState([]);

  // 앨범과 싱글 데이터를 합치고 모자이크 타일 생성
  useEffect(() => {
    const allCovers = [
      ...albums.filter(album => album.cover).map(album => ({
        id: album.id,
        cover: album.cover,
        title: album.title,
        year: album.year,
        type: 'album'
      })),
      ...singles.filter(single => single.cover).map(single => ({
        id: single.id,
        cover: single.cover,
        title: single.title,
        year: single.year,
        type: 'single'
      }))
    ];

    // 피셔-예이츠 셔플 알고리즘으로 완전 랜덤 섞기
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // 타일 크기와 위치를 무작위로 생성
    const generateMosaicTiles = () => {
      const gridSize = window.innerWidth >= 768 ? 12 : 8;
      const totalTiles = window.innerWidth >= 768 ? 80 : 40; // 타일 수 증가
      const tiles = [];
      
      // 다양한 커버 선택을 위한 확장된 풀 생성
      const extendedCovers = [];
      for (let repeat = 0; repeat < Math.ceil(totalTiles / allCovers.length) + 1; repeat++) {
        extendedCovers.push(...shuffleArray(allCovers));
      }
      
      // 겹치지 않는 위치 추적을 위한 그리드 맵
      const occupiedCells = new Set();
      
      for (let i = 0; i < totalTiles && i < extendedCovers.length; i++) {
        const cover = extendedCovers[i];
        
        // 타일 크기 결정 (더 균형잡힌 분포)
        const sizeVariants = [
          { width: 1, height: 1, weight: 60 },
          { width: 2, height: 1, weight: 15 },
          { width: 1, height: 2, weight: 15 },
          { width: 2, height: 2, weight: 10 }
        ];
        
        const random = Math.random() * 100;
        let cumulativeWeight = 0;
        let selectedSize = sizeVariants[0];
        
        for (const variant of sizeVariants) {
          cumulativeWeight += variant.weight;
          if (random <= cumulativeWeight) {
            selectedSize = variant;
            break;
          }
        }
        
        // 겹치지 않는 위치 찾기 (최대 50번 시도)
        let attempts = 0;
        let validPosition = false;
        let gridColumn, gridRow;
        
        while (!validPosition && attempts < 50) {
          gridColumn = Math.floor(Math.random() * (gridSize - selectedSize.width + 1)) + 1;
          gridRow = Math.floor(Math.random() * (gridSize - selectedSize.height + 1)) + 1;
          
          // 해당 영역이 비어있는지 확인
          let isAreaFree = true;
          for (let col = gridColumn; col < gridColumn + selectedSize.width; col++) {
            for (let row = gridRow; row < gridRow + selectedSize.height; row++) {
              if (occupiedCells.has(`${col}-${row}`)) {
                isAreaFree = false;
                break;
              }
            }
            if (!isAreaFree) break;
          }
          
          if (isAreaFree) {
            // 영역을 점유된 것으로 표시
            for (let col = gridColumn; col < gridColumn + selectedSize.width; col++) {
              for (let row = gridRow; row < gridRow + selectedSize.height; row++) {
                occupiedCells.add(`${col}-${row}`);
              }
            }
            validPosition = true;
          }
          attempts++;
        }
        
        // 유효한 위치를 찾았을 때만 타일 추가
        if (validPosition) {
          tiles.push({
            id: `${cover.id}-${i}-${Date.now()}`,
            cover: cover.cover,
            title: cover.title,
            year: cover.year,
            type: cover.type,
            originalId: cover.id,
            gridColumn,
            gridRow,
            gridColumnSpan: selectedSize.width,
            gridRowSpan: selectedSize.height,
            opacity: Math.random() * 0.5 + 0.5, // 0.5~1.0 높은 투명도
            rotation: (Math.random() - 0.5) * 8, // -4도~4도 (더 미묘한 회전)
            delay: Math.random() * 2,
            blur: Math.random() * 0.5, // 0~0.5px (블러 감소)
            scale: 0.95 + Math.random() * 0.1, // 0.95~1.05 크기 변화
            brightness: 0.8 + Math.random() * 0.4 // 0.8~1.2 밝기 변화
          });
        }
      }
      
      return tiles;
    };

    if (allCovers.length > 0) {
      setMosaicTiles(generateMosaicTiles());
    }
  }, [albums, singles]);

  // 타일 클릭 핸들러
  const handleTileClick = (tile) => {
    if (!enableClick) return;
    
    if (tile.type === 'album') {
      navigate('/works/music');
    } else {
      navigate('/works/music');
    }
  };

  // 타일 리셔플 (일정 시간마다 재배치)
  useEffect(() => {
    const interval = setInterval(() => {
      if (mosaicTiles.length > 0) {
        setMosaicTiles(prevTiles => 
          prevTiles.map(tile => ({
            ...tile,
            opacity: Math.random() * 0.4 + 0.6, // 더 높은 투명도 유지
            rotation: (Math.random() - 0.5) * 8,
            delay: Math.random() * 0.5,
            blur: Math.random() * 0.3,
            brightness: 0.8 + Math.random() * 0.4
          }))
        );
      }
    }, 15000); // 15초마다 리셔플 (더 오래 유지)

    return () => clearInterval(interval);
  }, [mosaicTiles.length]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0 grid grid-cols-8 md:grid-cols-12 grid-rows-8 md:grid-rows-12 gap-1 p-2 md:p-4"
        style={{ 
          transform: 'scale(1.1)', // 약간 확대하여 가장자리 여백 제거
          opacity: opacity 
        }}
      >
        {mosaicTiles.map((tile) => (
          <motion.div
            key={tile.id}
            className={`relative overflow-hidden rounded-sm ${enableClick ? 'cursor-pointer' : ''}`}
            style={{
              gridColumn: `${tile.gridColumn} / span ${tile.gridColumnSpan}`,
              gridRow: `${tile.gridRow} / span ${tile.gridRowSpan}`,
            }}
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              rotate: tile.rotation 
            }}
            animate={{ 
              opacity: tile.opacity, 
              scale: 1,
              rotate: tile.rotation 
            }}
            transition={{ 
              duration: 0.8, 
              delay: tile.delay,
              ease: "easeOut"
            }}
            whileHover={enableHover ? { 
              scale: (tile.scale || 1) * 1.15, 
              opacity: 1,
              rotate: tile.rotation + 3,
              zIndex: 10,
              filter: 'blur(0px) brightness(1.1) saturate(1.3)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
              transition: { duration: 0.2 }
            } : {}}
            onClick={() => handleTileClick(tile)}
          >
            <img
              src={tile.cover}
              alt={`${tile.title} (${tile.year})`}
              className="w-full h-full object-cover transition-all duration-300"
              style={{
                filter: `blur(${tile.blur || 0}px) saturate(1.4) contrast(1.2) brightness(${tile.brightness || 1})`,
                transform: `scale(${tile.scale || 1})`
              }}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                // 이미지 로드 실패 시 숨김
                e.target.style.display = 'none';
              }}
            />
            {/* 호버 시 정보 표시 - 개선된 디자인 */}
            {enableHover && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-end justify-center opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center text-white p-2 w-full">
                  <div className="mb-1">
                    <div className="w-6 h-6 mx-auto mb-1 bg-brand-primary-500/20 rounded-full flex items-center justify-center border border-brand-primary-400/40">
                      <div className="w-0 h-0 border-l-[6px] border-r-0 border-t-[3px] border-b-[3px] border-l-white border-t-transparent border-b-transparent ml-0.5" />
                    </div>
                  </div>
                  <p className="font-wanted-sans text-xs font-bold truncate">
                    {tile.title}
                  </p>
                  <p className="font-wanted-sans text-xs opacity-75">
                    {tile.year} · {tile.type === 'album' ? '앨범' : '싱글'}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* 그라디언트 오버레이 (가독성을 위한 어두운 오버레이) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
    </div>
  );
});

AlbumMosaic.displayName = 'AlbumMosaic';

export default AlbumMosaic;