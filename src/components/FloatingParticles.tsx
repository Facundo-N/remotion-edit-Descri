import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, random } from 'remotion';

const BRAND_ORANGE = '#fbab4a';
const BRAND_BROWN = '#2c210c';

interface Particle {
  id: number;
  x: number; // percentage 0-100
  startY: number; // starting Y percentage
  size: number;
  speed: number; // frames to travel full height
  opacity: number;
  delay: number; // frame delay before appearing
  rotate: number; // initial rotation
  rotateSpeed: number; // degrees per frame
  type: 'bean' | 'dot' | 'ring';
}

interface FloatingParticlesProps {
  count?: number;
  seed?: number;
}

const CoffeeBeanSVG: React.FC<{ size: number; color: string; opacity: number }> = ({ size, color, opacity }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 30 42" style={{ opacity }}>
    <ellipse cx="15" cy="21" rx="12" ry="18" fill={color} />
    <path
      d="M15 3 Q20 21 15 39"
      stroke="rgba(0,0,0,0.3)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 18,
  seed = 42,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: random(`x-${seed}-${i}`) * 100,
      startY: random(`sy-${seed}-${i}`) * 100 + 100, // start below viewport
      size: 16 + random(`s-${seed}-${i}`) * 28,
      speed: 300 + random(`sp-${seed}-${i}`) * 400,
      opacity: 0.1 + random(`o-${seed}-${i}`) * 0.25,
      delay: random(`d-${seed}-${i}`) * 200,
      rotate: random(`r-${seed}-${i}`) * 360,
      rotateSpeed: (random(`rs-${seed}-${i}`) - 0.5) * 0.4,
      type: i % 3 === 0 ? 'bean' : i % 3 === 1 ? 'dot' : 'ring',
    }));
  }, [count, seed]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 5 }}>
      {particles.map((p) => {
        const localFrame = frame - p.delay;
        if (localFrame < 0) return null;

        // Loop particles vertically
        const progress = (localFrame % p.speed) / p.speed;
        const yPx = height + p.size - progress * (height + p.size * 2);
        const xPx = (p.x / 100) * width;
        const rotation = p.rotate + localFrame * p.rotateSpeed;

        // Fade in/out at edges
        const edgeFade = interpolate(progress, [0, 0.05, 0.9, 1], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const color = p.id % 2 === 0 ? BRAND_BROWN : BRAND_ORANGE;

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${xPx}px`,
              top: `${yPx}px`,
              transform: `rotate(${rotation}deg)`,
              opacity: p.opacity * edgeFade,
            }}
          >
            {p.type === 'bean' && (
              <CoffeeBeanSVG size={p.size} color={color} opacity={1} />
            )}
            {p.type === 'dot' && (
              <div style={{
                width: `${p.size * 0.5}px`,
                height: `${p.size * 0.5}px`,
                borderRadius: '50%',
                background: color,
              }} />
            )}
            {p.type === 'ring' && (
              <div style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                border: `2px solid ${color}`,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};
