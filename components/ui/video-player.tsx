'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Subtitle } from '@/lib/types';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  subtitles?: Subtitle[];
  className?: string;
}

export function VideoPlayer({ src, poster, subtitles = [], className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('');
  const [qualities, setQualities] = useState<string[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>('auto');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels.map((level, index) => 
          `${level.height}p (${Math.round(level.bitrate / 1000)}k)`
        );
        setQualities(['Auto', ...levels]);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native support
      video.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !isMuted;
    video.muted = newMuted;
    setIsMuted(newMuted);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime += seconds;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={cn(
        'relative bg-black rounded-lg overflow-hidden group',
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full object-cover"
        onClick={togglePlay}
      >
        {subtitles.map((subtitle) => (
          <track
            key={subtitle.id}
            kind="subtitles"
            src={subtitle.url}
            srcLang={subtitle.lang_code}
            label={subtitle.label}
            default={subtitle.lang_code === 'ar'}
          />
        ))}
      </video>

      {/* Controls overlay */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300',
        showControls ? 'opacity-100' : 'opacity-0'
      )}>
        {/* Play/Pause button center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="icon"
            variant="ghost"
            className="h-16 w-16 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </Button>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Progress bar */}
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" onClick={togglePlay}>
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button size="icon" variant="ghost" onClick={() => skip(-10)}>
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button size="icon" variant="ghost" onClick={() => skip(10)}>
                <SkipForward className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={toggleMute}>
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              <span className="text-sm text-white/80">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Subtitle selector */}
              {subtitles.length > 0 && (
                <Select value={selectedSubtitle} onValueChange={setSelectedSubtitle}>
                  <SelectTrigger className="w-32 h-8 bg-black/50 text-white border-white/20">
                    <SelectValue placeholder="Subtitles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Off</SelectItem>
                    {subtitles.map((subtitle) => (
                      <SelectItem key={subtitle.id} value={subtitle.id}>
                        {subtitle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Quality selector */}
              {qualities.length > 0 && (
                <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                  <SelectTrigger className="w-32 h-8 bg-black/50 text-white border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qualities.map((quality, index) => (
                      <SelectItem key={index} value={index === 0 ? 'auto' : index.toString()}>
                        {quality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button size="icon" variant="ghost" onClick={toggleFullscreen}>
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}