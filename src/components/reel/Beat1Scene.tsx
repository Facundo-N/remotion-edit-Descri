/**
 * BEAT 1 — "Máquina de café profesional"
 * Reference: generated-image-1780759928440.png
 *
 * Layout:
 *   - Warm cream/yellow gradient background
 *   - 5 coffee beans (blurred, partially off-screen) per reference
 *   - Machine PNG (no background) on the RIGHT / lower-center area
 *   - Text LEFT-ALIGNED, mid-left: "Máquina de / café / profesional"  (Lora 900, ~100-120 px)
 *   - Text style: #f5c97a naranja-crema with #6b3a10 marrón 1.5px stroke (like HookScene glass)
 *   - Frosted gray overlay behind text (like HookScene)
 *   - NO card / panel behind anything
 *
 * Animations adapted from SaaSRefComposition S7 (MakingCTAScene):
 *   - Scene entrance: spring GENTLE scale 0.92→1 + opacity (like card entrance)
 *   - "Máquina de": fade-in (like "Making" label in S7)
 *   - "café": spring POP scale 0.4→1 + rotate -6→0 deg (like DisfrutarScene words)
 *   - "profesional": slide-up translateY 20→0 + fade (like "The Best way to" in S7)
 *   - Machine: spring POP scale 0.3→1 + slide from right, larger size
 *   - Amber glows on sides (like purple blobs in S7)
 *   - Exit fade-out last 10 frames (like transition out in S7)
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

const { fontFamily: sans } = loadMontserrat();

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

const BROWN_SHADOW = [
  '-3px -3px 0 #2c210c', '3px -3px 0 #2c210c',
  '-3px 3px 0 #2c210c', '3px 3px 0 #2c210c',
  '4px 4px 0 #2c210c', '5px 5px 0 #2c210c',
].join(', ');

// ─── Common text style (ProCaption style) ────────────────────────────────────
const GLASS_TEXT_STYLE: React.CSSProperties = {
  fontFamily: sans,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: 'normal',
  textAlign: 'left',
  lineHeight: 1.08,
  color: '#fbab4a',
  textShadow: BROWN_SHADOW,
};

export const Beat1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Scene entrance — spring GENTLE (like S7 card entrance) ─────────────
  const sceneSpr = spring({ fps, frame, config: SPRINGS.GENTLE });
  const sceneScale = interpolate(sceneSpr, [0, 1], [0.92, 1]);
  const sceneOp = interpolate(sceneSpr, [0, 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // ─── Exit fade-out at end (last 10 frames, like S7 transition out) ──────
  const exitOp = interpolate(frame, [SCENE_FRAMES.beat1 - 10, SCENE_FRAMES.beat1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ─── Machine — spring POP with scale (like UE Icon in S7) ──────────────
  const imgSpr = spring({ fps, frame: Math.max(0, frame - 16), config: SPRINGS.POP });
  const imgScale = interpolate(imgSpr, [0, 1], [0.3, 1]);
  const imgX = interpolate(imgSpr, [0, 1], [120, 0]);
  const imgOp = interpolate(imgSpr, [0, 0.35], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // ─── Title text — staggered animations (inspired by S7 MakingCTAScene) ──

  // Line 1 "Máquina de" — fade-in (like "Making" label in S7, frames 0-15)
  const line1Op = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Line 2 "café" — spring POP scale + rotate (like DisfrutarScene words, delay 12)
  const line2Spr = spring({ fps, frame: Math.max(0, frame - 12), config: SPRINGS.POP });
  const line2Scale = interpolate(line2Spr, [0, 1], [0.4, 1.15]);
  const line2Rot = interpolate(line2Spr, [0, 1], [-6, 0]);
  const line2Op = interpolate(line2Spr, [0, 0.35], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Line 3 "profesional" — slide-up + fade (like "The Best way to" in S7, delay 28)
  const line3Spr = spring({ fps, frame: Math.max(0, frame - 28), config: SPRINGS.GENTLE });
  const line3Op = interpolate(line3Spr, [0, 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const line3Y = interpolate(line3Spr, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${COLORS.yellow} 0%, #edddb5 100%)`,
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
        {/* ── Amber ambient glows (like purple blobs in S7) ────────────── */}
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

        {/* ── Beans — per reference positions ─────────────────────────────── */}
        {/* TOP-LEFT: huge, mostly off-screen */}
        <Bean left={-310} top={-290} size={580} rotate={-14} blur={16} delay={0} />
        {/* TOP-RIGHT: large, upper-right edge */}
        <Bean left={700} top={-270} size={500} rotate={28} blur={12} delay={4} flipH />
        {/* LEFT-MID: large bean on left edge, ~50 % down */}
        <Bean left={-300} top={640} size={540} rotate={6} blur={15} delay={8} />
        {/* BOTTOM-LEFT */}
        <Bean left={-220} top={1580} size={460} rotate={28} blur={10} delay={6} />
        {/* BOTTOM-RIGHT */}
        <Bean left={770} top={1690} size={430} rotate={-22} blur={8} delay={3} flipH />


        {/* ── Machine image — vertically centered ─────────────────────── */}
        <Img
          src={staticFile('beat1_machine.png')}
          style={{
            position: 'absolute',
            left: 80,
            top: '50%',
            width: 1000,
            height: 'auto',
            opacity: imgOp,
            transform: `translateY(-50%) scale(${imgScale}) translateX(${imgX}px)`,
            transformOrigin: 'center center',
            zIndex: 5,
            filter: 'drop-shadow(0 24px 48px rgba(44,33,12,0.22))',
          }}
        />

        {/* ── Title text — arriba, sin tapar la imagen ─────────────── */}
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 280,
            zIndex: 10,
            pointerEvents: 'none',
            maxWidth: 620,
          }}
        >
          {/* "Máquina de" — etiqueta pequeña */}
          <div
            style={{
              ...GLASS_TEXT_STYLE,
              fontSize: 75,
              opacity: line1Op,
            }}
          >
            Máquina de
          </div>

          {/* "café" — hero */}
          <div
            style={{
              ...GLASS_TEXT_STYLE,
              fontSize: 142,
              color: '#f7edb0',
              opacity: line2Op,
              transform: `scale(${line2Scale}) rotate(${line2Rot}deg)`,
              transformOrigin: 'left center',
            }}
          >
            café
          </div>

          {/* "profesional" */}
          <div
            style={{
              ...GLASS_TEXT_STYLE,
              fontSize: 118,
              color: '#f7edb0',
              opacity: line3Op,
              transform: `translateY(${line3Y}px)`,
            }}
          >
            profesional
          </div>
        </div>
      </div>

      {/* ── SFX ─────────────────────────────────────────────────────────── */}
      <Sequence from={12} durationInFrames={12} layout="none">
        <Audio src={staticFile('click_clean.mp3')} volume={0.28} />
      </Sequence>

      {/* ── Beat 1 VO — offset 67 skips Region 0 preamble, starts at "Máquina de café profesional" */}
      <Audio src={staticFile('elevenlabs_beats.mp3')} startFrom={BEATS_VO_OFFSETS.beat1} volume={1} />
    </AbsoluteFill>
  );
};