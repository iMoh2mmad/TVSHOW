'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentCard } from './content-card';
import { Movie, Series } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ContentCarouselProps {
  title: string;
  items: (Movie | Series)[];
  className?: string;
}

export function ContentCarousel({ title, items, className }: ContentCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft = container.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  if (items.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-2xl font-bold text-white px-4 md:px-8">{title}</h2>
      
      <div className="relative group">
        {/* Left arrow */}
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            'absolute left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition-opacity',
            showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Right arrow */}
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition-opacity',
            showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Carousel container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={handleScroll}
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0">
              <ContentCard item={item} size="md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}