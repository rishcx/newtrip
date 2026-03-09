import React, { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const nodesRef = useRef(null);

  const startAmbient = useCallback(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.06;
    master.connect(ctx.destination);

    // Reverb-like effect using delay
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.4;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.3;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 1200;
    delay.connect(delayFilter);
    delayFilter.connect(feedback);
    feedback.connect(delay);
    delay.connect(master);

    // Dreamy pad chords - C major 7 voicing
    const chordNotes = [
      130.81, // C3
      164.81, // E3
      196.00, // G3
      246.94, // B3
      261.63, // C4
      329.63, // E4
    ];

    const oscillators = chordNotes.map((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.value = freq;
      oscGain.gain.value = 0.08 + (i * 0.01);

      filter.type = 'lowpass';
      filter.frequency.value = 800 + (i * 100);
      filter.Q.value = 1;

      // Slow LFO for gentle movement
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + (i * 0.02);
      lfoGain.gain.value = freq * 0.008;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // Amplitude LFO for breathing effect
      const ampLfo = ctx.createOscillator();
      const ampLfoGain = ctx.createGain();
      ampLfo.type = 'sine';
      ampLfo.frequency.value = 0.03 + (i * 0.01);
      ampLfoGain.gain.value = 0.03;
      ampLfo.connect(ampLfoGain);
      ampLfoGain.connect(oscGain.gain);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(master);
      oscGain.connect(delay);

      lfo.start();
      ampLfo.start();
      osc.start();

      return { osc, lfo, ampLfo };
    });

    // Sub bass drone
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.value = 65.41; // C2
    subGain.gain.value = 0.04;
    const subLfo = ctx.createOscillator();
    const subLfoGain = ctx.createGain();
    subLfo.frequency.value = 0.02;
    subLfoGain.gain.value = 1;
    subLfo.connect(subLfoGain);
    subLfoGain.connect(sub.frequency);
    sub.connect(subGain);
    subGain.connect(master);
    subLfo.start();
    sub.start();

    nodesRef.current = { oscillators, sub, subLfo, master, ctx };
  }, []);

  const stopAmbient = useCallback(() => {
    if (nodesRef.current) {
      const { oscillators, sub, subLfo, master, ctx } = nodesRef.current;
      // Fade out
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => {
        oscillators.forEach(({ osc, lfo, ampLfo }) => {
          osc.stop();
          lfo.stop();
          ampLfo.stop();
        });
        sub.stop();
        subLfo.stop();
        ctx.close();
        nodesRef.current = null;
        audioCtxRef.current = null;
      }, 1100);
    }
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      stopAmbient();
    } else {
      startAmbient();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleMusic}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full border transition-all duration-500 group ${
        isPlaying
          ? 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
          : 'bg-zinc-900/80 border-zinc-700 hover:border-cyan-500/30'
      } backdrop-blur-sm`}
      title={isPlaying ? 'Mute ambient vibes' : 'Play ambient vibes'}
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
  );
};

export default MusicPlayer;
