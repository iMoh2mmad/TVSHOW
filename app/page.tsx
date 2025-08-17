'use client';

import { useQuery } from '@tanstack/react-query';
import { ContentCarousel } from '@/components/ui/content-carousel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Plus, Info } from 'lucide-react';
import { Movie, Series } from '@/lib/types';
import { useUIStore } from '@/lib/stores/ui-store';
import Image from 'next/image';
import Link from 'next/link';

async function fetchContent() {
  const [moviesRes, seriesRes] = await Promise.all([
    fetch('/api/movies?published=true'),
    fetch('/api/series?published=true'),
  ]);

  const [moviesData, seriesData] = await Promise.all([
    moviesRes.json(),
    seriesRes.json(),
  ]);

  return {
    movies: moviesData.data || [],
    series: seriesData.data || [],
  };
}

export default function HomePage() {
  const { addToMyList, removeFromMyList, isInMyList } = useUIStore();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['homepage-content'],
    queryFn: fetchContent,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-400">Failed to load content</p>
        </div>
      </div>
    );
  }

  const { movies, series } = data;
  const allContent = [...movies, ...series];
  const featuredItem = allContent.find(item => item.published) || allContent[0];

  // Group content by categories
  const trending = allContent.slice(0, 10);
  const newReleases = allContent
    .filter(item => {
      const itemYear = item.year || 0;
      return itemYear >= new Date().getFullYear() - 1;
    })
    .slice(0, 10);
  
  const actionContent = allContent.filter(item => 
    item.genres?.includes('Action')
  ).slice(0, 10);
  
  const dramaContent = allContent.filter(item => 
    item.genres?.includes('Drama')
  ).slice(0, 10);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      {featuredItem && (
        <section className="relative h-[80vh] overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            {featuredItem.backdrop_url || featuredItem.poster_url ? (
              <Image
                src={featuredItem.backdrop_url || featuredItem.poster_url || ''}
                alt={featuredItem.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="px-4 md:px-8 lg:px-16 max-w-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {'seasons' in featuredItem ? (
                    <Badge variant="secondary" className="bg-red-600 text-white">
                      Series
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      Movie
                    </Badge>
                  )}
                  {featuredItem.year && (
                    <Badge variant="outline" className="border-gray-500 text-white">
                      {featuredItem.year}
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  {featuredItem.title}
                </h1>

                {featuredItem.overview && (
                  <p className="text-lg text-gray-300 line-clamp-3 max-w-lg">
                    {featuredItem.overview}
                  </p>
                )}

                {featuredItem.genres && featuredItem.genres.length > 0 && (
                  <div className="flex gap-2">
                    {featuredItem.genres.slice(0, 3).map((genre) => (
                      <span key={genre} className="text-sm text-gray-400">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  {featuredItem.source?.master_url && (
                    <Link href={`/watch/${featuredItem.id}`}>
                      <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                        <Play className="h-5 w-5 mr-2" />
                        Play
                      </Button>
                    </Link>
                  )}

                  <Button
                    size="lg"
                    variant="ghost"
                    className="bg-gray-600/80 text-white hover:bg-gray-500/80"
                    onClick={() => {
                      if (isInMyList(featuredItem.id)) {
                        removeFromMyList(featuredItem.id);
                      } else {
                        addToMyList(featuredItem.id);
                      }
                    }}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    My List
                  </Button>

                  <Link href={`/title/${featuredItem.id}`}>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="bg-gray-600/80 text-white hover:bg-gray-500/80"
                    >
                      <Info className="h-5 w-5 mr-2" />
                      More Info
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Carousels */}
      <div className="relative -mt-32 z-10 space-y-12 pb-12">
        {trending.length > 0 && (
          <ContentCarousel title="Trending Now" items={trending} />
        )}
        
        {newReleases.length > 0 && (
          <ContentCarousel title="New Releases" items={newReleases} />
        )}
        
        {movies.length > 0 && (
          <ContentCarousel title="Movies" items={movies} />
        )}
        
        {series.length > 0 && (
          <ContentCarousel title="TV Series" items={series} />
        )}
        
        {actionContent.length > 0 && (
          <ContentCarousel title="Action & Adventure" items={actionContent} />
        )}
        
        {dramaContent.length > 0 && (
          <ContentCarousel title="Drama" items={dramaContent} />
        )}
      </div>
    </div>
  );
}