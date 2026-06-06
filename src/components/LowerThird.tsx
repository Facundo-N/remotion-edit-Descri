import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadBevan } from '@remotion/google-fonts/Bevan';

const { fontFamily: sansFont } = loadMontserrat();
const { fontFamily: titleFont } = loadBevan();

const BRAND_YELLOW = '#f7edb0';
const BRAND_ORANGE = '#fbab4a';
// const BRAND_BROWN = '#2c210c'; // reserved for future use

interface LowerThirdProps {
  title: string;
  subtitle?: string;
  /** Frame (relative to Sequence start) when this lower third appears */
  appearAt?: number;
  /** Frame (relative to Sequence start) when it disappears */
  disappearAt?: number;
  position?: 'left' | 'center';
}

export const LowerThird: React.FC<LowerThirdProps> = ({
  title,
  subtitle,
  appearAt = 0,
  disappearAt,
  position = 'left',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const exitFrame = disappearAt ?? durationInFrames - 30;

  const enterProgress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 14, stiffness: 100, mass: 1 },
  });

  const exitProgress = spring({
    frame: frame - exitFrame,
    fps,
    config: { damping: 20, stiffness: 120, mass: 1 },
  });

  // More natural motion: slide + scale + slight rotation
  const slideX = interpolate(enterProgress, [0, 1], [-800, 0]);
  const slideXOut = interpolate(exitProgress, [0, 1], [0, -800]);
  const finalSlideX = frame >= exitFrame ? slideXOut : slideX;

  const scale = interpolate(enterProgress, [0, 1], [0.8, 1]);
  const rotation = interpolate(enterProgress, [0, 1], [-5, 0]);

  const lineWidth = interpolate(enterProgress, [0, 1], [0, 1]);

  // Subtitle word-by-word reveal
  const subtitleOpacity = interpolate(frame, [appearAt + 15, appearAt + 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  if (frame < appearAt) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: position === 'left' ? '300px' : '50%',
        left: position === 'left' ? '70px' : '50%',
        transform: position === 'center'
          ? `translate(-50%, 50%) translateX(${finalSlideX}px) scale(${scale}) rotate(${rotation}deg)`
          : `translateX(${finalSlideX}px) scale(${scale}) rotate(${rotation}deg)`,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {/* Accent line */}
      <div
        style={{
          width: `${lineWidth * 180}px`,
          height: '8px',
          background: `linear-gradient(to right, ${BRAND_ORANGE}, ${BRAND_YELLOW})`,
          borderRadius: '4px',
          marginBottom: '18px',
          boxShadow: `0 0 15px ${BRAND_ORANGE}66`,
        }}
      />

      {/* Background card */}
      <div
        style={{
          background: `linear-gradient(135deg, rgba(44,33,12,0.92) 0%, rgba(44,33,12,0.78) 100%)`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '24px',
          padding: '32px 50px 28px 32px',
          borderLeft: `6px solid ${BRAND_ORANGE}`,
          boxShadow: `0 15px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(247,237,176,0.2)`,
        }}
      >
        <div
          style={{
            fontFamily: titleFont,
            fontSize: '64px', // Bigger
            color: BRAND_YELLOW,
            lineHeight: 1.1,
            textShadow: `0 4px 30px ${BRAND_ORANGE}66`,
            letterSpacing: '1px',
          }}
        >
          {title}
        </div>

        {subtitle && (
          <div
            style={{
              fontFamily: sansFont,
              fontSize: '32px', // Bigger
              color: `${BRAND_ORANGE}`,
              fontWeight: 600,
              letterSpacing: '3px',
              marginTop: '12px',
              opacity: subtitleOpacity,
              textTransform: 'uppercase',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
