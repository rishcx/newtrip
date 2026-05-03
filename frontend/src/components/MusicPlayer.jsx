import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

const YOUTUBE_VIDEO_ID = 'jSReLIp5Zxc';

const MusicPlayer = () => {
  const [volume, setVolume] = useState(30);
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const playerRef = useRef(null);
  const apiLoaded = useRef(false);
  const lastVolumeRef = useRef(30);
  const collapseTimerRef = useRef(null);

  const initPlayer = useCallback(() => {
    if (playerRef.current) return;

    playerRef.current = new window.YT.Player('yt-music-player', {
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onReady: () => {
          playerRef.current.setVolume(volume);
          setPlayerReady(true);
          setLoading(false);
          playerRef.current.playVideo();
          setMuted(false);
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            playerRef.current.seekTo(0);
            playerRef.current.playVideo();
          }
        },
      },
    });
  }, [volume]);

  const loadYouTubeAPI = useCallback(() => {
    if (apiLoaded.current) return;
    apiLoaded.current = true;
    setLoading(true);

    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };
  }, [initPlayer]);

  useEffect(() => {
    if (!playerReady || !playerRef.current) return;
    playerRef.current.setVolume(volume);
    if (volume === 0 && !muted) {
      playerRef.current.pauseVideo();
      setMuted(true);
    } else if (volume > 0 && muted) {
      playerRef.current.playVideo();
      setMuted(false);
    }
  }, [volume, playerReady, muted]);

  useEffect(() => () => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
  }, []);

  const handleSlider = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (v > 0) lastVolumeRef.current = v;
    if (!apiLoaded.current && v > 0) loadYouTubeAPI();
  };

  const toggleMute = () => {
    if (!apiLoaded.current) {
      loadYouTubeAPI();
      setExpanded(true);
      return;
    }
    if (muted) {
      const restore = lastVolumeRef.current || 30;
      setVolume(restore);
    } else {
      lastVolumeRef.current = volume || 30;
      setVolume(0);
    }
  };

  const onIconClick = () => {
    setExpanded((e) => !e);
    toggleMute();
  };

  const expand = () => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    setExpanded(true);
  };
  const scheduleCollapse = () => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = setTimeout(() => setExpanded(false), 600);
  };

  const Icon = loading
    ? null
    : muted || volume === 0
    ? VolumeX
    : volume < 50
    ? Volume1
    : Volume2;

  return (
    <>
      <div style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1, overflow: 'hidden', pointerEvents: 'none' }}>
        <div id="yt-music-player" />
      </div>

      <div
        onMouseEnter={expand}
        onMouseLeave={scheduleCollapse}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-end"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        <div
          className={`flex items-center gap-2 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden transition-[width,padding] duration-300 ease-out`}
          style={{
            width: expanded ? 156 : 40,
            padding: expanded ? '6px 10px 6px 6px' : '6px',
          }}
        >
          <button
            onClick={onIconClick}
            className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            title={muted ? 'Unmute' : 'Mute'}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon className={`w-4 h-4 ${muted || volume === 0 ? 'text-gray-400' : 'text-white'}`} />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleSlider}
            aria-label="Volume"
            tabIndex={expanded ? 0 : -1}
            className="music-volume-slider flex-1"
            style={{
              opacity: expanded ? 1 : 0,
              pointerEvents: expanded ? 'auto' : 'none',
              transition: 'opacity 200ms ease',
              background: `linear-gradient(to right, #ffffff 0%, #ffffff ${volume}%, rgba(255,255,255,0.18) ${volume}%, rgba(255,255,255,0.18) 100%)`,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
