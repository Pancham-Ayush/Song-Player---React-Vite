import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SkipBack, SkipForward, Play, Pause, Volume2, VolumeX, Music, X } from 'lucide-react';
import Constant from './Constant';

const Player = ({ queue, currentSongIndex, setCurrentSongIndex }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const audioRef = useRef(null);

  const currentSong = queue?.[currentSongIndex] || null;

  const playNext = useCallback(() => {
    if (currentSongIndex < queue.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setIsPlaying(false);
      setCurrentSongIndex(null);
    }
  }, [currentSongIndex, queue.length, setCurrentSongIndex]);

  const playPrevious = useCallback(() => {
    if (currentSongIndex > 0) setCurrentSongIndex(currentSongIndex - 1);
  }, [currentSongIndex, setCurrentSongIndex]);

  // Update audio when song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = `${Constant.Player_URL}/get/${currentSong.id}`;
      audioRef.current.load();
      setProgress(0);
      setDuration(0);

      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentSong.name || currentSong.title,
          artist: currentSong.artist || 'Unknown Artist',
          artwork: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
          ]
        });
      }
    }
  }, [currentSong]);

  // Play/Pause effect
  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
    }
  }, [isPlaying]);

  // Volume/mute effect
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Media session controls
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
      navigator.mediaSession.setActionHandler('nexttrack', playNext);
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(audioRef.current.currentTime - (details.seekOffset || 10), 0);
        }
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.min(audioRef.current.currentTime + (details.seekOffset || 10), audioRef.current.duration);
        }
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (audioRef.current) audioRef.current.currentTime = details.seekTime;
      });
    }
    return () => {
      if ('mediaSession' in navigator) {
        ['play','pause','previoustrack','nexttrack','seekbackward','seekforward','seekto'].forEach(action => {
          navigator.mediaSession.setActionHandler(action, null);
        });
      }
    };
  }, [currentSongIndex, queue?.length, playNext, playPrevious]);

  // Keyboard detection for mobile
  useEffect(() => {
    const updateViewportInset = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      const layoutHeight = window.innerHeight;
      const bottomInset = Math.max(0, layoutHeight - (vv.height + vv.offsetTop));
      document.documentElement.style.setProperty('--player-vv-bottom', `${bottomInset}px`);
      setIsKeyboardOpen(layoutHeight - vv.height > 150);
    };
    updateViewportInset();
    window.visualViewport?.addEventListener('resize', updateViewportInset);
    window.visualViewport?.addEventListener('scroll', updateViewportInset);
    window.addEventListener('orientationchange', updateViewportInset);
    return () => {
      window.visualViewport?.removeEventListener('resize', updateViewportInset);
      window.visualViewport?.removeEventListener('scroll', updateViewportInset);
      window.removeEventListener('orientationchange', updateViewportInset);
    };
  }, []);

  // Track progress
  const handleTimeUpdate = () => {
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    audioRef.current.currentTime = e.target.value;
    setProgress(e.target.value);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
    setIsMuted(false);
  };

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentSongIndex(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentSong) return null;

  const playerUi = (
    <div className={`fixed left-0 right-0 bg-white/80 backdrop-blur-xl text-slate-900 p-2 md:p-4 md:pl-64 border-t border-slate-200 shadow-2xl z-[9999] transition-transform duration-300 ${isKeyboardOpen ? 'translate-y-full' : 'translate-y-0'}`} style={{ bottom: '0px' }}>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={playNext} onLoadedMetadata={handleLoadedMetadata} />
      
      <button onClick={closePlayer} className="absolute top-1 right-1 md:top-2 md:right-2 p-1 md:p-2 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors" aria-label="Close player">
        <X size={16} className="md:w-5 md:h-5" />
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-2 md:gap-4 items-center">
        {/* Now Playing */}
        <div className="col-span-12 md:col-span-4 flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
            <Music size={16} className="md:w-[18px] md:h-[18px]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-slate-500 hidden md:block">Now Playing</p>
            <p className="font-semibold truncate text-sm md:text-base">{currentSong.name || currentSong.title}</p>
            <p className="text-xs md:text-sm text-slate-500 truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls + Progress */}
        <div className="col-span-12 md:col-span-4 flex flex-col items-center">
          <div className="flex items-center space-x-1 md:space-x-4">
            <button onClick={playPrevious} className="text-slate-500 hover:text-slate-900 bg-transparent p-1 md:p-2 rounded-full hover:bg-slate-100"><SkipBack size={18} className="md:w-6 md:h-6" /></button>
            <button onClick={togglePlayPause} className="text-white text-3xl md:text-5xl bg-gradient-to-r from-indigo-500 to-cyan-500 drop-shadow-lg p-1 md:p-2 rounded-full hover:opacity-90">{isPlaying ? <Pause /> : <Play />}</button>
            <button onClick={playNext} className="text-slate-500 hover:text-slate-900 bg-transparent p-1 md:p-2 rounded-full hover:bg-slate-100"><SkipForward size={18} className="md:w-6 md:h-6" /></button>
          </div>
          <div className="w-full flex items-center space-x-1 md:space-x-2 mt-1 md:mt-2">
            <span className="text-xs text-slate-500">{formatTime(progress)}</span>
            <input type="range" min="0" max={duration || 0} value={progress} onChange={handleSeek} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
            <span className="text-xs text-slate-500">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="col-span-12 md:col-span-4 flex justify-start md:justify-end items-center gap-2">
          <button onClick={() => setIsMuted((prev) => !prev)} className="p-1 md:p-2 rounded-full hover:bg-slate-100" aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX size={20} className="md:w-6 md:h-6" /> : <Volume2 size={20} className="md:w-6 md:h-6" />}
          </button>
          <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-20 md:w-28 lg:w-36 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
    </div>
  );

  return createPortal(playerUi, document.body);
};

export default Player;
