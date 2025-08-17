'use client';

import { useQuery } from '@tanstack/react-query';
import { VideoPlayer } from '@/components/ui/video-player';
import { ContentCard } from '@/components/ui/content-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Users } from 'lucide-react';
import { Movie, Series } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

async function fetchContent(id: string) {
  const [movieRes, seriesRes] = await Promise.all([
    fetch(`/api/movies/${id}`),
    fetch(`/api/series/${id}`),
  ]);

  if (movieRes.ok) {
    const data = await movieRes.json();
    return { item: data.data as Movie, type: 'movie' };
  }

  if (seriesRes.ok) {
    const data = await seriesRes.json();
    return { item: data.data as Series, type: 'series' };
  }

  throw new Error('Content not found');
}

async function fetchSimilarContent() {
  const [moviesRes, seriesRes] = await Promise.all([
    fetch('/api/movies?published=true'),
    fetch('/api/series?published=true'),
  ]);

  const [moviesData, seriesData] = await Promise.all([
    moviesRes.json(),
    seriesRes.json(),
  ]);

  return [...(moviesData.data || []), ...(seriesData.data || [])];
}

export default function WatchPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['content', params.id],
    queryFn: () => fetchContent(params.id),
  });

  const { data: similarContent } = useQuery({
    queryKey: ['similar-content'],
    queryFn: fetchSimilarContent,
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
          <h2 className="text-2xl font-bold text-white mb-4">Content not found</h2>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { item, type } = data;
  
  if (!item.source?.master_url) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No video source available</h2>
          <Link href={`/title/${item.id}`}>
            <Button>View Details</Button>
          </Link>
        </div>
      </div>
    );
  }

  const similar = similarContent
    ?.filter(content => content.id !== item.id && content.published)
    ?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 text-white hover:bg-black/70 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Video Player */}
      <div className="aspect-video">
        <VideoPlayer
          src={item.source.master_url}
          poster={item.backdrop_url || item.poster_url}
          subtitles={item.subtitles}
          className="w-full h-full"
        />
      </div>

      {/* Content Info */}
      <div className="px-4 md:px-8 lg:px-16 py-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content info */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={type === 'movie' ? 'bg-blue-600' : 'bg-red-600'}>
                  {type === 'movie' ? 'Movie' : 'Series'}
                </Badge>
                {item.year && (
                  <Badge variant="outline" className="border-gray-500 text-gray-300">
                    {item.year}
                  </Badge>
                )}
                {item.source && (
                  <Badge variant="secondary" className="bg-green-600">
                    HD
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {item.title}
              </h1>

              {item.overview && (
                <p className="text-lg text-gray-300 leading-relaxed">
                  {item.overview}
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-800">
              {item.year && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{item.year}</span>
                </div>
              )}

              {type === 'movie' && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Movie</span>
                </div>
              )}

              {type === 'series' && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {(item as Series).seasons.length} Season{(item as Series).seasons.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {item.people && item.people.length > 0 && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Cast</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {item.genres && item.genres.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {item.genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="border-gray-600 text-gray-300">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Cast */}
            {item.people && item.people.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Cast & Crew</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {item.people.slice(0, 6).map((person) => (
                    <div key={person.id} className="text-gray-300">
                      <p className="font-medium">{person.name}</p>
                      {person.role && (
                        <p className="text-sm text-gray-500 capitalize">{person.role}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Poster */}
            {item.poster_url && (
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={item.poster_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Additional info for series */}
            {type === 'series' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Seasons</h3>
                <div className="space-y-2">
                  {(item as Series).seasons.map((season) => (
                    <div key={season.id} className="flex justify-between text-gray-300">
                      <span>Season {season.number}</span>
                      <span className="text-gray-500">
                        {season.episodes.length} episode{season.episodes.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar content */}
        {similar.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-gray-800">
            <h2 className="text-2xl font-bold text-white">More Like This</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {similar.map((content) => (
                <ContentCard key={content.id} item={content} size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}