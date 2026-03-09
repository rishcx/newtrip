import React from 'react';

const MarqueeStrip = ({
  messages = [
    'PSYCHEDELIC STREETWEAR',
    'BEND REALITY',
    'NEON DREAMS',
    'LIQUID SWIRLS',
    'COSMIC ENERGY',
    'TRIPPY VIBES ONLY',
    'LIMITED DROPS',
    'WEARABLE ART',
    'FREE YOUR MIND',
    'DRIP OR DROWN'
  ],
  speed = 30,
  direction = 'left',
  className = ''
}) => {
  const content = messages.map((msg, i) => (
    <span key={i} className="inline-flex items-center">
      <span className="text-sm sm:text-base font-bold tracking-widest uppercase whitespace-nowrap">
        {msg}
      </span>
      <span className="mx-4 sm:mx-6 text-cyan-400 text-lg">*</span>
    </span>
  ));

  return (
    <div className={`overflow-hidden py-3 sm:py-4 select-none ${className}`}>
      <div
        className="marquee-track flex"
        style={{
          '--speed': `${speed}s`,
          '--direction': direction === 'left' ? 'normal' : 'reverse'
        }}
      >
        <div className="marquee-content flex shrink-0">
          {content}
        </div>
        <div className="marquee-content flex shrink-0" aria-hidden="true">
          {content}
        </div>
      </div>
    </div>
  );
};

export default MarqueeStrip;
