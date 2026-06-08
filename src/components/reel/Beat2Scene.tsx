/**
 * BEAT 2 — "Cápsulas premium variadas"
 * Reference: elimina_lo_selecconado_2K_202606061804.jpeg
 *
 * Layout:
 *   - Warm cream/yellow gradient background
 *   - 5 coffee beans (blurred) per reference — note very large bean on RIGHT edge
 *   - Capsule-with-beans PNG (no bg) on the RIGHT / lower-center area
 *   - Text LEFT-ALIGNED, mid-left:
 *       "Cápsulas premium / variadas"  (Lora 700, ~98 px)
 *       "Variedad de cápsulas premium" (smaller, regular weight)
 *   - NO card / panel
 *   - Subtítulos sincronizados word-by-word usando BEAT2_WORDS timings
 *
 * Animations (mirrored from Beat1Scene):
 *   - Scene entrance: spring GENTLE scale 0.92→1 + opacity
 *   - "Cápsulas premium": fade-in (frames 0→15)
 *   - "variadas": spring POP scale 0.4→1 + rotate -6→0 deg (delay 12)
 *   - "Variedad de cápsulas premium": slide-up translateY 20→0 + fade (delay 28)
 *   - Capsule image: spring POP from below-right
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
  lineHeight: 1.08,
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

export const Beat2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Scene entrance — spring GENTLE (mirrored from Beat1Scene) ─────────
  const sceneSpr = spring({ fps, frame, config: SPRINGS.GENTLE });
  const sceneScale = interpolate(sceneSpr, [0, 1], [0.92, 1]);
  const sceneOp = interpolate(sceneSpr, [0, 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // ─── Exit fade-out at end ──────────────────────────────────────────────
  const exitOp = interpolate(frame, [SCENE_FRAMES.beat2 - 10, SCENE_FRAMES.beat2], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ─── Capsule image — spring POP from below-right ─────────────────────
  const imgSpr = spring({ fps, frame: Math.max(0, frame - 10), config: SPRINGS.POP });
  const imgOp = interpolate(imgSpr, [0, 0.35], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // ─── Title text — staggered animations (mirrored from Beat1Scene) ────

  // Line 1 "Cápsulas" — fade-in (like "Máquina de")
  const line1Op = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Line 2 "premium" — spring POP scale + rotate (like "café", delay 10)
  const line2Spr = spring({ fps, frame: Math.max(0, frame - 10), config: SPRINGS.POP });
  const line2Scale = interpolate(line2Spr, [0, 1], [0.4, 1.15]);
  const line2Rot = interpolate(line2Spr, [0, 1], [-6, 0]);
  const line2Op = interpolate(line2Spr, [0, 0.35], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Line 3 "variadas" — slide-up + fade (like "profesional", delay 24)
  const line3Spr = spring({ fps, frame: Math.max(0, frame - 24), config: SPRINGS.GENTLE });
  const line3Op = interpolate(line3Spr, [0, 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const line3Y = interpolate(line3Spr, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(155deg, ${COLORS.cream} 0%, ${COLORS.yellow} 60%, #e8d5a0 100%)`,
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
        <Bean left={-270} top={-250} size={540} rotate={-12} blur={14} delay={0} />
        <Bean left={690} top={-220} size={480} rotate={22} blur={11} delay={4} flipH />
        <Bean left={-280} top={660} size={520} rotate={12} blur={15} delay={8} />
        <Bean left={820} top={860} size={560} rotate={-6} blur={16} delay={5} flipH />
        <Bean left={800} top={1660} size={420} rotate={-30} blur={9} delay={3} flipH />

        {/* ── Capsule image — vertically centered (like Beat1 machine) ── */}
        <Img
          src={staticFile('beat2_vaso.png')}
          style={{
            position: 'absolute',
            left: 80,
            top: '50%',
            width: 1000,
            height: 'auto',
            opacity: imgOp,
            transform: `translateY(-50%) translateX(0px)`,
            zIndex: 5,
            filter: 'drop-shadow(0 24px 48px rgba(44,33,12,0.22))',
          }}
        />

        {/* ── Title text — 3 líneas independientes, bajado respecto a Beat1 ── */}
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 340,
            zIndex: 10,
            pointerEvents: 'none',
            maxWidth: 620,
          }}
        >
          {/* "Cápsulas" — fade-in (like "Máquina de") */}
          <div
            style={{
              ...GLASS_TEXT_STYLE,
              fontSize: 75,
              opacity: line1Op,
            }}
          >
            Cápsulas
          </div>

          {/* "premium" — spring POP hero (like "café") */}
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
            premium
          </div>

          {/* "variadas" — slide-up (like "profesional") */}
          <div
            style={{
              ...GLASS_TEXT_STYLE,
              fontSize: 118,
              color: '#f7edb0',
              opacity: line3Op,
              transform: `translateY(${line3Y}px)`,
            }}
          >
            variadas
          </div>
        </div>
      </div>

      {/* ── SFX ─────────────────────────────────────────────────────── */}
      <Sequence from={10} durationInFrames={12} layout="none">
        <Audio src={staticFile('click_clean.mp3')} volume={0.28} />
      </Sequence>

      {/* ── Beat 2 VO ────────────────────────────────────────────────── */}
      <Audio src={staticFile('elevenlabs_beats.mp3')} startFrom={BEATS_VO_OFFSETS.beat2} volume={1} />
    </AbsoluteFill>
  );
};