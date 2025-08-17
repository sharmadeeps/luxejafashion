import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { IoClose } from 'react-icons/io5';

export default function StoryReel() {
  const [selectedStory, setSelectedStory] = useState(null);
  const [progress, setProgress] = useState(0);
  
  const { data: stories } = useQuery({
    queryKey: ['stories'],
    queryFn: api.getActiveStories,
  });
  
  useEffect(() => {
    if (selectedStory) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + 2;
        });
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [selectedStory]);
  
  const handleNextStory = () => {
    const currentIndex = stories?.findIndex(s => s.id === selectedStory.id);
    if (currentIndex < stories.length - 1) {
      setSelectedStory(stories[currentIndex + 1]);
      setProgress(0);
    } else {
      setSelectedStory(null);
    }
  };
  
  return (
    <>
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {stories?.map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStory(story)}
                className="flex-shrink-0 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-luxury-blue to-luxury-gold p-0.5">
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <img
                      src={story.thumbnail}
                      alt={story.title}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-xs text-center mt-1 text-neutral-700">
                  {story.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setSelectedStory(null)}
          >
            <div className="relative w-full max-w-lg h-full max-h-[80vh]">
              {/* Progress Bar */}
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="bg-white/30 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-100"
                    style={{ width: \`\${progress}%\` }}
                  />
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStory(null);
                }}
                className="absolute top-4 right-4 z-10 text-white p-2"
              >
                <IoClose size={24} />
              </button>
              
              {/* Story Content */}
              {selectedStory.mediaType === 'image' ? (
                <img
                  src={selectedStory.mediaUrl}
                  alt={selectedStory.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={selectedStory.mediaUrl}
                  autoPlay
                  muted
                  className="w-full h-full object-contain"
                />
              )}
              
              {/* Story Link */}
              {selectedStory.linkUrl && (
                <a
                  href={selectedStory.linkUrl}
                  className="absolute bottom-8 left-4 right-4 bg-white text-luxury-blue py-3 px-6 rounded-full text-center font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {selectedStory.linkText || 'Shop Now'}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} rounded-full overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStory(null);
                }}
                className="absolute top-4 right-4 z-10 text-white p-2"
              >
                <IoClose size={24} />
              </button>
              
              {/* Story Content */}
              {selectedStory.mediaType === 'image' ? (
                <img
                  src={selectedStory.mediaUrl}
                  alt={selectedStory.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={selectedStory.mediaUrl}
                  autoPlay
                  muted
                  className="w-full h-full object-contain"
                />
              )}
              
              {/* Story Link */}
              {selectedStory.linkUrl && (
                <a
                  href={selectedStory.linkUrl}
                  className="absolute bottom-8 left-4 right-4 bg-white text-luxury-blue py-3 px-6 rounded-full text-center font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {selectedStory.linkText || 'Shop Now'}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}