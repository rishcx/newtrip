import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const YOUTUBE_VIDEO_ID = 'jSReLIp5Zxc';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    // Load the API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  const initPlayer = useCallback(() => {
    if (playerRef.current) return;

    playerRef.current = new window.YT.Player('yt-music-player', {
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID, // Required for loop to work
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onReady: () => {
          playerRef.current.setVolume(30);
          setPlayerReady(true);
        },
        onStateChange: (event) => {
          // If video ends and loop somehow fails, restart
          if (event.data === window.YT.PlayerState.ENDED) {
            playerRef.current.seekTo(0);
            playerRef.current.playVideo();
          }
        },
      },
    });
  }, []);

  const toggleMusic = () => {
    if (!playerRef.current || !playerReady) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* Hidden YouTube player */}
      <div style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1, overflow: 'hidden', pointerEvents: 'none' }}>
        <div id="yt-music-player" ref={containerRef} />
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleMusic}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full border transition-all duration-500 group ${
          isPlaying
            ? 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            : 'bg-zinc-900/80 border-zinc-700 hover:border-cyan-500/30'
        } backdrop-blur-sm`}
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-cyan-400 animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
        )}
        {isPlaying && (
          <span className="absolute -top-1 -right-1 w-3 h-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        )}
      </button>
    </>
  );
};

export default MusicPlayer;
