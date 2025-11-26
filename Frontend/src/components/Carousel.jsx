import { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const Carousel = ({ items, renderItem, slidesToShow = 5, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const maxIndex = Math.max(0, items.length - slidesToShow);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.scrollWidth / items.length;
      carouselRef.current.scrollTo({
        left: currentIndex * itemWidth,
        behavior: 'smooth',
      });
    }
  }, [currentIndex, items.length]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Previous Button */}
      {currentIndex > 0 && (
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Previous"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      )}

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: `calc((100% - ${(slidesToShow - 1) * 16}px) / ${slidesToShow})` }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Next Button */}
      {currentIndex < maxIndex && (
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Next"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Carousel;
