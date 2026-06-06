import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Poppins';

const { fontFamily: sansFont } = loadMontserrat();

const BRAND_YELLOW = '#f7edb0';
const BRAND_ORANGE = '#fbab4a';
const BRAND_BROWN = '#2c210c';

interface ViewfinderProps {
  /** Size of the corner brackets in px */
  cornerSize?: number;
  /** Thickness of the bracket lines */
  thickness?: number;
  padding?: number;
  color?: string;
  appearAt?: number;
}

/**
 * Cinematic viewfinder / camera corners that animate in
 */
export const Viewfinder: React.FC<ViewfinderProps> = ({
  cornerSize = 120,
  thickness = 8,
  padding = 60,
  color = BRAND_ORANGE,
  appearAt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const size = interpolate(progress, [0, 1], [0, cornerSize]);
  const opacity = progress;

  const corners = [
    { top: padding, left: padding, rotate: '0deg' },
    { top: padding, right: padding, rotate: '90deg' },
    { bottom: padding, left: padding, rotate: '-90deg' },
    { bottom: padding, right: padding, rotate: '180deg' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 90, opacity }}>
      {corners.map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            ...pos,
            transform: `rotate(${pos.rotate})`,
          }}
        >
          {/* Horizontal */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%',
            height: `${thickness}px`,
            background: color,
            boxShadow: `0 0 8px ${color}88`,
          }} />
          {/* Vertical */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0,
            width: `${thickness}px`,
            height: '100%',
            background: color,
            boxShadow: `0 0 8px ${color}88`,
          }} />
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// STAMP BADGE: Circular animated stamp
// ─────────────────────────────────────────────────────
interface StampBadgeProps {
  topText: string;
  centerText: string;
  bottomText?: string;
  appearAt?: number;
  x?: number | string;
  y?: number | string;
  size?: number;
  rotation?: number;
}

export const StampBadge: React.FC<StampBadgeProps> = ({
  topText,
  centerText,
  bottomText,
  appearAt = 0,
  x = '80%',
  y = '15%',
  size = 200,
  rotation = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 10, stiffness: 160, mass: 0.8 },
  });

  const scale = interpolate(progress, [0, 1], [0, 1]);
  const rotate = interpolate(progress, [0, 1], [-30 + rotation, rotation]);

  if (frame < appearAt) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        transformOrigin: 'center center',
        width: `${size}px`,
        height: `${size}px`,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200">
        {/* Outer circle */}
        <circle cx="100" cy="100" r="95" fill="none" stroke={BRAND_ORANGE} strokeWidth="3" strokeDasharray="6 4" />
        {/* Inner circle */}
        <circle cx="100" cy="100" r="78" fill={BRAND_BROWN} fillOpacity="0.88" stroke={BRAND_YELLOW} strokeWidth="1.5" />
        {/* Star dots */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <circle
            key={i}
            cx={100 + 87 * Math.cos((deg * Math.PI) / 180)}
            cy={100 + 87 * Math.sin((deg * Math.PI) / 180)}
            r="3"
            fill={BRAND_ORANGE}
          />
        ))}

        {/* Top arc text */}
        <path id="topArc" d="M 20,100 A 80,80 0 0,1 180,100" fill="none" />
        <text fill={BRAND_YELLOW} fontSize="14" fontFamily={sansFont} fontWeight="600" letterSpacing="3">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">
            {topText}
          </textPath>
        </text>

        {/* Bottom arc text */}
        <path id="bottomArc" d="M 20,100 A 80,80 0 0,0 180,100" fill="none" />
        <text fill={BRAND_YELLOW} fontSize="12" fontFamily={sansFont} letterSpacing="2">
          <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
            {bottomText ?? '★ ★ ★'}
          </textPath>
        </text>

        {/* Center text */}
        <text
          x="100" y="95"
          textAnchor="middle"
          fill={BRAND_ORANGE}
          fontSize="22"
          fontFamily={sansFont}
          fontWeight="800"
          letterSpacing="1"
        >
          {centerText.split(' ')[0]}
        </text>
        {centerText.split(' ')[1] && (
          <text
            x="100" y="120"
            textAnchor="middle"
            fill={BRAND_YELLOW}
            fontSize="18"
            fontFamily={sansFont}
            fontWeight="600"
          >
            {centerText.split(' ').slice(1).join(' ')}
          </text>
        )}
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────────────────
// FILM GRAIN OVERLAY: subtle cinematic texture
// ─────────────────────────────────────────────────────
export const FilmGrain: React.FC<{ intensity?: number }> = ({ intensity = 0.04 }) => {
  const frame = useCurrentFrame();

  // Shift the grain each frame so it animates
  const shift = (frame * 127) % 1000;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 999,
        pointerEvents: 'none',
        opacity: intensity,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='1'/></svg>")`,
        backgroundPosition: `${shift}px ${shift * 0.7}px`,
        backgroundSize: '200px 200px',
      }}
    />
  );
};
