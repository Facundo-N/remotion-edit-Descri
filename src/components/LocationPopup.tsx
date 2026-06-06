import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadBevan } from '@remotion/google-fonts/Bevan';

const { fontFamily: sansFont } = loadMontserrat();
const { fontFamily: titleFont } = loadBevan();

const BRAND_YELLOW = '#f7edb0';
const BRAND_ORANGE = '#fbab4a';
const BRAND_BROWN = '#2c210c';

// ─── Star Rating SVG ────────────────────────────────────────────────────────
const StarIcon: React.FC<{ filled?: boolean; size?: number }> = ({ filled = true, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#fbab4a' : 'none'} stroke="#fbab4a" strokeWidth="1.5">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

// ─── Location Pin Emoji SVG ─────────────────────────────────────────────────
const LocationPin: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {/* Pin body */}
    <path
      d="M32 4C21.5 4 13 12.5 13 23C13 36 32 60 32 60C32 60 51 36 51 23C51 12.5 42.5 4 32 4Z"
      fill="#EA4335"
      stroke="#C62828"
      strokeWidth="1.5"
    />
    {/* Inner circle */}
    <circle cx="32" cy="23" r="9" fill="white" opacity="0.95" />
    {/* Coffee cup icon inside pin */}
    <text x="32" y="28" textAnchor="middle" fontSize="13" fill="#2c210c">☕</text>
  </svg>
);

// ─── Google Maps Style Stars ─────────────────────────────────────────────────
const StarRating: React.FC<{ rating: number; count: string }> = ({ rating, count }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{
        fontFamily: sansFont,
        fontSize: '28px',
        fontWeight: '700',
        color: '#202124',
        lineHeight: 1,
      }}>
        {rating.toFixed(1)}
      </span>
      <div style={{ display: 'flex', gap: '2px' }}>
        {stars.map((s) => (
          <StarIcon key={s} filled={s <= Math.round(rating)} size={24} />
        ))}
      </div>
      <span style={{
        fontFamily: sansFont,
        fontSize: '22px',
        color: '#70757a',
        fontWeight: '400',
      }}>
        ({count})
      </span>
    </div>
  );
};

// ─── Animated Pulse Ring for location pin ───────────────────────────────────
const PulseRing: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = (frame % 60) / 60;
  const ringScale = interpolate(pulse, [0, 1], [0.8, 1.6]);
  const ringOpacity = interpolate(pulse, [0, 0.6, 1], [0.6, 0.2, 0]);

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%) scale(${ringScale})`,
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      border: '3px solid #EA4335',
      opacity: ringOpacity,
      pointerEvents: 'none',
    }} />
  );
};

// ─── Main Popup Component ────────────────────────────────────────────────────
export const LocationPopup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── ENTRY: Spring bounce from bottom ──────────────────────────────────────
  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });

  // ── EXIT: Slide down smoothly ──────────────────────────────────────────────
  const exitStart = durationInFrames - 40;
  const exitProgress = interpolate(frame, [exitStart, durationInFrames - 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 1, 1),
  });

  const translateY = interpolate(entrySpring, [0, 1], [600, 0]) + interpolate(exitProgress, [0, 1], [0, 600]);
  const opacity = interpolate(entrySpring, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }) *
    interpolate(exitProgress, [0, 0.3], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ── Photo zoom-in subtle animation ────────────────────────────────────────
  const photoScale = interpolate(frame, [0, durationInFrames], [1.0, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Close button appear ────────────────────────────────────────────────────
  const closeOpacity = interpolate(frame, [18, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Location pin bounce ────────────────────────────────────────────────────
  const pinBounce = spring({
    frame: frame - 20,
    fps,
    config: { damping: 8, stiffness: 180, mass: 0.7 },
  });
  const pinScale = interpolate(pinBounce, [0, 1], [0, 1]);

  // ── "Nuevo lugar" label fade in ────────────────────────────────────────────
  const labelOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Rating reveal ──────────────────────────────────────────────────────────
  const ratingOpacity = interpolate(frame, [40, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Address line reveal ────────────────────────────────────────────────────
  const addressOpacity = interpolate(frame, [55, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '80px',
      }}
    >
      {/* ── THE POPUP CARD ─────────────────────────────────────────────────── */}
      <div
        style={{
          width: '820px',
          borderRadius: '32px',
          background: '#ffffff',
          boxShadow: '0 24px 80px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          transform: `translateY(${translateY}px)`,
          opacity,
          position: 'relative',
        }}
      >
        {/* ── PHOTO SECTION ──────────────────────────────────────────────────── */}
        <div
          style={{
            width: '100%',
            height: '340px',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#e8d5b0',
          }}
        >
          {/* Collage photo as background */}
          <Img
            src={staticFile('assets/collage_v2/imagen central.jpeg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${photoScale})`,
              transformOrigin: 'center center',
            }}
          />

          {/* Gradient overlay at bottom of photo */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)',
          }} />

          {/* ── CLOSE BUTTON (top right) ─────────────────────────────────── */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            opacity: closeOpacity,
          }}>
            <span style={{ fontSize: '26px', color: '#5f6368', lineHeight: 1 }}>×</span>
          </div>

          {/* ── LOCATION PIN (overlapping photo and card) ─────────────────── */}
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '50px',
            transform: `scale(${pinScale})`,
            transformOrigin: 'center bottom',
            zIndex: 10,
          }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PulseRing frame={frame} />
              <LocationPin size={68} />
            </div>
          </div>
        </div>

        {/* ── CONTENT SECTION ────────────────────────────────────────────────── */}
        <div style={{
          padding: '52px 44px 44px 44px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}>

          {/* ── PLACE TYPE LABEL ─────────────────────────────────────────────── */}
          <div style={{
            opacity: labelOpacity,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{
              fontFamily: sansFont,
              fontSize: '22px',
              color: '#1a73e8',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
            }}>
              📍 Catering & Café Premium
            </span>
          </div>

          {/* ── BRAND NAME ───────────────────────────────────────────────────── */}
          <div style={{
            fontFamily: titleFont,
            fontSize: '68px',
            color: BRAND_BROWN,
            lineHeight: 1.05,
            letterSpacing: '0.5px',
          }}>
            Aroma a Café
          </div>

          {/* ── RATING ───────────────────────────────────────────────────────── */}
          <div style={{ opacity: ratingOpacity }}>
            <StarRating rating={4.9} count="2.847" />
          </div>

          {/* ── DIVIDER ──────────────────────────────────────────────────────── */}
          <div style={{
            height: '1px',
            background: '#e8eaed',
            margin: '4px 0',
          }} />

          {/* ── ADDRESS ROW ──────────────────────────────────────────────────── */}
          <div style={{
            opacity: addressOpacity,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
          }}>
            {/* Pin icon */}
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#f1f3f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '4px',
            }}>
              <span style={{ fontSize: '20px' }}>📍</span>
            </div>
            <div>
              <div style={{
                fontFamily: sansFont,
                fontSize: '26px',
                color: '#202124',
                fontWeight: '500',
                lineHeight: 1.4,
              }}>
                Buenos Aires, Argentina
              </div>
              <div style={{
                fontFamily: sansFont,
                fontSize: '22px',
                color: '#70757a',
                fontWeight: '400',
              }}>
                @aromaacafe_catering
              </div>
            </div>
          </div>

          {/* ── ORANGE ACCENT BAR ────────────────────────────────────────────── */}
          <div style={{
            height: '5px',
            borderRadius: '3px',
            background: `linear-gradient(to right, ${BRAND_ORANGE}, ${BRAND_YELLOW})`,
            boxShadow: `0 0 20px ${BRAND_ORANGE}66`,
            opacity: addressOpacity,
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
