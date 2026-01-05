import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full flex flex-col animate-pulse">
            <div className="relative w-full aspect-square bg-gray-700">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-16 h-6 bg-gray-700 rounded-full" />
                    <div className="w-12 h-4 bg-gray-700 rounded" />
                </div>

                <div className="space-y-2 mb-3">
                    <div className="w-3/4 h-6 bg-gray-700 rounded" />
                    <div className="w-1/2 h-6 bg-gray-700 rounded" />
                </div>

                <div className="space-y-2 mb-4 flex-1">
                    <div className="w-full h-4 bg-gray-700 rounded" />
                    <div className="w-5/6 h-4 bg-gray-700 rounded" />
                    <div className="w-2/3 h-4 bg-gray-700 rounded" />
                </div>

                <div className="flex gap-2 mb-4">
                    <div className="w-12 h-6 bg-gray-700 rounded-full" />
                    <div className="w-16 h-6 bg-gray-700 rounded-full" />
                    <div className="w-14 h-6 bg-gray-700 rounded-full" />
                </div>

                <div className="flex justify-end">
                    <div className="w-20 h-8 bg-gray-700 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

const AnimatedSkeletonCard: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <SkeletonCard />
        </motion.div>
    );
};

interface SkeletonGridProps {
    count?: number;
    animated?: boolean;
}

const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 6, animated = true }) => {
    const CardComponent = animated ? AnimatedSkeletonCard : SkeletonCard;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }, (_, index) => (
                <CardComponent key={`skeleton-${index}`} />
            ))}
        </div>
    );
};

export default SkeletonCard;
export { AnimatedSkeletonCard, SkeletonGrid };
