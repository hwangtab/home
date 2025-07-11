import React, { memo } from 'react';
import { motion } from 'framer-motion';
import CardRenderer from './CardRenderer';

// 데이터 렌더링 타입 정의
const RENDER_TYPES = {
  CARD_GRID: 'card_grid',
  TIMELINE: 'timeline',
  EVENT_CARD: 'event_card',
  PROFILE: 'profile',
  SIMPLE_LIST: 'simple_list'
};

// 그리드 레이아웃 렌더러
const CardGridRenderer = memo(({ 
  data, 
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  renderItem,
  itemKey = 'id',
  animation = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 font-wanted-sans">
          표시할 데이터가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${columns} gap-6 items-stretch`}>
      {data.map((item, index) => (
        <motion.div
          key={item[itemKey] || `item-${index}`}
          initial={animation ? { opacity: 0, y: 20 } : false}
          animate={animation ? { opacity: 1, y: 0 } : false}
          transition={animation ? { duration: 0.3, delay: index * 0.1 } : false}
        >
          {renderItem ? renderItem(item, index) : <CardRenderer work={item} />}
        </motion.div>
      ))}
    </div>
  );
});

// 타임라인 렌더러
const TimelineRenderer = memo(({ 
  data, 
  yearKey = 'year',
  eventsKey = 'events',
  renderEvent,
  reversed = false
}) => {
  const sortedData = [...data].sort((a, b) => 
    reversed ? b[yearKey] - a[yearKey] : a[yearKey] - b[yearKey]
  );

  return (
    <div className="space-y-8">
      {sortedData.map((yearData) => (
        <div key={yearData[yearKey]} className="relative">
          <div className="flex items-center mb-4">
            <div className="bg-gray-600 rounded-full w-4 h-4 mr-4"></div>
            <h4 className="text-xl font-bold text-gray-200 font-santokki">
              {yearData[yearKey]}
            </h4>
          </div>
          <div className="ml-8 space-y-3">
            {yearData[eventsKey].map((event, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                {renderEvent ? renderEvent(event, index) : (
                  <div>
                    <h5 className="font-bold text-gray-200 font-wanted-sans mb-1">
                      {event.title}
                    </h5>
                    <p className="text-gray-400 text-sm">
                      {event.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

// 이벤트 카드 렌더러
const EventCardRenderer = memo(({ 
  event, 
  showIcon = true,
  getEventIcon,
  getEventColor
}) => {
  const defaultGetIcon = (type) => {
    const icons = {
      'album': '🎵',
      'single': '🎵',
      'writing': '✍️',
      'performance': '🎤',
      'visual': '🎨',
      'default': '📅'
    };
    return icons[type] || icons['default'];
  };

  const defaultGetColor = (type) => {
    const colors = {
      'album': 'bg-blue-600',
      'single': 'bg-blue-600',
      'writing': 'bg-green-600',
      'performance': 'bg-red-600',
      'visual': 'bg-purple-600',
      'default': 'bg-gray-600'
    };
    return colors[type] || colors['default'];
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex items-start space-x-4 flex-1">
        {showIcon && (
          <div className={`p-3 rounded-full ${getEventColor ? getEventColor(event.type) : defaultGetColor(event.type)} flex-shrink-0`}>
            {getEventIcon ? getEventIcon(event.type) : defaultGetIcon(event.type)}
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-200 font-santokki mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-gray-400 font-wanted-sans text-sm flex-1 line-clamp-3">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
});

// 프로필 렌더러
const ProfileRenderer = memo(({ 
  profile, 
  imageSrc,
  imageAlt = 'Profile',
  layout = 'horizontal' // 'horizontal' or 'vertical'
}) => {
  const isHorizontal = layout === 'horizontal';

  return (
    <div className={`flex ${isHorizontal ? 'flex-col md:flex-row' : 'flex-col'} items-stretch gap-8`}>
      <div className={`${isHorizontal ? 'w-full md:w-1/3' : 'w-full'} flex flex-col justify-center`}>
        <motion.img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto rounded-lg shadow-lg object-cover"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className={`${isHorizontal ? 'w-full md:w-2/3' : 'w-full'} flex flex-col justify-center`}>
        {Array.isArray(profile) ? (
          profile.map((paragraph, index) => (
            <p key={index} className="text-lg text-gray-300 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-lg text-gray-300 leading-relaxed mb-4">
            {profile}
          </p>
        )}
      </div>
    </div>
  );
});

// 단순 리스트 렌더러
const SimpleListRenderer = memo(({ 
  data, 
  renderItem,
  itemKey = 'id',
  spacing = 'space-y-4'
}) => {
  return (
    <div className={spacing}>
      {data.map((item, index) => (
        <div key={item[itemKey] || `item-${index}`}>
          {renderItem ? renderItem(item, index) : (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-bold text-gray-200 font-wanted-sans">
                {item.title || item.name}
              </h4>
              {item.description && (
                <p className="text-gray-400 text-sm mt-1">
                  {item.description}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

// 메인 데이터 렌더러 컴포넌트
const DataRenderer = memo(({ 
  type = RENDER_TYPES.CARD_GRID,
  data,
  ...props
}) => {
  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 font-wanted-sans">
          데이터를 불러오는 중...
        </p>
      </div>
    );
  }

  switch (type) {
    case RENDER_TYPES.CARD_GRID:
      return <CardGridRenderer data={data} {...props} />;
    
    case RENDER_TYPES.TIMELINE:
      return <TimelineRenderer data={data} {...props} />;
    
    case RENDER_TYPES.EVENT_CARD:
      return <EventCardRenderer event={data} {...props} />;
    
    case RENDER_TYPES.PROFILE:
      return <ProfileRenderer profile={data || props.profile} {...props} />;
    
    case RENDER_TYPES.SIMPLE_LIST:
      return <SimpleListRenderer data={data} {...props} />;
    
    default:
      return (
        <div className="text-center py-8">
          <p className="text-gray-400 font-wanted-sans">
            알 수 없는 렌더링 타입입니다.
          </p>
        </div>
      );
  }
});

DataRenderer.displayName = 'DataRenderer';
CardGridRenderer.displayName = 'CardGridRenderer';
TimelineRenderer.displayName = 'TimelineRenderer';
EventCardRenderer.displayName = 'EventCardRenderer';
ProfileRenderer.displayName = 'ProfileRenderer';
SimpleListRenderer.displayName = 'SimpleListRenderer';

export default DataRenderer;
export { RENDER_TYPES };