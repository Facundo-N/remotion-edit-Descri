/**
 * HOOK scene — GLASS-MORPHISM EDITION
 * ======================================
 * Kinetic text entrance con estilo Liquid Glass / Glass Design UI.
 * Fondo crema, caracteres con vidrio translúcido y bordes café.
 * Imágenes activadas: beans, grain, video card, "Café" watermark.
 *
 * Pares de palabras (sincronizado con hook_vo.mp3, 113 frames):
 *   "¿Sabés qué?"      0–20
 *   "incluye"          14–36
 *   "nuestro servicio" 30–56
 *   "de cafetería"     48–80
 *   "para empresas?"   72–113
 *
 * Cada carácter es una cápsula de vidrio flotante con:
 *   - background: rgba(255,255,255,0.20)
 *   - backdropFilter: blur(4px)
 *   - border: 1px solid rgba(251,171,74,0.35)
 *   - borderRadius: 10px
 *   - color: #2c210c (marrón oscuro)
 *   - boxShadow: 0 4px 20px rgba(251,171,74,0.12)
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';

const { fontFamily: inter } = loadFont();

// ─── Noise / film-grain overlay ─────────────────────────────────────────────
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(Math.sin(Math.floor(frame / 3)), [-1, 1], [0.02, 0.05]);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay', opacity: op, pointerEvents: 'none', zIndex: 98,
      }}
    />
  );
};

// ─── Single coffee-bean (placed at each corner with blur) ───────────────────
const Bean: React.FC<{
  left: number; top: number; size: number; rotate: number;
  blur: number; delay?: number; flipH?: boolean; opacity?: number;
}> = ({ left, top, size, rotate, blur, delay = 0, flipH = false, opacity = 0.93 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spr = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 200, mass: 1, stiffness: 100 } });
  const offX = left < 0 ? interpolate(spr, [0, 1], [-200, 0]) :
    left > 600 ? interpolate(spr, [0, 1], [200, 0]) : 0;
  const offY = top < 0 ? interpolate(spr, [0, 1], [-200, 0]) :
    top > 1400 ? interpolate(spr, [0, 1], [200, 0]) : 0;
  const fade = interpolate(spr, [0, 0.4], [0, opacity], { extrapolateRight: 'clamp' });

  return (
    <Img
      src={staticFile('coffee_beans.png')}
      style={{
        position: 'absolute', left, top, width: size, height: 'auto',
        opacity: fade,
        transform: `translate(${offX}px, ${offY}px) rotate(${rotate}deg) scaleX(${flipH ? -1 : 1})`,
        filter: `blur(${blur}px) drop-shadow(0 8px 18px rgba(44,33,12,0.2))`,
        pointerEvents: 'none', zIndex: 3,
      }}
    />
  );
};

// ─── Spring presets ──────────────────────────────────────────────────────────
const SP = {
  GENTLE: { damping: 200, mass: 1, stiffness: 80 },
  POP: { damping: 14, mass: 0.9, stiffness: 110 },
  SNAP: { damping: 20, mass: 1, stiffness: 200 },
} as const;

// ─── Word pair data (sincronizado con hook_vo.mp3) ─────────────────────────
interface WordPair {
  text: string;
  startFrame: number;
  endFrame: number;
}

const WORD_PAIRS: WordPair[] = [
  { text: '¿Sabés qué?', startFrame: 0, endFrame: 20 },
  { text: 'incluye', startFrame: 14, endFrame: 36 },
  { text: 'nuestro servicio', startFrame: 30, endFrame: 56 },
  { text: 'de cafetería', startFrame: 48, endFrame: 80 },
  { text: 'para empresas?', startFrame: 72, endFrame: 113 },
];

const EXIT_DURATION = 10; // frames for exit transition (drift up + blur + fade)

const BROWN_SHADOW = [
  '-3px -3px 0 #2c210c', '3px -3px 0 #2c210c',
  '-3px 3px 0 #2c210c',  '3px 3px 0 #2c210c',
  '4px 4px 0 #2c210c',   '5px 5px 0 #2c210c',
].join(', ');

// ─── Glass character base style (ProCaption style) ────────────────────────────
const GLASS_CHAR_STYLE: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: inter,
  fontSize: 96,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: 'normal',
  color: '#fbab4a',
  textShadow: BROWN_SHADOW,
  position: 'relative' as const,
  zIndex: 10,
};

// ─── Kinetic WordPair Component ─────────────────────────────────────────────
const KineticPair: React.FC<{
  text: string;
  startFrame: number;
  endFrame: number;
  frame: number;
  fps: number;
}> = ({ text, startFrame, endFrame, frame, fps }) => {
  const CHARS = text.split('');
  const exitStartFrame = endFrame - EXIT_DURATION;

  if (frame < startFrame || frame >= endFrame) {
    return null;
  }

  const localFrame = frame - startFrame;
  const scaleSpr = spring({ fps, frame: localFrame, config: SP.POP });
  const scaleVal = interpolate(scaleSpr, [0, 1], [1.2, 1.0]);

  const exitLocal = Math.max(0, frame - exitStartFrame);
  const exitOp = interpolate(exitLocal, [0, EXIT_DURATION], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const exitY = interpolate(exitLocal, [0, EXIT_DURATION], [0, -30], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const exitBlur = interpolate(exitLocal, [0, EXIT_DURATION - 2], [0, 14], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const AVG_CHAR_W = 42;
  const TEXT_CENTER = (CHARS.length * AVG_CHAR_W) / 2;
  const CHAR_STAGGER = 1;

  // Subtle pulse on the bloom so it feels alive
  const bloomPulse = 0.80 + 0.20 * Math.sin(frame * 0.18);

  return (
    <>
      {/* \u2500\u2500 Ambient light bloom \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <div
        style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: `translate(-50%, -50%) translateY(${exitY}px)`,
          width: 900,
          height: 380,
          opacity: exitOp * bloomPulse,
          background: [
            'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(255,210,60,0.62) 0%, transparent 70%)',
            'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(251,171,74,0.28) 0%, transparent 75%)',
          ].join(', '),
          filter: 'blur(36px)',
          pointerEvents: 'none',
          zIndex: 9,
        }}
      />

      {/* \u2500\u2500 Kinetic text \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <div
        style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: `translate(-50%, -50%) translateY(${exitY}px)`,
          opacity: exitOp,
          filter: exitBlur > 0 ? `blur(${exitBlur}px)` : undefined,
        }}
      >
        <div
          style={{
            transform: `scale(${scaleVal})`,
            display: 'flex',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
            alignItems: 'center',
          }}
        >
          {CHARS.map((ch, i) => {
            const f = Math.max(0, localFrame - i * CHAR_STAGGER);
            const spr = spring({ fps, frame: f, config: SP.SNAP });
            const op = interpolate(spr, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' });
            const bl = interpolate(spr, [0, 1], [6, 0]);
            const sc = interpolate(spr, [0, 1], [1.2, 1]);
            const naturalX = i * AVG_CHAR_W + AVG_CHAR_W / 2 - TEXT_CENTER;
            const spreadX = interpolate(spr, [0, 1], [-naturalX * 0.65, 0]);
            return (
              <span key={i} style={{ display: 'inline-block', transform: `translateX(${spreadX}px)` }}>
                <span
                  style={{
                    ...GLASS_CHAR_STYLE,
                    opacity: op,
                    filter: bl > 0.1 ? `blur(${bl}px)` : undefined,
                    transform: `scale(${sc})`,
                  }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
};

// ─── Main export ────────────────────────────────────────────────────────────
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Camera breathing
  const camScale = interpolate(frame, [0, 60, 113], [1.02, 0.98, 1.0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Card entrance
  const cardSpr = spring({ fps, frame, config: SP.GENTLE });
  const cardScale = interpolate(cardSpr, [0, 1], [0.90, 1]);
  const cardOp = interpolate(cardSpr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse 72% 43% at 50% 48%, rgba(251,171,74,0.10) 0%, #FDF8E7 68%)',
        opacity: fadeIn,
        overflow: 'hidden',
      }}
    >
      <Grain />

      {/* ── Beans at 4 corners ──────────────────────────────────────── */}
      <Bean left={-160} top={-140} size={480} rotate={-22} blur={12} delay={0} />
      <Bean left={730} top={-120} size={440} rotate={30} blur={9} delay={4} flipH />
      <Bean left={-140} top={1570} size={460} rotate={20} blur={11} delay={8} />
      <Bean left={790} top={1620} size={400} rotate={-28} blur={8} delay={6} flipH />

      {/* ── Camera breathing wrapper ─────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          transform: `scale(${camScale})`,
        }}
      >
        {/* ── "Café" italic watermark ──────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: 760, left: 0, right: 0,
            textAlign: 'center',
            fontFamily: inter,
            fontSize: 380,
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#fbab4a',
            opacity: 0.04,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 0,
            letterSpacing: '-8px',
          }}
        >
          Café
        </div>
      </div>

      {/* ── Video card ────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 510,
          transform: `translateX(-50%) scale(${cardScale})`,
          transformOrigin: 'center top',
          width: 700,
          height: 900,
          borderRadius: 48,
          overflow: 'hidden',
          backgroundColor: 'transparent',
          border: `3px solid #fbab4a`,
          boxShadow: '0 24px 60px rgba(44,33,12,0.28)',
          opacity: cardOp,
          zIndex: 5,
        }}
      >
        <OffthreadVideo
          src={staticFile('0515_principio.mp4')}
          startFrom={90}
          volume={0}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(5px)' }}
        />
        {/* Apple-style gray frosted overlay over video */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(90,90,100,0.52) 0%, rgba(60,60,70,0.44) 100%)',
            backdropFilter: 'blur(2px) saturate(80%)',
            WebkitBackdropFilter: 'blur(2px) saturate(80%)',
          }}
        />
      </div>

      {/* ── Scene-wide frosted veil (behind text, over background) ─────── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(100,100,110,0.18)',
          backdropFilter: 'blur(1px) saturate(75%)',
          WebkitBackdropFilter: 'blur(1px) saturate(75%)',
          pointerEvents: 'none',
          zIndex: 6,
        }}
      />

      {/* ── Kinetic word pairs (on top of video) ───────────────────── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {WORD_PAIRS.map((pair, i) => (
          <KineticPair
            key={i}
            text={pair.text}
            startFrame={pair.startFrame}
            endFrame={pair.endFrame}
            frame={frame}
            fps={fps}
          />
        ))}
      </div>

      {/* ── SFX: tick on text entry ───────────────────────────────── */}
      <Sequence from={0} durationInFrames={12} layout="none">
        <Audio src={staticFile('click_clean.mp3')} volume={0.3} />
      </Sequence>

      {/* ── Hook voice-over ───────────────────────────────────────── */}
      <Audio src={staticFile('hook_vo.mp3')} volume={1} />
    </AbsoluteFill>
  );
};