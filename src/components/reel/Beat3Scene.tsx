/**
 * BEAT 3 — "Vajilla elegante"
 * Reference: reemplaza_la_capsula_de_cafe_202606062203.jpeg
 *
 * Layout:
 *   - Warm cream/yellow gradient background
 *   - 5 coffee beans (blurred) per reference — large bean on RIGHT edge
 *   - Vajilla PNG (no bg) centered-lower area
 *   - Text LEFT-ALIGNED, mid-left: "Vajilla / elegante"  (Lora 700, ~100 px)
 *   - NO card / panel
 *
 * Animations (mirrored from Beat1Scene):
 *   - Scene entrance: spring GENTLE scale 0.92→1 + opacity
 *   - "Vajilla": fade-in (frames 0→15)
 *   - "elegante": spring POP scale 0.4→1 + rotate -6→0 deg (delay 12)
 *   - Vajilla image: spring POP from below
 *   - Amber glows on sides
 *   - Exit fade-out last 10 frames
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { BEATS_VO_OFFSETS, COLORS, SPRINGS, SCENE_FRAMES } from '../../constants';

const { fontFamily: serif } = loadMontserrat();

const BROWN_SHADOW = [
  '-3px -3px 0 #2c210c', '3px -3px 0 #2c210c',
  '-3px 3px 0 #2c210c', '3px 3px 0 #2c210c',
  '4px 4px 0 #2c210c', '5px 5px 0 #2c210c',
].join(', ');

// ─── Common text style (mirrored from Beat1Scene) ──────────────────────────
const GLASS_TEXT_STYLE: React.CSSProperties = {
  fontFamily: serif,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: 'normal',
  textAlign: 'left',
  lineHeight: 1.06,
  color: '#fbab4a',
  textShadow: BROWN_SHADOW,
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(Math.sin(Math.floor(frame / 3)), [-1, 1], [0.03, 0.07]);
  return (
    <AbsoluteFill
      style={{
        // eslint-disable-next-line @remotion/no-background-image
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay', opacity: op, pointerEvents: 'none', zIndex: 98,
      }}
    />
  );
};

const Bean: React.FC<{
  left: number; top: number; size: number; rotate: number;
  blur: number; delay?: number; flipH?: boolean; opacity?: number;
}> = ({ left, top, size, rotate, blur, delay = 0, flipH = false, opacity = 0.9 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spr = spring({ fps, frame: Math.max(0, frame - delay), config: SPRINGS.SUAVE });
  const offX = left < 0 ? interpolate(spr, [0, 1], [-180, 0]) :
    left > 700 ? interpolate(spr, [0, 1], [180, 0]) : 0;
  const offY = top < 0 ? interpolate(spr, [0, 1], [-180, 0]) :
    top > 1500 ? interpolate(spr, [0, 1], [180, 0]) : 0;
  const fade = interpolate(spr, [0, 0.4], [0, opacity], { extrapolateRight: 'clamp' });

  return (
    <Img
      src={staticFile('coffee_beans.png')}
      style={{
        position: 'absolute', left, top, width: size, height: 'auto',
        opacity: fade,
        transform: `translate(${offX}px, ${offY}px) rotate(${rotate}deg) scaleX(${flipH ? -1 : 1})`,
        filter: `blur(${blur}px) drop-shadow(0 8px 16px rgba(44,33,12,0.18))`,
        pointerEvents: 'none', zIndex: 3,
      }}
    />
  );
};

export const Beat3Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Scene entrance — spring GENTLE (mirrored from Beat1Scene) ─────────
  const sceneSpr = spring({ fps, frame, config: SPRINGS.GENTLE });
  const sceneScale = interpolate(sceneSpr, [0, 1], [0.92, 1]);
  const sceneOp = interpolate(sceneSpr, [0, 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // ─── Exit fade-out at end ──────────────────────────────────────────────
  const exitOp = interpolate(frame, [SCENE_FRAMES.beat3 - 10, SCENE_FRAMES.beat3], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ─── Vajilla image — spring POP from below ───────────────────────────
  const imgSpr = spring({ fps, frame: Math.max(0, frame - 8), config: SPRINGS.POP });
  const imgY = interpolate(imgSpr, [0, 1], [80, 0]);
  const imgOp = interpolate(imgSpr, [0, 0.35], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // ─── Title text — staggered animations (mirrored from Beat1Scene) ────

  // Line 1 "Vajilla" — fade-in
  const line1Op = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Line 2 "elegante" — spring POP scale + rotate (delay 12)
  const line2Spr = spring({ fps, frame: Math.max(0, frame - 12), config: SPRINGS.POP });
  const line2Scale = interpolate(line2Spr, [0, 1], [0.4, 1.15]);
  const line2Rot = interpolate(line2Spr, [0, 1], [-6, 0]);
  const line2Op = interpolate(line2Spr, [0, 0.35], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${COLORS.yellow} 0%, ${COLORS.cream} 55%, #e8d8b0 100%)`,
        overflow: 'hidden',
      }}
    >
      <Grain />

      {/* ── Frosted gray overlay — full screen from frame 0 ────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(100,100,110,0.18)',
          backdropFilter: 'blur(1px) saturate(75%)',
          WebkitBackdropFilter: 'blur(1px) saturate(75%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Scene entrance wrapper (scale + opacity + exit) ──────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: sceneOp * exitOp,
          transform: `scale(${sceneScale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* ── Amber ambient glows (mirrored from Beat1) ────────────────── */}
        <div
          style={{
            position: 'absolute',
            left: -60,
            top: '15%',
            width: 220,
            height: 280,
            background: `radial-gradient(ellipse, ${COLORS.amber}33 0%, transparent 70%)`,
            filter: 'blur(30px)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -60,
            bottom: '15%',
            width: 220,
            height: 280,
            background: `radial-gradient(ellipse, ${COLORS.amber}33 0%, transparent 70%)`,
            filter: 'blur(30px)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* ── Beans — per reference ────────────────────────────────────── */}
        <Bean left={-250} top={-230} size={520} rotate={-18} blur={14} delay={0} />
        <Bean left={700} top={-190} size={460} rotate={26} blur={10} delay={4} flipH />
        <Bean left={840} top={680} size={540} rotate={-8} blur={15} delay={5} flipH />
        <Bean left={-230} top={1620} size={470} rotate={16} blur={11} delay={8} />
        <Bean left={790} top={1700} size={410} rotate={-26} blur={9} delay={3} flipH />

        {/* ── Vajilla image — shifted left a bit ────────────────────── */}
        <Img
          src={staticFile('beat3_vajilla.png')}
          style={{
            position: 'absolute',
            left: '68%',
            top: 860,
            transform: `translateX(-50%) translateY(${imgY}px)`,
            width: 880,
            height: 'auto',
            opacity: imgOp,
            zIndex: 5,
            filter: 'drop-shadow(0 24px 48px rgba(44,33,12,0.18))',
          }}
        />

        {/* ── Title text — moved up a bit ───────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            left: 58,
            top: 660,
            zIndex: 10,
            pointerEvents: 'none',
            maxWidth: 640,
          }}
        >
          {/* "Vajilla" — fade-in */}
          <div
            style={{
              ...GLASS_TEXT_STYLE,
              fontSize: 75,
              opacity: line1Op,
            }}
          >
            Vajilla
          </div>

          {/* "elegante" — spring POP hero */}
          <div
            style={{
              ...GLASS_TEXT_STYLE,
              fontSize: 130,
              color: '#f7edb0',
              opacity: line2Op,
              transform: `scale(${line2Scale}) rotate(${line2Rot}deg)`,
              transformOrigin: 'left center',
            }}
          >
            elegante
          </div>
        </div>
      </div>

      {/* ── SFX ─────────────────────────────────────────────────────── */}
      <Sequence from={12} durationInFrames={12} layout="none">
        <Audio src={staticFile('click_clean.mp3')} volume={0.28} />
      </Sequence>

      {/* ── Beat 3 VO ────────────────────────────────────────────────── */}
      <Audio src={staticFile('elevenlabs_beats.mp3')} startFrom={BEATS_VO_OFFSETS.beat3} volume={1} />
    </AbsoluteFill>
  );
};