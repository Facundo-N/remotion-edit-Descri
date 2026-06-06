import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';

const { fontFamily: sansFont } = loadMontserrat();

const BRAND_YELLOW = '#f7edb0';
const BRAND_ORANGE = '#fbab4a';
// const BRAND_BROWN = '#2c210c'; // reserved for future use

interface KineticTextProps {
  text: string;
  /** Frame (relative to Sequence start) when animation starts */
  startAt?: number;
  /** Delay (in frames) between each word appearing */
  wordDelay?: number;
  style?: React.CSSProperties;
  fontSize?: number;
  color?: string;
  highlightWords?: string[]; // Words to highlight in BRAND_ORANGE
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  startAt = 0,
  wordDelay = 8,
  style,
  fontSize = 72,
  color = BRAND_YELLOW,
  highlightWords = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '12px',
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordFrame = startAt + i * wordDelay;
        const wordSpring = spring({
          frame: frame - wordFrame,
          fps,
          config: { damping: 14, stiffness: 180, mass: 0.6 },
        });

        const translateY = interpolate(wordSpring, [0, 1], [80, 0]);
        const opacity = interpolate(wordSpring, [0, 1], [0, 1]);
        const isHighlighted = highlightWords.includes(word.replace(/[.,!?]/g, ''));

        return (
          <span
            key={i}
            style={{
              fontFamily: sansFont,
              fontSize: `${fontSize}px`,
              fontWeight: 800,
              color: isHighlighted ? BRAND_ORANGE : color,
              display: 'inline-block',
              transform: `translateY(${translateY}px)`,
              opacity,
              lineHeight: 1.1,
              textShadow: `0 4px 30px rgba(0,0,0,0.6)`,
              letterSpacing: '-1px',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// SCENE TITLE: Full overlay text card
// ─────────────────────────────────────────────────────
interface SceneTitleProps {
  line1: string;
  line2?: string;
  showAt?: number;
  hideAt?: number;
  /** top | center | bottom-center */
  align?: 'top' | 'center' | 'bottom';
}

export const SceneTitle: React.FC<SceneTitleProps> = ({
  line1,
  line2,
  showAt = 0,
  hideAt,
  align = 'top',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exitFrame = hideAt ?? durationInFrames - 20;

  if (frame < showAt || frame > exitFrame + 20) return null;

  const enterSpring = spring({
    frame: frame - showAt,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  const exitOpacity = interpolate(frame, [exitFrame, exitFrame + 20], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(enterSpring, [0, 1], [-60, 0]);
  const opacity = Math.min(enterSpring, exitOpacity);

  const verticalPos: React.CSSProperties =
    align === 'top'
      ? { top: '100px' }
      : align === 'bottom'
      ? { bottom: '350px' }
      : { top: '50%', transform: `translateY(calc(-50% + ${translateY}px))` };

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        ...verticalPos,
        transform:
          align === 'center'
            ? `translate(-50%, calc(-50% + ${translateY}px))`
            : `translate(-50%, ${translateY}px)`,
        opacity,
        textAlign: 'center',
        zIndex: 100,
        pointerEvents: 'none',
        width: '900px',
      }}
    >
      {/* Decorative lines */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${BRAND_ORANGE})` }} />
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: BRAND_ORANGE,
          boxShadow: `0 0 12px ${BRAND_ORANGE}`,
        }} />
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${BRAND_ORANGE})` }} />
      </div>

      <div style={{
        fontFamily: sansFont,
        fontSize: '56px',
        fontWeight: 800,
        color: '#ffffff',
        textShadow: `0 2px 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.5)`,
        lineHeight: 1.1,
        textTransform: 'uppercase',
        letterSpacing: '4px',
      }}>
        {line1}
      </div>

      {line2 && (
        <div style={{
          fontFamily: sansFont,
          fontSize: '36px',
          fontWeight: 400,
          color: BRAND_ORANGE,
          marginTop: '8px',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          textShadow: `0 2px 20px rgba(0,0,0,0.7)`,
        }}>
          {line2}
        </div>
      )}

      {/* Bottom line */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${BRAND_ORANGE})` }} />
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: BRAND_ORANGE,
          boxShadow: `0 0 12px ${BRAND_ORANGE}`,
        }} />
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${BRAND_ORANGE})` }} />
      </div>
    </div>
  );
};
