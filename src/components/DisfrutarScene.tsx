import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
  OffthreadVideo,
  Sequence,
  staticFile,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';

const { fontFamily: sans } = loadMontserrat();

const CLICK_FRAME = 25;
// La cinta empieza a dibujarse desde el frame 0 y se completa en el frame 40
const RIBBON_START = 0;
const RIBBON_END = 40;

export const DisfrutarScene: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const rawFrame = useCurrentFrame();
  const frame = Math.max(0, rawFrame - delay);
  const { fps } = useVideoConfig();

  // ── RIBBON DRAW-ON animation ────────────────────────────────────────────────
  // El clipPath empieza con width=0 (cinta invisible) y crece hasta width=1080 (cinta completa)
  // Usa easing de ease-out para que acelere al principio y frene al llegar
  const ribbonProgress = interpolate(frame, [RIBBON_START, RIBBON_END], [0, 1080], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // ── FRAME / VIDEO card bounce-in + smooth continuous pendulum oscillation ──
  const cardSpring = spring({
    fps, frame: frame - CLICK_FRAME,
    config: { damping: 15, stiffness: 80, mass: 0.9 },
  });
  const cardScale = frame >= CLICK_FRAME ? interpolate(cardSpring, [0, 1], [0, 1]) : 0;

  const shakeFrame = Math.max(0, frame - CLICK_FRAME);

  // La rotación base sigue el spring de entrada: va de -8° a +2°
  const baseRot = interpolate(cardSpring, [0, 1], [-8, 2]);

  // Oscilación continua de péndulo más suave (±2.5°) y lenta (frecuencia 0.05) escalada por cardSpring
  const swingAngle = Math.sin(shakeFrame * 0.05) * 2.5;
  const bounceRot = baseRot + swingAngle * cardSpring;

  // Flotación vertical continua más sutil (±4px) escalada por cardSpring
  const bounceY = Math.sin(shakeFrame * 0.05 + Math.PI) * 4 * cardSpring;



  // ── TOP TEXT stagger ────────────────────────────────────────────────────────
  const smallTextOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const bigWordSpr = (wordDelay: number) =>
    spring({ fps, frame: frame - wordDelay, config: { damping: 10, mass: 0.7 } });

  const soloPop  = bigWordSpr(5);
  const tePop    = bigWordSpr(10);
  const preoPop  = bigWordSpr(13);
  const porPop   = bigWordSpr(16);
  const disfSpr  = spring({ fps, frame: frame - 8, config: { damping: 9, mass: 1.1 } });

  // ── CAPTION bottom ──────────────────────────────────────────────────────────
  const captionOpacity = interpolate(frame, [CLICK_FRAME + 10, CLICK_FRAME + 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#F7F4EF', overflow: 'hidden' }}>

      {/* CSS keyframes */}
      <style>{`
        @keyframes rippleDis {
          0%   { transform: scale(0.2); opacity: 0.9; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          TOP TEXT AREA
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        {/* Small italic line */}
        <div style={{
          fontFamily: sans,
          fontSize: 52,
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#7a6f63',
          letterSpacing: '1px',
          opacity: smallTextOpacity,
          lineHeight: 1.3,
        }}>
          para que vos
        </div>

        {/* Big words row 1 */}
        <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
          {[
            { word: 'SOLO', spr: soloPop },
            { word: 'TE', spr: tePop },
          ].map(({ word, spr }) => (
            <span key={word} style={{
              fontFamily: sans,
              fontSize: 120,
              fontWeight: 900,
              color: '#fbab4a',
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-3px',
              transform: `scale(${interpolate(spr, [0,1],[0,1])}) rotate(${interpolate(spr,[0,1],[-10,0])}deg)`,
              display: 'inline-block',
              opacity: Math.min(spr * 1.5, 1),
            }}>
              {word}
            </span>
          ))}
        </div>

        {/* Big words row 2 */}
        <div style={{ display: 'flex', gap: 20, marginTop: 0 }}>
          {[
            { word: 'PREOCUPES', spr: preoPop },
            { word: 'POR', spr: porPop },
          ].map(({ word, spr }) => (
            <span key={word} style={{
              fontFamily: sans,
              fontSize: 96,
              fontWeight: 900,
              color: '#fbab4a',
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-2px',
              transform: `scale(${interpolate(spr, [0,1],[0,1])}) rotate(${interpolate(spr,[0,1],[8,0])}deg)`,
              display: 'inline-block',
              opacity: Math.min(spr * 1.5, 1),
            }}>
              {word}
            </span>
          ))}
        </div>

        {/* DISFRUTAR — accent huge word */}
        <div style={{
          fontFamily: sans,
          fontSize: 160,
          fontWeight: 900,
          color: '#2c210c',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          letterSpacing: '-5px',
          transform: `scale(${interpolate(disfSpr, [0,1],[0,1])}) rotate(${interpolate(disfSpr,[0,1],[-6,0])}deg)`,
          display: 'inline-block',
          opacity: Math.min(disfSpr * 1.5, 1),
          textShadow: '0 4px 24px rgba(44,33,12,0.25)',
        }}>
          DISFRUTAR
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CURVED RIBBON SVG  con animación "draw-on"
          El clipPath empieza con ancho=0 y crece hacia la derecha,
          revelando la cinta como si se estuviera dibujando/pintando.
          ══════════════════════════════════════════════════════════════════════ */}
      <svg
        viewBox="0 0 1080 1920"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 4,
          pointerEvents: 'none',
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d0a06" />
            <stop offset="40%" stopColor="#1e1408" />
            <stop offset="100%" stopColor="#0d0a06" />
          </linearGradient>

          {/*
            clipPath rectangulo que crece de izquierda a derecha:
            x=0 siempre, width va de 0 → 1080 según ribbonProgress.
            Esto hace que la cinta "se dibuje" entrando desde el lado izquierdo.
          */}
          <clipPath id="ribbonReveal">
            <rect
              x="0"
              y="0"
              width={ribbonProgress}
              height="1920"
            />
          </clipPath>
        </defs>

        <path
          d="
            M 0 580
            C 270 460, 810 730, 1080 660
            L 1080 1160
            C 810 1240, 270 980, 0 1080
            Z
          "
          fill="#2c210c"
          clipPath="url(#ribbonReveal)"
        />
      </svg>

      {/* ══════════════════════════════════════════════════════════════════════
          VIDEO FRAME  — bounce-in + bounce/shake continuo
          ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', zIndex: 8 }}>
        <div style={{
          transform: `scale(${cardScale}) rotate(${bounceRot}deg) translateY(${bounceY}px)`,
          transformOrigin: 'center center',
          width: '640px',
          height: '800px',
          borderRadius: '28px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: [
            '0 0 0 10px #FFFFFF',
            '0 0 0 16px #d9cfc4',
            '0 0 0 20px #FFFFFF',
            '0 30px 80px rgba(0,0,0,0.55)',
          ].join(', '),
          backgroundColor: '#111',
          marginTop: 80,
        }}>
          <Sequence from={CLICK_FRAME + delay} layout="none">
            <OffthreadVideo
              src={staticFile('ultima_prueba_cfr.mp4')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              startFrom={0}
              volume={0}
            />
          </Sequence>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
            zIndex: 2,
          }} />
        </div>
      </AbsoluteFill>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM CAPTION
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute',
        bottom: 90,
        left: 60,
        right: 60,
        textAlign: 'center',
        zIndex: 10,
        opacity: captionOpacity,
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: sans,
          fontSize: 38,
          fontWeight: 400,
          color: '#6b5e50',
          lineHeight: 1.5,
          margin: 0,
          fontStyle: 'italic',
        }}>
          Nosotros nos encargamos de todo,{'\n'}vos solo disfrutá.
        </p>
      </div>
    </AbsoluteFill>
  );
};
