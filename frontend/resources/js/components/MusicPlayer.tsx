import React, { useState, useRef, useEffect, useCallback } from 'react';

// Animated Audio Visualizer Component
function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const [bars, setBars] = useState(Array(5).fill(8));
  
  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(5).fill(8));
      return;
    }
    
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 16 + 4));
    }, 150);
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  return (
    <div className="flex items-center space-x-1 h-6">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-1 bg-linear-to-t from-yellow-400 via-yellow-300 to-yellow-200 rounded-full transition-all duration-150 ease-in-out ${
            isPlaying ? 'opacity-100' : 'opacity-60'
          }`}
          style={{
            height: `${height}px`,
            minHeight: '4px'
          }}
        />
      ))}
    </div>
  );
}

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  preview_url?: string | null;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  artists: Array<{ name: string }>;
}

interface MusicPlayerProps {
  isOpen: boolean;
  currentTrack: Track | null;
  playlist: Track[];
  currentIndex: number;
  onClose: () => void;
  onTrackChange: (index: number) => void;
  playlistTitle?: string;
  authUser?: unknown | null;
}

export default function MusicPlayer({
  isOpen,
  currentTrack,
  playlist,
  currentIndex,
  onClose,
  onTrackChange,
  playlistTitle,
  authUser
}: MusicPlayerProps) {
  const user = authUser ?? null;

  // Hooks must be called unconditionally at the top level of the component
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleNext = useCallback(() => {
    if (playlist && currentIndex < playlist.length - 1) {
      onTrackChange(currentIndex + 1);
    }
  }, [playlist, currentIndex, onTrackChange]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      onTrackChange(currentIndex - 1);
    }
  }, [currentIndex, onTrackChange]);

  // Initialize audio when track changes (prefer local file, fallback to preview_url)
  useEffect(() => {
    if (!user || !currentTrack || !isOpen) {
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    const audio = new Audio();
    audioRef.current = audio;

    const setupEventListeners = () => {
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      audio.addEventListener('ended', () => {
        handleNext();
      });
      audio.addEventListener('canplaythrough', () => {
        // Auto-play when audio is ready
        audio.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            setIsPlaying(false);
          });
        }, { once: true });
      };

      const tryPreviewUrl = () => {
        if (currentTrack.preview_url) {
          audio.src = currentTrack.preview_url;
          audio.load();
        } else {
          // No audio available — skip to next track immediately
          console.log(`⏭️ Skipping track "${currentTrack.name}" - no audio URL available`);
          setIsPlaying(false);
          handleNext();
        }
      };

      // Helper function to determine artist folder
      const getArtistFolder = (artistName: string): string => {
        const name = artistName.toLowerCase();
        if (name.includes('sb19') || name === 'sb19') return 'sb19';
        if (name.includes('pablo') || name === 'pablo') return 'pablo';
        if (name.includes('josh') || name === 'josh') return 'josh';
        if (name.includes('justin') || name === 'justin') return 'justin';
        if (name.includes('stell') || name === 'stell') return 'stell';
        if (name.includes('felip') || name === 'felip') return 'felip';
        return 'sb19'; // default fallback
      };

      // Try multiple local audio paths
      const tryLocalAudio = async (urlsToTry: string[], index = 0): Promise<void> => {
        if (index >= urlsToTry.length) {
          tryPreviewUrl();
          return;
        }

        const currentUrl = urlsToTry[index];
        const onSuccess = () => {
          audio.removeEventListener('error', onAudioError);
          audio.removeEventListener('canplaythrough', onSuccess);
        };

        const onAudioError = () => {
          audio.removeEventListener('error', onAudioError);
          audio.removeEventListener('canplaythrough', onSuccess);
          tryLocalAudio(urlsToTry, index + 1);
        };

        audio.addEventListener('error', onAudioError);
        audio.addEventListener('canplaythrough', onSuccess);
        audio.src = currentUrl;
        audio.load();
      };

      // Setup event listeners
      setupEventListeners();

      // Build list of possible local audio URLs to try
      const possibleUrls: string[] = [];
      
      // Check if this is SB19 group content (popular songs or all songs)
      const isSB19GroupContent = playlistTitle?.includes("Popular SB19") || 
                                playlistTitle?.includes("All SB19") ||
                                playlistTitle?.includes("SB19");
      
      if (isSB19GroupContent) {
        // For SB19 group content, try sb19 folder first
        possibleUrls.push(`/audio/sb19/${currentTrack.id}.mp3`);
        console.log(`🎵 SB19 group content detected. Trying SB19 folder first for: ${currentTrack.name}`);
      } else {
        // For member content, try artist-specific folder first
        if (currentTrack.artists && currentTrack.artists.length > 0) {
          const primaryArtist = currentTrack.artists[0].name;
          const artistFolder = getArtistFolder(primaryArtist);
          possibleUrls.push(`/audio/${artistFolder}/${currentTrack.id}.mp3`);
          
          // If primary artist is not SB19, also try sb19 folder as fallback
          if (artistFolder !== 'sb19') {
            possibleUrls.push(`/audio/sb19/${currentTrack.id}.mp3`);
          }
        }
      }
      
      // Try remaining artist folders as fallback (excluding already tried ones)
      const allFolders = ['sb19', 'pablo', 'josh', 'justin', 'stell', 'felip'];
      allFolders.forEach(folder => {
        const url = `/audio/${folder}/${currentTrack.id}.mp3`;
        if (!possibleUrls.includes(url)) {
          possibleUrls.push(url);
        }
      });

      // Try flat structure as final fallback
      possibleUrls.push(`/audio/${currentTrack.id}.mp3`);

      // Start trying local audio files
      tryLocalAudio(possibleUrls);

      return () => {
        if (audio) {
          audio.pause();
          audio.removeEventListener('loadedmetadata', () => {});
          audio.removeEventListener('timeupdate', () => {});
          audio.removeEventListener('ended', () => {});
          audio.removeEventListener('canplaythrough', () => {});
        }
      };
  }, [currentTrack, isOpen, handleNext, playlistTitle, user]);
  
  // Separate useEffect for volume changes to avoid re-initializing audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Cleanup when component unmounts or closes
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) {
      alert("No audio available for this track!");
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Play failed:', err);
        setIsPlaying(false);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  if (!isOpen || !currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
      {/* Full Player Modal */}
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-yellow-400 font-semibold">
            🎵 {playlistTitle}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* Main Player */}
        <div className="flex items-center space-x-4">
          {/* Album Art */}
          <div className="flex-shrink-0">
            {currentTrack.album?.images?.[0] ? (
              <img
                src={currentTrack.album.images[0].url}
                alt={currentTrack.album.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                🎵
              </div>
            )}
          </div>

          {/* Track Info with Visualizer */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center space-x-3">
              <div className="flex-grow">
                <h3 className="text-white font-medium truncate">{currentTrack.name}</h3>
                <p className="text-gray-400 text-sm truncate">
                  {currentTrack.artists.map(a => a.name).join(', ')}
                </p>
                <p className="text-gray-500 text-xs">{currentTrack.album.name}</p>
              </div>
              <AudioVisualizer isPlaying={isPlaying} />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Previous */}
            <button
              onClick={handlePrevious}
              className="text-gray-400 hover:text-white text-xl"
              disabled={playlist.length <= 1}
            >
              ⏮
            </button>

            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-yellow-300 transition-colors"
            >
              {isPlaying ? '⏸' : '▶️'}
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white text-xl"
              disabled={playlist.length <= 1}
            >
              ⏭
            </button>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-gray-400 text-sm">🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
              className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-xs w-10">
              {formatTime(currentTime)}
            </span>
            <div className="flex-grow">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #facc15 0%, #facc15 ${progress}%, #374151 ${progress}%, #374151 100%)`
                }}
              />
            </div>
            <span className="text-gray-400 text-xs w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Playlist Info */}
        <div className="mt-2 text-center">
          <span className="text-gray-500 text-xs">
            {currentIndex + 1} of {playlist.length} tracks
          </span>
        </div>
      </div>
    </div>
  );
}