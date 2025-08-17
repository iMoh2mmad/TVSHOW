'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Plus, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Movie, Series } from '@/lib/types';
import { useUIStore } from '@/lib/stores/ui-store';
import Link from 'next/link';

interface ContentCardProps {
  item: Movie | Series;
  size?: 'sm' | 'md' | 'lg';
  showInfo?: boolean;
  className?: string;
}

export function ContentCard({ 
  item, 
  size = 'md', 
  showInfo = true, 
  className 
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInMyList, addToMyList, removeFromMyList } = useUIStore();
  const inMyList = isInMyList(item.id);

  const handleMyListToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inMyList) {
      removeFromMyList(item.id);
    } else {
      addToMyList(item.id);
    }
  };

  const cardSizes = {
    sm: 'w-40 h-60',
    md: 'w-52 h-72',
    lg: 'w-64 h-80',
  };

  const isMovie = !('seasons' in item);
  const hasSource = item.source?.master_url;

  return (
    <Card 
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:z-10 bg-gray-900 border-gray-700',
        cardSizes[size],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 h-full">
        <div className="relative h-full">
          {/* Poster image */}
          <div className="relative h-full w-full">
            {item.poster_url ? (
              <Image
                src={item.poster_url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}

            {/* Quality badges */}
            <div className="absolute top-2 right-2 flex gap-1">
              {item.source && (
                <Badge variant="secondary" className="bg-green-600 text-white">
                  HD
                </Badge>
              )}
              {item.subtitles && item.subtitles.length > 0 && (
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  CC
                </Badge>
              )}
            </div>

            {/* Hover overlay */}
            <div className={cn(
              'absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}>
              {/* Action buttons */}
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <div className="flex gap-2">
                  {hasSource && (
                    <Link href={`/watch/${item.id}`}>
                      <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                    </Link>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-gray-800/80 text-white hover:bg-gray-700/80"
                    onClick={handleMyListToggle}
                  >
                    {inMyList ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>

                  <Link href={`/title/${item.id}`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-gray-800/80 text-white hover:bg-gray-700/80"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {showInfo && (
                  <div className="space-y-1 text-white">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {item.title}
                    </h3>
                    {item.year && (
                      <p className="text-xs text-gray-300">
                        {item.year}
                      </p>
                    )}
                    {item.genres && item.genres.length > 0 && (
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {item.genres.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}