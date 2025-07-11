import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import { Play, X, ExternalLink, Calendar, Tag } from 'lucide-react';

const VideoModal = ({ video, isOpen, onClose }) => {
  if (!video) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-6xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-60"
            >
              <X size={32} />
            </button>

            {/* Video Player */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <div className="aspect-video">
                <ReactPlayer
                  url={video.url}
                  width="100%"
                  height="100%"
                  controls
                  playing={true}
                  config={{
                    youtube: {
                      playerVars: {
                        showinfo: 1,
                        modestbranding: 1
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-4 text-white">
              <h2 className="text-2xl font-bold font-santokki mb-2">
                {video.title}
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-300">
                {video.year && (
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{video.year}</span>
                  </div>
                )}
                
                {video.type && (
                  <div className="flex items-center gap-1">
                    <Tag size={16} />
                    <span>{video.type}</span>
                  </div>
                )}
                
                {video.duration && (
                  <span>{video.duration}</span>
                )}
              </div>

              {video.description && (
                <p className="text-gray-300 font-wanted-sans leading-relaxed mb-4">
                  {video.description}
                </p>
              )}

              {video.credits && video.credits.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold mb-2">크레딧</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    {video.credits.map((credit, index) => (
                      <div key={index}>
                        <span className="font-medium">{credit.role}:</span> {credit.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const VideoCard = ({ video, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => onClick(video)}
    >
      <div className="relative aspect-video bg-gray-700">
        {/* Thumbnail */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <div className="bg-white bg-opacity-90 rounded-full p-4">
              <Play className="text-gray-900" size={32} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
            {video.duration}
          </div>
        )}

        {/* Type badge */}
        {video.type && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
            {video.type}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-200 font-santokki mb-2 line-clamp-2">
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>{video.year}</span>
          {video.views && <span>{video.views} 조회</span>}
        </div>

        {video.description && (
          <p className="text-gray-400 font-wanted-sans text-sm line-clamp-2">
            {video.description}
          </p>
        )}

        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {video.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{video.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* External link */}
        {video.externalUrl && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <a
              href={video.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} className="mr-1" />
              원본 보기
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const VideoGallery = ({ videos = [], title = "비디오 갤러리" }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const videoTypes = ['all', ...new Set(videos.map(video => video.type).filter(Boolean))];
  
  const filteredVideos = filter === 'all' 
    ? videos 
    : videos.filter(video => video.type === filter);

  const openModal = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-200 font-santokki">
          {title}
        </h2>
        
        {videoTypes.length > 1 && (
          <div className="flex gap-2">
            {videoTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-wanted-sans transition-all ${
                  filter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type === 'all' ? '전체' : type}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 font-wanted-sans">
            {filter === 'all' ? '비디오가 없습니다.' : `'${filter}' 유형의 비디오가 없습니다.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={openModal}
            />
          ))}
        </div>
      )}

      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default VideoGallery;