import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

export const BRAND_YELLOW = '#f7edb0';
const BRAND_ORANGE = '#fbab4a';
const BRAND_BROWN = '#2c210c';
const LIGHT_YELLOW = '#fff9db';
const LIGHT_BROWN = '#8b5e34';

export const CoffeeLiquidBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Create a wavy path for the liquid
  const createWavePath = (offset: number, amplitude: number, frequency: number, yBase: number, fromBottom: boolean = true) => {
    const points = [];
    const resolution = 25;
    for (let i = 0; i <= resolution; i++) {
      const x = (i / resolution) * width;
      const phase = (i / resolution) * Math.PI * 2 * frequency;
      const y = yBase + Math.sin(phase + (frame * 0.04) + offset) * amplitude;
      points.push(`${x},${y}`);
    }

    const edgeY = fromBottom ? height : 0;
    return `M 0,${edgeY} L 0,${yBase} ${points.map(p => `L ${p}`).join(' ')} L ${width},${edgeY} Z`;
  };

  // Morphing blobs for a more organic "liquid" feel
  const renderBlob = (color: string, opacity: number, scale: number, moveOffset: number, yPos: string) => {
    const movement = Math.sin(frame * 0.015 + moveOffset) * 60;
    return (
      <div
        style={{
          position: 'absolute',
          width: '130%',
          height: '60%', // Flatter blobs to avoid filling the middle
          left: '-15%',
          top: yPos,
          backgroundColor: color,
          opacity,
          borderRadius: '50%',
          transform: `translate(${movement}px, ${Math.cos(frame * 0.012 + moveOffset) * 40}px) rotate(${frame * 0.15 + moveOffset}deg) scale(${scale})`,
          filter: 'blur(100px)',
        }}
      />
    );
  };

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: BRAND_BROWN }}>
      {/* Background Blobs - Pushed to edges to keep middle dark */}
      {renderBlob(LIGHT_BROWN, 0.12, 1.5, 0, '-20%')} // Top edge
      {renderBlob(BRAND_ORANGE, 0.1, 1.3, Math.PI * 0.4, '60%')} // Bottom edge
      {renderBlob(LIGHT_YELLOW, 0.05, 1.2, Math.PI * 0.8, '-10%')} // Top edge

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="gradBottom1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={LIGHT_BROWN} stopOpacity="0.4" />
            <stop offset="100%" stopColor={BRAND_BROWN} stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="gradBottom2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={LIGHT_YELLOW} stopOpacity="0.3" />
            <stop offset="100%" stopColor={LIGHT_BROWN} stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="gradTop" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={LIGHT_BROWN} stopOpacity="0.3" />
            <stop offset="100%" stopColor={LIGHT_YELLOW} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* BOTTOM WAVES - Pushed further down */}
        <path
          d={createWavePath(0, 50, 1.1, height * 0.75)}
          fill="url(#gradBottom1)"
        />
        <path
          d={createWavePath(Math.PI / 3, 40, 1.6, height * 0.82)}
          fill="url(#gradBottom2)"
        />
        <path
          d={createWavePath(Math.PI, 60, 0.9, height * 0.88)}
          fill={BRAND_BROWN}
          opacity="0.8"
        />

        {/* TOP WAVES - Pushed further up */}
        <path
          d={createWavePath(Math.PI * 0.5, 40, 1.3, height * 0.15, false)}
          fill="url(#gradTop)"
          opacity="0.35"
        />
        <path
          d={createWavePath(0, 30, 1.8, height * 0.08, false)}
          fill={LIGHT_YELLOW}
          opacity="0.12"
        />
      </svg>

      {/* Decorative Coffee Bubbles - Also kept more towards edges */}
      {[...Array(10)].map((_, i) => {
        const bubbleFrame = (frame + i * 25) % 300;
        const bubbleY = interpolate(bubbleFrame, [0, 300], [height + 200, -200]);
        // Only show bubbles if they are near top or bottom
        const bubbleOpacity = interpolate(bubbleY, [0, height * 0.2, height * 0.8, height], [0.15, 0.02, 0.02, 0.15], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        });

        const bubbleX = (i * width) / 9 + Math.sin(frame * 0.02 + i) * 100;
        const bubbleSize = 10 + (i % 5) * 18;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: bubbleX,
              top: bubbleY,
              width: bubbleSize,
              height: bubbleSize,
              backgroundColor: i % 2 === 0 ? LIGHT_YELLOW : BRAND_ORANGE,
              opacity: bubbleOpacity,
              borderRadius: '50%',
              filter: 'blur(8px)',
              boxShadow: `0 0 25px ${i % 2 === 0 ? LIGHT_YELLOW : BRAND_ORANGE}33`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
