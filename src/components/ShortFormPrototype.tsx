import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, OffthreadVideo, staticFile, Img, Audio } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { Heart, MessageCircle, Send, Bookmark, Repeat, MoreHorizontal, MousePointer2 } from 'lucide-react';
import { PatrioticScene } from './PatrioticScene';
import { Logo } from './Logo';
import { PerfectCupAnimation } from './PerfectCupAnimation';
import { DisfrutarScene } from './DisfrutarScene';
const { fontFamily: sans } = loadMontserrat();


// ==========================================
// CONFIGURACIÓN DE DESACTIVACIÓN TEMPORAL (Toggles)
// (Permite desactivar fondos, decoraciones o escenas completas sin borrar código)
// ==========================================
const ENABLE_INTRO_BACKGROUND = true;     // Cambiar a true para reactivar los fondos patrióticos/video
const ENABLE_INTRO_DECORATIONS = true;     // Cambiar a true para reactivar taza y "el mejor café"
const ENABLE_FLAG_EMOJI = false;          // Cambiar a true para mostrar la mini bandera argentina antes de la taza
const ENABLE_SUBSEQUENT_SECTIONS = true;  // Cambiar a true para reactivar las secciones 2 a 6

// ==========================================
// 1. EFECTO STOP-MOTION / JITTER
// ==========================================
export const JitterElement: React.FC<{ children: React.ReactNode; amount?: number; speed?: number }> = ({ children, amount = 2, speed = 4 }) => {
  const frame = useCurrentFrame();
  const jitterFrame = Math.floor(frame / speed);

  const x = (Math.sin(jitterFrame * 12.3) * amount);
  const y = (Math.cos(jitterFrame * 45.6) * amount);
  const rot = (Math.sin(jitterFrame * 78.9) * (amount / 2));

  return (
    <div style={{ transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {children}
    </div>
  );
};





// ==========================================
// 2. TEXTURA DE PAPEL / GRANO
// ==========================================
const NoiseOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  if (!ENABLE_INTRO_BACKGROUND) return null;
  const noiseFrame = Math.floor(frame / 3);
  const opacity = interpolate(Math.sin(noiseFrame), [-1, 1], [0.03, 0.08]);

  return (
    <AbsoluteFill style={{
      pointerEvents: 'none',
      opacity: opacity,
      // eslint-disable-next-line @remotion/no-background-image
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      mixBlendMode: 'overlay',
      zIndex: 100
    }} />
  );
};

// ==========================================
// 2.1 ESCARAPELA ARGENTINA VECTORIAL
// ==========================================
const Escarapela: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Definición de un "pétalo" o segmento de la roseta (30 grados) */}
        <g id="petal-fill">
          {/* Celeste Exterior (con festón exterior e interior) */}
          <path d="M -25.8,-96.5 L -41.4,-154.5 A 45 45 0 0 1 41.4,-154.5 L 25.8,-96.5 A 35 35 0 0 0 -25.8,-96.5 Z" fill="#79CBEA" />
          {/* Blanco Medio (con festón exterior y círculo interior) */}
          <path d="M -9,-33.8 L -25.8,-96.5 A 35 35 0 0 1 25.8,-96.5 L 9,-33.8 A 35 35 0 0 0 -9,-33.8 Z" fill="#ffffff" />
          {/* Celeste Centro (círculo segmentado) */}
          <path d="M 0,0 L -9,-33.8 A 35 35 0 0 1 9,-33.8 Z" fill="#79CBEA" />
        </g>

        {/* Separador curvo entre el anillo celeste y el blanco */}
        <g id="scallop-separator">
          <path d="M -25.8,-96.5 A 35 35 0 0 1 25.8,-96.5" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
        </g>
      </defs>

      <g transform="translate(300, 300)">
        {/* 1. Capa de Color (12 Segmentos Base) */}
        <use href="#petal-fill" transform="rotate(0)" />
        <use href="#petal-fill" transform="rotate(30)" />
        <use href="#petal-fill" transform="rotate(60)" />
        <use href="#petal-fill" transform="rotate(90)" />
        <use href="#petal-fill" transform="rotate(120)" />
        <use href="#petal-fill" transform="rotate(150)" />
        <use href="#petal-fill" transform="rotate(180)" />
        <use href="#petal-fill" transform="rotate(210)" />
        <use href="#petal-fill" transform="rotate(240)" />
        <use href="#petal-fill" transform="rotate(270)" />
        <use href="#petal-fill" transform="rotate(300)" />
        <use href="#petal-fill" transform="rotate(330)" />

        {/* 2. Capa de Líneas Divisorias (Blancas) */}
        <circle cx="0" cy="0" r="35" fill="none" stroke="#ffffff" stroke-width="3.5" />

        <use href="#scallop-separator" transform="rotate(0)" />
        <use href="#scallop-separator" transform="rotate(30)" />
        <use href="#scallop-separator" transform="rotate(60)" />
        <use href="#scallop-separator" transform="rotate(90)" />
        <use href="#scallop-separator" transform="rotate(120)" />
        <use href="#scallop-separator" transform="rotate(150)" />
        <use href="#scallop-separator" transform="rotate(180)" />
        <use href="#scallop-separator" transform="rotate(210)" />
        <use href="#scallop-separator" transform="rotate(240)" />
        <use href="#scallop-separator" transform="rotate(270)" />
        <use href="#scallop-separator" transform="rotate(300)" />
        <use href="#scallop-separator" transform="rotate(330)" />

        {/* Líneas radiales rectas */}
        <g stroke="#ffffff" stroke-width="3.5" stroke-linecap="round">
          <line x1="0" y1="0" x2="0" y2="-158" transform="rotate(15)" />
          <line x1="0" y1="0" x2="0" y2="-158" transform="rotate(45)" />
          <line x1="0" y1="0" x2="0" y2="-158" transform="rotate(75)" />
          <line x1="0" y1="0" x2="0" y2="-158" transform="rotate(105)" />
          <line x1="0" y1="0" x2="0" y2="-158" transform="rotate(135)" />
          <line x1="0" y1="0" x2="0" y2="-158" transform="rotate(165)" />
          <line x1="0" y1="0" x2="0" y2="-158" transform="rotate(195)" />
          <line x1="0" y1="0" x2="0" y2="-158" transform="rotate(225)" />
          <line x1="0" y1="0" x2="0" y2="-158" transform="rotate(255)" />
          <line x1="0" y1="0" x2="0" y2="-158" transform="rotate(285)" />
          <line x1="0" y1="0" x2="0" y2="-158" transform="rotate(315)" />
          <line x1="0" y1="0" x2="0" y2="-158" transform="rotate(345)" />
        </g>
      </g>
    </svg>
  );
};

// ==========================================
// 3. FONDO PREMIUM DE PAPEL
// ==========================================
const WhitePaperBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
      {/* SVG para el filtro de ruido/textura de papel */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="paper-noise-bg">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.04 0" />
        </filter>
      </svg>

      {/* Fondo de papel texturizado con degradado radial, viñeta y destellos siempre activos */}
      <AbsoluteFill style={{
        background: 'radial-gradient(circle at center, #FFFFFF 0%, #ECEBE8 100%)',
        zIndex: 0,
      }}>
        {/* Capa de grano físico de papel */}
        <AbsoluteFill style={{
          filter: 'url(#paper-noise-bg)',
          opacity: 0.22,
          mixBlendMode: 'multiply'
        }} />

        {/* Viñeta oscura radial suave */}
        <AbsoluteFill style={{
          background: 'radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.15) 100%)',
          mixBlendMode: 'multiply',
          opacity: 0.65
        }} />

        {/* 4 ESCARAPELAS GIRATORIAS GRANDES EN CADA ESQUINA */}
        {/* Top-Left */}
        <div style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          top: '-400px',
          left: '-400px',
          transform: `rotate(${frame * 0.2}deg)`,
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.12))',
          opacity: 1,
          zIndex: 1,
        }}>
          <Escarapela />
        </div>

        {/* Top-Right */}
        <div style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          top: '-400px',
          right: '-400px',
          transform: `rotate(${-frame * 0.2}deg)`,
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.12))',
          opacity: 1,
          zIndex: 1,
        }}>
          <Escarapela />
        </div>

        {/* Bottom-Left */}
        <div style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          bottom: '-400px',
          left: '-400px',
          transform: `rotate(${-frame * 0.15}deg)`,
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.12))',
          opacity: 1,
          zIndex: 1,
        }}>
          <Escarapela />
        </div>

        {/* Bottom-Right */}
        <div style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          bottom: '-400px',
          right: '-400px',
          transform: `rotate(${frame * 0.15}deg)`,
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.12))',
          opacity: 1,
          zIndex: 1,
        }}>
          <Escarapela />
        </div>
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};

// ==========================================
// 3.1 TRANSICIÓN DE CÁMARA ESTILO AFTER EFFECTS
// ==========================================
const AEPanScene: React.FC<{
  children: React.ReactNode;
  inFrame?: number;
  outFrame?: number;
  directionIn?: 'left' | 'right' | 'up' | 'down';
  directionOut?: 'left' | 'right' | 'up' | 'down';
}> = ({ children, inFrame, outFrame, directionIn = 'left', directionOut = 'left' }) => {
  const frame = useCurrentFrame();

  // Calcular valores relativos locales para las transiciones
  const localInFrame = inFrame !== undefined ? 0 : undefined;
  const localOutFrame = (outFrame !== undefined && inFrame !== undefined)
    ? (outFrame - inFrame)
    : outFrame; // Si inFrame es undefined, asumimos que empieza en 0

  let translateX = 0;
  let translateY = 0;
  let blur = 0;

  if (localInFrame !== undefined) {
    const progressIn = interpolate(
      frame - localInFrame,
      [0, 36],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.85, 0, 0.15, 1),
      }
    );
    if (directionIn === 'left') {
      translateX = interpolate(progressIn, [0, 1], [1080, 0]);
    } else if (directionIn === 'right') {
      translateX = interpolate(progressIn, [0, 1], [-1080, 0]);
    } else if (directionIn === 'up') {
      translateY = interpolate(progressIn, [0, 1], [1920, 0]);
    } else if (directionIn === 'down') {
      translateY = interpolate(progressIn, [0, 1], [-1920, 0]);
    }

    if (frame - localInFrame <= 36) {
      blur = Math.sin(progressIn * Math.PI) * 15;
    }
  }

  if (localOutFrame !== undefined && frame >= localOutFrame) {
    const progressOut = interpolate(
      frame - localOutFrame,
      [0, 36],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.85, 0, 0.15, 1),
      }
    );
    if (directionOut === 'left') {
      translateX = interpolate(progressOut, [0, 1], [0, -1080]);
    } else if (directionOut === 'right') {
      translateX = interpolate(progressOut, [0, 1], [0, 1080]);
    } else if (directionOut === 'up') {
      translateY = interpolate(progressOut, [0, 1], [0, -1920]);
    } else if (directionOut === 'down') {
      translateY = interpolate(progressOut, [0, 1], [0, 1920]);
    }

    if (frame - localOutFrame <= 36) {
      blur = Math.sin(progressOut * Math.PI) * 15;
    }
  }

  const filterStyle = blur > 0.1 ? `blur(${blur}px)` : 'none';

  return (
    <AbsoluteFill style={{
      transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
      filter: filterStyle,
    }}>
      {children}
    </AbsoluteFill>
  );
};

// ==========================================
// 4. TEXTO DINÁMICO AVANZADO
// ==========================================
const ProCaption: React.FC<{ text: string; highlightWords?: string[]; theme?: 'light' | 'dark'; startFrame?: number; style?: React.CSSProperties }> = ({ text, highlightWords = [], theme = 'dark', startFrame = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  const customFontSize = style?.fontSize;
  const baseSize = customFontSize ? (typeof customFontSize === 'number' ? customFontSize : parseInt(String(customFontSize))) : 75;
  const highlightSize = Math.round(baseSize * 1.13);

  const containerStyle = { ...style };
  delete containerStyle.fontSize;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      width: '85%',
      position: 'absolute',
      bottom: theme === 'light' ? '15%' : '15%',
      left: '7.5%',
      gap: '12px',
      ...containerStyle
    }}>
      {words.map((word, index) => {
        const delay = index * 6;

        const scale = spring({ fps, frame: frame - startFrame - delay, config: { damping: 10, mass: 0.6 } });
        const rotation = interpolate(scale, [0, 1], [-15, 0], { extrapolateRight: 'clamp' });

        const isHighlight = highlightWords.some(hw => word.toLowerCase().includes(hw.toLowerCase()));

        // Color scheme: Vibrant Amber (#fbab4a) and Cream (#f7edb0)
        const defaultColor = '#fbab4a';
        const highlightColor = '#f7edb0';

        // Dark brown outline applied to both colors to ensure absolute contrast on any background
        const shadow = [
          '-3px -3px 0 #2c210c',
          '3px -3px 0 #2c210c',
          '-3px 3px 0 #2c210c',
          '3px 3px 0 #2c210c',
          '4px 4px 0 #2c210c',
          '5px 5px 0 #2c210c'
        ].join(', ');

        return (
          <span key={index} style={{
            fontSize: isHighlight ? `${highlightSize}px` : `${baseSize}px`,
            fontFamily: sans,
            fontWeight: isHighlight ? '900' : '700',
            fontStyle: 'normal',
            textTransform: 'uppercase',
            letterSpacing: 'normal',
            color: isHighlight ? highlightColor : defaultColor,
            textShadow: shadow,
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            display: 'inline-block',
            lineHeight: '1.1'
          }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ==========================================
// 5. COMPONENTES EXTRA DE MAYO 25
// ==========================================
const Particulas: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 18 }, (_, i) => {
    const seed = i * 137.508;
    const x = (Math.sin(seed) * 0.5 + 0.5) * 100;
    const speed = 0.3 + (i % 5) * 0.15;
    const y = ((frame * speed + seed * 3) % 110) - 10;
    const size = 6 + (i % 4) * 4;
    const color = ['#F6B40E', '#74ACDF', '#FFFFFF'][i % 3];
    const rotate = frame * (i % 2 === 0 ? 2 : -2) + i * 30;
    return { x, y, size, color, rotate };
  });
  return (
    <AbsoluteFill style={{ zIndex: 2, pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: 2,
          backgroundColor: p.color, opacity: 0.7,
          transform: `rotate(${p.rotate}deg)`,
        }} />
      ))}
    </AbsoluteFill>
  );
};

export const BouncingElement: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ fps, frame: frame - 5, config: { damping: 10, mass: 0.7 } });
  const scale = interpolate(pop, [0, 1], [0.5, 1]);
  return (
    <div style={{ transform: `scale(${scale})`, display: 'flex', justifyContent: 'center' }}>
      {children}
    </div>
  );
};

const VideoRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación de entrada inicial del rectangulo (escala desde 0.3 a 1.0 en frame 0-12)
  const introSpring = spring({
    fps,
    frame: frame - 0,
    config: { damping: 10, mass: 0.6 }
  });

  // Animación de agrandamiento / revelación (empieza en frame 40 para dar tiempo a ver el rectangulo)
  const growSpring = spring({
    fps,
    frame: frame - 40,
    config: { damping: 14, mass: 0.9 }
  });

  const scale = interpolate(introSpring, [0, 1], [0.3, 1]);

  // Interpolaciones de tamaño para el rectangulo redondo que se expande a pantalla completa
  const width = interpolate(growSpring, [0, 1], [700, 1080]);
  const height = interpolate(growSpring, [0, 1], [900, 1920]);
  const borderRadius = interpolate(growSpring, [0, 1], [50, 0]);
  const borderWidth = interpolate(growSpring, [0, 1], [10, 0]);

  // Barrido de destello de luz cinemático (comienza en frame 40)
  const sweepProgress = spring({
    fps,
    frame: frame - 40,
    config: { damping: 15, mass: 1.1 }
  });

  // El destello barre la pantalla de izquierda a derecha (ancho de 1080px, por lo que -1500px a 2000px)
  const sweepX = interpolate(sweepProgress, [0, 1], [-1500, 2000]);
  const sweepOpacity = interpolate(sweepProgress, [0, 0.15, 0.8, 1], [0, 0.95, 0.95, 0]);

  // Elevación de brillo de pantalla general (flash/sobreexposición sutil en el punto medio de la transición)
  const brightness = interpolate(sweepProgress, [0, 0.45, 1], [1, 1.22, 1]);

  return (
    <WhitePaperBackground>
      {/* Contenedor del contenido con filtro de brillo/exposición animado */}
      <div style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        filter: `brightness(${brightness})`,
        pointerEvents: 'none'
      }}>
        {/* Fondo patriótico sutil de fondo */}
        <PatrioticScene transparent={true} flagOpacity={0.25}>
          <Particulas />
        </PatrioticScene>

        {/* Contenedor del video con mascara de rectangulo redondeado que se expande */}
        <div style={{
          position: 'absolute',
          width: `${width}px`,
          height: `${height}px`,
          left: `${(1080 - width) / 2}px`,
          top: `${(1920 - height) / 2}px`,
          borderRadius: `${borderRadius}px`,
          border: `${borderWidth}px solid #FFFFFF`,
          overflow: 'hidden',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.5)',
          transform: `scale(${scale})`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 5,
          backgroundColor: '#000000'
        }}>
          <OffthreadVideo
            src={staticFile("test_vision_cfr.mp4")}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            startFrom={0}
            endAt={111}
            volume={0}
          />
        </div>
      </div>

      {/* Capa de Destello de Luz Cinemático (Puesta por encima de todo el video para simular destello de lente real) */}
      {frame >= 40 && (
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: `${sweepX}px`,
          width: '800px',
          height: '140%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(116,172,223,0.2) 15%, rgba(255,255,255,0.95) 45%, rgba(230,0,0,0.85) 55%, rgba(116,172,223,0.7) 72%, rgba(210,215,225,0.4) 85%, rgba(255,255,255,0) 100%)',
          transform: 'rotate(25deg)',
          opacity: sweepOpacity,
          filter: 'blur(30px)',
          mixBlendMode: 'screen',
          zIndex: 8,
          pointerEvents: 'none'
        }} />
      )}

      {/* Subtítulo Dinámico elegante en la parte inferior */}
      <ProCaption
        text="En cada celebración patria..."
        highlightWords={['celebración', 'patria...']}
        theme="light"
        startFrame={12}
        style={{
          zIndex: 10,
          bottom: '8%'
        }}
      />
    </WhitePaperBackground>
  );
};



// ==========================================
// SECCIÓN 3: REUNIÓN DE EQUIPO (MUÑECOS SVGS Y NEGOCIO)
// ==========================================
const TeamMeetingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Entrada inicial de los muñecos externos con stagger (salto rebote) y opacidad progresiva
  // Se retrasa para que no ocurra fuera de pantalla durante la transición de pan de entrada
  const topPop = spring({ fps, frame: frame - 30, config: { damping: 10, mass: 0.6 } });
  const midLPop = spring({ fps, frame: frame - 32, config: { damping: 10, mass: 0.6 } });
  const midRPop = spring({ fps, frame: frame - 34, config: { damping: 10, mass: 0.6 } });
  const botLPop = spring({ fps, frame: frame - 36, config: { damping: 10, mass: 0.6 } });
  const botRPop = spring({ fps, frame: frame - 38, config: { damping: 10, mass: 0.6 } });

  // Entrada del muñeco central
  const centerPop = spring({ fps, frame: frame - 30, config: { damping: 10, mass: 0.6 } });

  // 2. Animación de foco en el centro (crece y se reduce el resto) en el frame 110 (cuando dice "recordar")
  const focusSpring = spring({ fps, frame: frame - 110, config: { damping: 12, mass: 0.8 } });

  // 3. Salida inercial de la escena completa a partir del frame 143 (al final de la transición)
  const exitSpring = spring({ fps, frame: frame - 143, config: { damping: 12, mass: 0.8 } });

  // Interpolación de escala y opacidad para externos
  const outerScale = interpolate(focusSpring, [0, 1], [1, 0.5]);
  const baseOuterOpacity = interpolate(focusSpring, [0, 1], [1, 0.3]);

  // Opacidad combinada con la entrada y foco para cada muñeco externo
  const topOpacity = interpolate(topPop, [0, 1], [0, 1]) * baseOuterOpacity;
  const midLOpacity = interpolate(midLPop, [0, 1], [0, 1]) * baseOuterOpacity;
  const midROpacity = interpolate(midRPop, [0, 1], [0, 1]) * baseOuterOpacity;
  const botLOpacity = interpolate(botLPop, [0, 1], [0, 1]) * baseOuterOpacity;
  const botROpacity = interpolate(botRPop, [0, 1], [0, 1]) * baseOuterOpacity;

  // Opacidad del muñeco central
  const centerOpacity = interpolate(centerPop, [0, 1], [0, 1]);

  // Muñeco central escala (de 0.6 inicial a 1.5 destacado)
  const baseCenterScale = interpolate(focusSpring, [0, 1], [0.6, 1.5]);

  // Salida inercial global para toda la capa de muñecos
  const exitScale = interpolate(exitSpring, [0, 1], [1, 0]);

  // Pulso de resplandor blanco (de frame 80 a 110, preparándose antes del foco en "recordar")
  const glowPulse = frame >= 80 && frame <= 110
    ? Math.sin(((frame - 80) / 30) * Math.PI)
    : 0;

  // Sombra brillante en el centro animada (pasa de blanco a resplandor azul)
  const shadowSpread = interpolate(focusSpring, [0, 1], [interpolate(glowPulse, [0, 1], [20, 40]), 45]);
  const shadowGlowType = interpolate(focusSpring, [0, 1], [0, 1]);
  const baseCenterShadow = shadowGlowType > 0.5
    ? `drop-shadow(0 0 ${shadowSpread}px rgba(59,130,246,0.9))`
    : `drop-shadow(0 0 ${shadowSpread}px rgba(255,255,255,${interpolate(glowPulse, [0, 1], [0.8, 1.0])}))`;

  const centerShadow = centerPop > 0.01 ? baseCenterShadow : 'none';

  // Sombra con pulso para muñecos externos
  const shadowGlowSize = interpolate(glowPulse, [0, 1], [24, 48]);
  const outerShadow = `drop-shadow(0 0 ${shadowGlowSize}px rgba(255,255,255,${interpolate(glowPulse, [0, 1], [0.85, 1.0])}))`;

  // Video crece despacito de forma constante
  const videoScale = interpolate(frame, [0, 110], [1.0, 1.15]);

  // ── REBOTE Y GIRO FLUIDO (PENDULO) EN TEAM MEETING SCENE ──
  const entryRamp = interpolate(frame, [0, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Balanceo continuo más suave (giro) de ±2.5 grados y más lento (frecuencia 0.05)
  const cardRotation = Math.sin(frame * 0.05) * 2.5 * entryRamp;
  // Flotación continua vertical más sutil de ±4px y más lenta (frecuencia 0.05)
  const cardTranslateY = Math.cos(frame * 0.05) * 4 * entryRamp;

  // ── ANIMACIÓN DE BORDER/LÍNEA COMPLETÁNDOSE ──
  const borderLength = 3300;
  // El dibujo empieza a completarse desde el frame 10 al 110
  const drawProgress = interpolate(frame, [10, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  // Al inicio está cortada (solo 320px visible), y al final se completa a 3300px (sólida)
  const currentDash = interpolate(drawProgress, [0, 1], [320, borderLength]);
  const currentGap = borderLength - currentDash;
  const strokeDasharray = `${currentDash} ${currentGap}`;

  // Giro continuo de la línea a lo largo del recorrido
  const strokeDashoffset = -frame * 6;

  return (
    <WhitePaperBackground>
      {/* Fondo blanco completo para la sección solicitado por el usuario */}
      <AbsoluteFill style={{ backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>

        {/* Degradados y filtros de marca para el remarco y las sombras de luz (Celeste y Blanco Patriótico) */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <linearGradient id="brandBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" /> {/* Celeste Vibrante */}
              <stop offset="30%" stopColor="#ffffff" /> {/* Blanco Puro */}
              <stop offset="50%" stopColor="#60a5fa" /> {/* Celeste Cielo */}
              <stop offset="70%" stopColor="#ffffff" /> {/* Blanco Puro */}
              <stop offset="100%" stopColor="#0ea5e9" /> {/* Celeste Intenso */}
            </linearGradient>
          </defs>
        </svg>

        {/* Fondo brillante difuminado celeste y blanco (Efecto Backdrop Glow de la imagen de referencia) */}
        <div style={{
          position: 'absolute',
          width: '880px',
          height: '880px',
          borderRadius: '60px',
          background: 'linear-gradient(135deg, #38bdf8 0%, #ffffff 40%, #60a5fa 70%, #ffffff 100%)',
          filter: 'blur(45px)',
          opacity: 0.65,
          transform: `scale(${videoScale}) rotate(${cardRotation}deg) translateY(${cardTranslateY}px)`,
          zIndex: 0,
        }} />

        {/* Cuadrícula técnica de fondo (Estilo Blueprint del boceto de referencia, dibujada encima del brillo difuso) */}
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <defs>
            <pattern id="blueprint-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              {/* Líneas horizontales y verticales finas y claramente visibles */}
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="rgba(0, 0, 0, 0.16)" // Significativamente más oscuras y visibles
                strokeWidth="1.5"
              />
            </pattern>
            {/* Máscara radial expandida para cubrir perfectamente toda el área de muñecos y texto */}
            <radialGradient id="grid-fade" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="70%" stopColor="white" stopOpacity="0.85" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="grid-mask">
              <rect width="1080" height="1920" fill="url(#grid-fade)" />
            </mask>
          </defs>
          {/* Aplicación del patrón de cuadrícula por encima de la nube blanca difusa */}
          <rect
            width="1080"
            height="1920"
            fill="url(#blueprint-grid)"
            mask="url(#grid-mask)"
            style={{ opacity: 1.0 }} // Totalmente opaco para máxima definición de las celdas
          />
        </svg>

        {/* Contenedor del video con esquinas redondas gigantes, sombra suave y desenfoque */}
        <div style={{
          position: 'absolute',
          width: '850px',
          height: '850px',
          borderRadius: '50px',
          overflow: 'hidden',
          boxShadow: '0 30px 65px rgba(0, 0, 0, 0.15)',
          transform: `scale(${videoScale}) rotate(${cardRotation}deg) translateY(${cardTranslateY}px)`,
          filter: 'blur(6px)', // pequeño desenfoque solicitado
          opacity: 0.85,
          zIndex: 1,
          backgroundColor: '#F3F4F6'
        }}>
          <OffthreadVideo
            src={staticFile("reunion_equipo_cfr.mp4")}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            startFrom={0}
            endAt={165}
            volume={0}
          />
          {/* Capa de lavado blanco semi-transparente para atenuar sutilmente el video blurreado */}
          <AbsoluteFill style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
        </div>

        {/* Remarco cortado (borde segmentado animado) con degradado celeste/blanco que viaja alrededor del video redondeado */}
        <svg
          width="850"
          height="850"
          style={{
            position: 'absolute',
            zIndex: 2,
            pointerEvents: 'none',
            transform: `scale(${videoScale}) rotate(${cardRotation}deg) translateY(${cardTranslateY}px)`,
          }}
        >
          <rect
            x="3"
            y="3"
            width="844"
            height="844"
            rx="47"
            ry="47"
            fill="none"
            stroke="url(#brandBorderGradient)" // Degradado celeste y blanco patriótico
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray} // Segmentos elegantes cortados
            strokeDashoffset={strokeDashoffset} // Movimiento continuo anti-horario
            style={{
              filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.85))',
            }}
          />
        </svg>

        {/* Capa Interactiva de Muñecos Vectoriales */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 5,
          pointerEvents: 'none',
          opacity: exitScale
        }}>

          {/* Círculo contenedor de Muñecos (Agrandado a 650x650px y centrado de forma absoluta perfecta) */}
          <div style={{
            position: 'absolute',
            width: '650px',
            height: '650px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>

            {/* Muñeco 1: Superior (p-top) - Agrandado a 150px */}
            <svg
              viewBox="0 0 24 24"
              fill="white"
              style={{
                width: '150px',
                height: '150px',
                position: 'absolute',
                top: '0%',
                left: 'calc(50% - 75px)',
                transform: `scale(${topPop * outerScale})`,
                opacity: topOpacity,
                filter: outerShadow
              }}
            >
              <circle cx="12" cy="3" r="2.2" />
              <path d="M13.5 6.5h-3c-1.4 0-2.5 1.1-2.5 2.5v5h1.5v8h2.5v-7h1v7h2.5v-8h1.5v-5c0-1.4-1.1-2.5-2.5-2.5z" />
            </svg>

            {/* Muñeco 2: Medio Izquierdo (p-mid-l) - Agrandado a 150px */}
            <svg
              viewBox="0 0 24 24"
              fill="white"
              style={{
                width: '150px',
                height: '150px',
                position: 'absolute',
                top: '34%',
                left: '1%',
                transform: `scale(${midLPop * outerScale})`,
                opacity: midLOpacity,
                filter: outerShadow
              }}
            >
              <circle cx="12" cy="3" r="2.2" />
              <path d="M13.5 6.5h-3c-1.4 0-2.5 1.1-2.5 2.5v5h1.5v8h2.5v-7h1v7h2.5v-8h1.5v-5c0-1.4-1.1-2.5-2.5-2.5z" />
            </svg>

            {/* Muñeco 3: CENTRAL GRANDE (p-mid-c + Laptop + Escritorio) - Agrandado a 240px */}
            <svg
              viewBox="0 0 48 48"
              fill="white"
              style={{
                width: '240px',
                height: '240px',
                position: 'absolute',
                top: 'calc(50% - 120px)',
                left: 'calc(50% - 120px)',
                transform: `scale(${centerPop * baseCenterScale})`,
                opacity: centerOpacity,
                filter: centerShadow,
                zIndex: 10
              }}
            >
              <circle cx="24" cy="8" r="4" fill="white" />
              <path d="M27 15h-6c-2.2 0-4 1.8-4 4v8h2.5v12h4v-10h1v10h4v-12h2.5v-8c0-2.2-1.8-4-4-4z" fill="white" />
              {/* Escritorio elegante */}
              <path d="M10 26 h28 v4 h-28 z M12 30 h4 v18 h-4 z M32 30 h4 v18 h-4 z" fill="#94a3b8" />
              {/* Laptop que hace juego con el texto */}
              <path d="M21 21 h6 v5 h-6 z M19 25 h10 v1 h-10 z" fill="#3b82f6" />
            </svg>

            {/* Muñeco 4: Medio Derecho (p-mid-r) - Agrandado a 150px */}
            <svg
              viewBox="0 0 24 24"
              fill="white"
              style={{
                width: '150px',
                height: '150px',
                position: 'absolute',
                top: '34%',
                right: '1%',
                transform: `scale(${midRPop * outerScale})`,
                opacity: midROpacity,
                filter: outerShadow
              }}
            >
              <circle cx="12" cy="3" r="2.2" />
              <path d="M13.5 6.5h-3c-1.4 0-2.5 1.1-2.5 2.5v5h1.5v8h2.5v-7h1v7h2.5v-8h1.5v-5c0-1.4-1.1-2.5-2.5-2.5z" />
            </svg>

            {/* Muñeco 5: Inferior Izquierdo (p-bot-l) - Agrandado a 150px */}
            <svg
              viewBox="0 0 24 24"
              fill="white"
              style={{
                width: '150px',
                height: '150px',
                position: 'absolute',
                bottom: '0%',
                left: '12%',
                transform: `scale(${botLPop * outerScale})`,
                opacity: botLOpacity,
                filter: outerShadow
              }}
            >
              <circle cx="12" cy="3" r="2.2" />
              <path d="M13.5 6.5h-3c-1.4 0-2.5 1.1-2.5 2.5v5h1.5v8h2.5v-7h1v7h2.5v-8h1.5v-5c0-1.4-1.1-2.5-2.5-2.5z" />
            </svg>

            {/* Muñeco 6: Inferior Derecho (p-bot-r) - Agrandado a 150px */}
            <svg
              viewBox="0 0 24 24"
              fill="white"
              style={{
                width: '150px',
                height: '150px',
                position: 'absolute',
                bottom: '0%',
                right: '12%',
                transform: `scale(${botRPop * outerScale})`,
                opacity: botROpacity,
                filter: outerShadow
              }}
            >
              <circle cx="12" cy="3" r="2.2" />
              <path d="M13.5 6.5h-3c-1.4 0-2.5 1.1-2.5 2.5v5h1.5v8h2.5v-7h1v7h2.5v-8h1.5v-5c0-1.4-1.1-2.5-2.5-2.5z" />
            </svg>

          </div>

        </div>

      </AbsoluteFill>
    </WhitePaperBackground>
  );
};

// ==========================================
// GANCHO INICIAL (BLANCO)
// ==========================================
const HookIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance pops para la Parte 1
  const estePop = spring({ fps, frame: frame - 0, config: { damping: 10, mass: 0.6 } });
  const pop25 = spring({ fps, frame: frame - 12, config: { damping: 10, mass: 0.6 } });
  const dePop = spring({ fps, frame: frame - 22, config: { damping: 10, mass: 0.6 } });
  const mayoPop = spring({ fps, frame: frame - 28, config: { damping: 10, mass: 0.6 } });

  // Transición general en el frame 45
  const transition = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, mass: 1 },
  });

  // Movimiento hacia arriba de todo el contenedor
  const topPosition = interpolate(transition, [0, 1], [45, 12]);

  // Interpolación de "Este"
  const sizeEste = interpolate(transition, [0, 1], [75, 45]);
  const xEste = interpolate(transition, [0, 1], [-304, 0]);
  const yEste = interpolate(transition, [0, 1], [0, -55]);
  const spacingEste = interpolate(transition, [0, 1], [-2, 8]);

  // Interpolación de "25"
  const size25 = interpolate(transition, [0, 1], [85, 120]);
  const x25 = interpolate(transition, [0, 1], [-113, -317]);
  const y25 = interpolate(transition, [0, 1], [0, 20]);

  // Interpolación de "de"
  const sizeDe = interpolate(transition, [0, 1], [85, 120]);
  const xDe = interpolate(transition, [0, 1], [41, -108]);

  // Interpolación de "mayo"
  const sizeMayo = interpolate(transition, [0, 1], [85, 120]);
  const xMayo = interpolate(transition, [0, 1], [272, 209]);

  const showSecondPart = frame >= 45;

  // Zoom de cámara real (inicia en 1.08 para absorber el margen de seguridad de rotación y evitar bordes blancos)
  const cameraZoom = interpolate(
    frame,
    [0, 45, 65],
    [1.08, 1.28, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Inclinación suave de cámara para simular un paneo orgánico
  const cameraTilt = interpolate(
    frame,
    [0, 45, 65],
    [-2, 2, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Opacidad para desvanecer suavemente los elementos de la intro de papel (tarjeta, viñeta, estrellas) - No longer needed, kept active for premium texture

  // Animación del emoji bandera
  // Entra en 45, sale en 75
  const popFlagIn = spring({
    frame: frame - 45,
    fps,
    config: { damping: 12 },
  });
  const popFlagOut = spring({
    frame: frame - 71, // empieza a encoger un poco antes de 75
    fps,
    config: { damping: 12 },
  });
  const flagScale = interpolate(popFlagOut, [0, 1], [popFlagIn, 0]);

  // Mini flash de desenfoque al convertirse en título (frame 45)
  const blurTransition = interpolate(frame, [41, 45, 49], [0, 10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const brightnessTransition = interpolate(frame, [41, 45, 49], [1, 1.4, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const introShadow = [
    '-4px -4px 0 #111111',
    '4px -4px 0 #111111',
    '-4px 4px 0 #111111',
    '4px 4px 0 #111111',
    '5px 5px 0 #111111',
    '6px 6px 0 #111111'
  ].join(', ');

  return (
    <WhitePaperBackground>
      {/* Contenedor de Cámara Interno (evita fugas y bordes blancos al rotar o hacer zoom) */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        transform: `scale(${cameraZoom}) rotate(${cameraTilt}deg)`,
        transformOrigin: 'center center',
        filter: `blur(${blurTransition}px) brightness(${brightnessTransition})`,
      }}>

        {/* Título superior animado */}
        <AbsoluteFill style={{ alignItems: 'center', top: `${topPosition}%`, zIndex: 5 }}>
          <div style={{ position: 'relative', width: '800px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              position: 'absolute',
              fontFamily: sans,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              fontSize: `${sizeEste}px`,
              letterSpacing: `${spacingEste}px`,
              transform: `translate(${xEste}px, ${yEste}px) scale(${estePop})`,
              lineHeight: '1',
              textShadow: introShadow,
            }}>
              Este
            </div>

            <div style={{
              position: 'absolute',
              fontFamily: sans,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: '#74ACDF',
              fontSize: `${size25}px`,
              transform: `translate(${x25}px, ${y25}px) scale(${pop25})`,
              lineHeight: '1',
              whiteSpace: 'nowrap',
              textShadow: introShadow,
            }}>
              25
            </div>

            {/* de */}
            <div style={{
              position: 'absolute',
              fontFamily: sans,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: '#74ACDF',
              fontSize: `${sizeDe}px`,
              transform: `translate(${xDe}px, ${y25}px) scale(${dePop})`,
              lineHeight: '1',
              whiteSpace: 'nowrap',
              textShadow: introShadow,
            }}>
              de
            </div>

            {/* mayo */}
            <div style={{
              position: 'absolute',
              fontFamily: sans,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: '#74ACDF',
              fontSize: `${sizeMayo}px`,
              transform: `translate(${xMayo}px, ${y25}px) scale(${mayoPop})`,
              lineHeight: '1',
              whiteSpace: 'nowrap',
              textShadow: introShadow,
            }}>
              mayo
            </div>
          </div>
        </AbsoluteFill>

        {/* Taza de Café Perfecta (se monta desde el principio para la intro de la bandera) */}
        {ENABLE_INTRO_DECORATIONS && (
          <Sequence durationInFrames={!ENABLE_SUBSEQUENT_SECTIONS ? 750 : 201} layout="none">
            <AbsoluteFill style={{
              alignItems: 'center',
              justifyContent: 'center',
              top: '3.5%',
              zIndex: 4,
              filter: !ENABLE_INTRO_BACKGROUND ? 'drop-shadow(0 35px 80px rgba(116, 172, 223, 0.4)) drop-shadow(0 15px 35px rgba(0, 0, 0, 0.08))' : 'none'
            }}>
              <PerfectCupAnimation size={1450} />
            </AbsoluteFill>
          </Sequence>
        )}

        {/* Contenido dinámico del centro */}
        {showSecondPart && (
          <>
            {/* Bandera argentina chiquita (solo de 45 a 75) */}
            {ENABLE_INTRO_DECORATIONS && ENABLE_FLAG_EMOJI && frame < 75 && (
              <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: '-5%', zIndex: 4 }}>
                <div style={{ transform: `scale(${flagScale})`, fontSize: '130px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))' }}>
                  🇦🇷
                </div>
              </AbsoluteFill>
            )}

            {/* Subtítulos combinados y secuenciales en la parte inferior */}
            <div style={{
              position: 'absolute',
              bottom: !ENABLE_INTRO_DECORATIONS ? '35%' : '12%',
              left: '5%',
              width: '90%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              zIndex: 10
            }}>
              {/* tu evento merece */}
              <ProCaption
                text="tu evento merece"
                highlightWords={['evento', 'merece']}
                theme={!ENABLE_INTRO_BACKGROUND ? 'light' : 'dark'}
                startFrame={60}
                style={{ position: 'relative', bottom: 'auto', left: 'auto', width: '100%', zIndex: 11 }}
              />
              {/* el mejor café (aparece en 90) */}
              {ENABLE_INTRO_DECORATIONS && frame >= 90 && (
                <ProCaption
                  text="el mejor café"
                  highlightWords={['café']}
                  theme={!ENABLE_INTRO_BACKGROUND ? 'light' : 'dark'}
                  startFrame={90}
                  style={{ position: 'relative', bottom: 'auto', left: 'auto', width: '100%', zIndex: 12 }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </WhitePaperBackground>
  );
};


// ==========================================
// MOCKUP INTERACTIVO DE PRESENTACIÓN DE CATERING
// ==========================================
export const InteractivePresentationMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glass Shine Animation Sync
  const shineProgress = spring({
    frame: frame - 90, // sync to Like click
    fps: 30,
    config: { damping: 14, stiffness: 80 }
  });
  const shineLeft = interpolate(shineProgress, [0, 1], [-150, 150]);
  const shineOpacity = interpolate(shineProgress, [0, 0.1, 0.9, 1], [0, 0.45, 0.45, 0]);

  // Balanceo Tridimensional Premium (3D Floating Tilt)
  const floatRotateY = Math.sin(frame * 0.04) * 3.5;
  const floatRotateX = Math.cos(frame * 0.035) * 2.2 + 4.5;
  const floatRotateZ = Math.sin(frame * 0.025) * 1.2;

  // Clicking Press scale and Translate Z to mimic click depth
  const clickPress1 = spring({
    frame: frame - 60, // first swipe click (shifted by 30 frames)
    fps: 30,
    config: { damping: 7, stiffness: 220 },
  });
  const pressScale1 = interpolate(clickPress1, [0, 0.4, 1], [1, 0.94, 1]);
  const pressTranslateZ1 = interpolate(clickPress1, [0, 0.4, 1], [0, -40, 0]);

  const clickPressLike = spring({
    frame: frame - 90, // like click (shifted by 30 frames)
    fps: 30,
    config: { damping: 7, stiffness: 220 },
  });
  const pressScaleLike = interpolate(clickPressLike, [0, 0.4, 1], [1, 0.92, 1]);
  const pressTranslateZLike = interpolate(clickPressLike, [0, 0.4, 1], [0, -50, 0]);

  const clickPress2 = spring({
    frame: frame - 121, // second swipe click (shifted to match 16.20s / frame 121 local)
    fps: 30,
    config: { damping: 7, stiffness: 220 },
  });
  const pressScale2 = interpolate(clickPress2, [0, 0.4, 1], [1, 0.94, 1]);
  const pressTranslateZ2 = interpolate(clickPress2, [0, 0.4, 1], [0, -40, 0]);

  let finalPressScale = 1;
  let finalPressTranslateZ = 0;
  if (frame < 80) { // shifted by 30 frames
    finalPressScale = pressScale1;
    finalPressTranslateZ = pressTranslateZ1;
  } else if (frame < 110) { // shifted by 30 frames
    finalPressScale = pressScaleLike;
    finalPressTranslateZ = pressTranslateZLike;
  } else {
    finalPressScale = pressScale2;
    finalPressTranslateZ = pressTranslateZ2;
  }

  // Slide positions (Transitions align precisely with cursor dragging)
  const transitionSpring1 = spring({
    frame: frame - 65, // shifted by 30 frames
    fps: 30,
    config: { damping: 15, stiffness: 90 }
  });
  const transitionSpring2 = spring({
    frame: frame - 126, // shifted to align with third click drag starting at 126
    fps: 30,
    config: { damping: 15, stiffness: 90 }
  });

  const slide0X = interpolate(transitionSpring1, [0, 1], [0, -100]);
  const slide1X = interpolate(transitionSpring2, [0, 1], [
    interpolate(transitionSpring1, [0, 1], [100, 0]),
    -100
  ]);
  const slide2X = interpolate(transitionSpring2, [0, 1], [100, 0]);

  // Slides scale Ken-Burns
  const graphicScale0 = interpolate(frame, [0, 75], [1.02, 1.08], { extrapolateRight: 'clamp' }); // shifted by 30 frames
  const graphicScale1 = interpolate(frame, [75, 136], [1.02, 1.08], { extrapolateRight: 'clamp' }); // shifted by 30 frames
  const graphicScale2 = interpolate(frame, [136, 186], [1.02, 1.08], { extrapolateRight: 'clamp' }); // shifted by 30 frames

  // Like pop and comments / repost / shares wiggles
  const likeSpring = spring({
    frame: frame - 90, // shifted by 30 frames
    fps: 30,
    config: { damping: 8, stiffness: 200 }
  });
  const likeIconScale = frame >= 90 // shifted by 30 frames
    ? interpolate(likeSpring, [0, 0.4, 0.8, 1], [1.0, 1.45, 0.95, 1.0])
    : 1.0;

  const commentWobble = Math.sin(frame * 0.3) * 3 * interpolate(frame, [5, 25], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const shareWobble = Math.sin((frame - 80) * 0.3) * 4 * interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * interpolate(frame, [95, 100], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Carousel dot sizes & colors
  const dot0Size = interpolate(transitionSpring1, [0, 1], [14, 8]);
  const dot1Size = frame < 90
    ? interpolate(transitionSpring1, [0, 1], [8, 14])
    : interpolate(transitionSpring2, [0, 1], [14, 8]);
  const dot2Size = interpolate(transitionSpring2, [0, 1], [8, 14]);

  const dot0Color = frame < 70 ? '#74ACDF' : 'rgba(116, 172, 223, 0.45)';
  const dot1Color = frame >= 70 && frame < 130 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)';
  const dot2Color = frame >= 130 ? '#74ACDF' : 'rgba(116, 172, 223, 0.45)';

  // Big Heart pop on click
  const bigHeartScale = interpolate(frame, [90, 95, 102, 115], [0, 1.4, 1.2, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bigHeartOpacity = interpolate(frame, [90, 93, 102, 115], [0, 0.95, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const bigPulseScale = interpolate(frame, [90, 115], [0.8, 1.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bigPulseOpacity = frame >= 90 ? interpolate(frame, [90, 115], [0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;

  const isLiked = frame >= 90;
  const likesCount = 1552 + (isLiked ? 1 : 0);

  // Particles
  const likeParticles = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * Math.PI) / 4 + 0.25;
    const progress = spring({
      frame: frame - 90,
      fps: 30,
      config: { damping: 8, stiffness: 120 }
    });
    const distance = interpolate(progress, [0, 1], [0, 65 + (i % 2) * 25]);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const opacity = interpolate(progress, [0, 0.7, 1], [1, 1, 0]);
    const scale = interpolate(progress, [0, 1], [0.3, 1.2]);
    const emoji = i % 2 === 0 ? '✨' : '❤️';
    return { x, y, opacity, scale, emoji };
  });

  // Cursor positions within the 375x667 coordinate system (all shifted to make slide 1 last longer)
  const cursorOpacity = interpolate(frame, [0, 10, 150, 165], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  let cursorX = 300;
  let cursorY = 650;
  let cursorScale = 1;

  if (frame < 45) { // cursor waits longer at start position
    cursorX = 300;
    cursorY = 650;
    cursorScale = 1;
  } else if (frame < 60) {
    cursorX = interpolate(frame, [45, 60], [300, 280]);
    cursorY = interpolate(frame, [45, 60], [650, 320]);
    cursorScale = 1;
  } else if (frame < 65) {
    cursorX = 280;
    cursorY = 320;
    cursorScale = interpolate(frame, [60, 65], [1, 0.85]);
  } else if (frame < 75) {
    cursorX = interpolate(frame, [65, 75], [280, 80]);
    cursorY = 320;
    cursorScale = 0.85;
  } else if (frame < 80) {
    cursorX = 80;
    cursorY = 320;
    cursorScale = interpolate(frame, [75, 80], [0.85, 1]);
  } else if (frame < 90) {
    cursorX = interpolate(frame, [80, 90], [80, 30]);
    cursorY = interpolate(frame, [80, 90], [320, 584]);
    cursorScale = 1;
  } else if (frame < 95) {
    cursorX = 30;
    cursorY = 584;
    cursorScale = interpolate(frame, [90, 95], [1, 0.8]);
  } else if (frame < 100) {
    cursorX = 30;
    cursorY = 584;
    cursorScale = interpolate(frame, [95, 100], [0.8, 1]);
  } else if (frame < 121) {
    cursorX = interpolate(frame, [100, 121], [30, 280]);
    cursorY = interpolate(frame, [100, 121], [584, 320]);
    cursorScale = 1;
  } else if (frame < 126) {
    cursorX = 280;
    cursorY = 320;
    cursorScale = interpolate(frame, [121, 126], [1, 0.85]);
  } else if (frame < 136) {
    cursorX = interpolate(frame, [126, 136], [280, 80]);
    cursorY = 320;
    cursorScale = 0.85;
  } else if (frame < 141) {
    cursorX = 80;
    cursorY = 320;
    cursorScale = interpolate(frame, [136, 141], [0.85, 1]);
  } else {
    cursorX = interpolate(frame, [141, 165], [80, 350], { extrapolateRight: 'clamp' });
    cursorY = interpolate(frame, [141, 165], [320, 750], { extrapolateRight: 'clamp' });
    cursorScale = 1;
  }

  // Animation for social action icons (Entrance bounce & continuous float)
  const getIconStyle = (delay: number, floatOffset: number) => {
    const localFrame = frame - delay;
    const scale = localFrame < 0 ? 0 : spring({
      frame: localFrame,
      fps,
      config: {
        damping: 12,
        stiffness: 110,
        mass: 0.5,
      }
    });

    const floatY = Math.sin((frame + floatOffset) * 0.07) * 1.2 * scale;
    const floatRotate = Math.cos((frame + floatOffset) * 0.05) * 0.8 * scale;

    return {
      transform: `scale(${scale}) translateY(${floatY}px) rotate(${floatRotate}deg)`,
      display: 'inline-block',
      transformOrigin: 'center',
    };
  };

  const slidesData = [
    {
      img: staticFile("desenfoca_el_fondo_y_darle_202605181816.png"),
      x: slide0X,
      scale: graphicScale0
    },
    {
      img: staticFile("mejora_la_calidad_y_hazla_202605181816.png"),
      x: slide1X,
      scale: graphicScale1
    },
    {
      img: staticFile("mejora_la_calidad_2K_202605181826.png"),
      x: slide2X,
      scale: graphicScale2
    }
  ];

  return (
    <WhitePaperBackground>
      <AbsoluteFill className="flex justify-center items-center overflow-hidden select-none" style={{ backgroundColor: 'transparent' }}>


        {/* CSS CUSTOM STYLES & KEYFRAMES */}
        <style>{`
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(99, 102, 241, 0.4); box-shadow: 0 0 15px rgba(99, 102, 241, 0.15); }
          50% { border-color: rgba(239, 68, 68, 0.3); box-shadow: 0 0 20px rgba(239, 68, 68, 0.1); }
        }
        @keyframes popIn {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          70% { transform: scale(1.25) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0) rotate(-15deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-20px) rotate(-15deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) rotate(-10deg); }
          50% { transform: translateY(-12px) rotate(-5deg); }
        }
        @keyframes glassShine {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(150%) skewX(-12deg); }
        }
        @keyframes cursorRipple {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        /* Las animaciones circulares se manejan con frame-based JS (ver SVG inline styles) */
      `}</style>

        {/* BACKGROUND GLOW CIRCLES */}
        <div className="absolute top-1/3 left-1/4 w-[80vw] h-[80vw] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[80vw] h-[80vw] bg-red-600/3 rounded-full blur-[150px] pointer-events-none" />

        {/* 3D FLOATING SCALED WRAPPER FOR 1080x1920 VIEWPORT */}
        <div
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d',
            zIndex: 10,
            pointerEvents: 'none',
            transform: `perspective(1200px) rotateX(${floatRotateX}deg) rotateY(${floatRotateY}deg) rotateZ(${floatRotateZ}deg) scale(${finalPressScale * 2.4}) translateZ(${finalPressTranslateZ}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Sleek borderless mockup container in light theme */}
          <div className="relative w-[375px] h-[570px] bg-[#FFFFFF] flex flex-col justify-start p-4 mx-auto rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {/* Profile Image & Gold border */}
                <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-red-500">
                  <Img
                    src={staticFile("assets/logoAmarillo.png")}
                    className="w-full h-full object-cover rounded-full border border-white"
                    style={{ backgroundColor: '#2c210c' }}
                    alt="Avatar"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-slate-800 tracking-tight">aromaacafe_</span>
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      <Escarapela />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Hace 2 horas</span>
                </div>
              </div>

              <button className="text-slate-400">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* PHOTO / CAROUSEL */}
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.04)] border border-slate-100 bg-[#F8F9FA] mt-3">

              {/* GLASS SHINE EFFECT */}
              <div
                className="absolute top-0 bottom-0 w-[150%] z-45 pointer-events-none mix-blend-overlay"
                style={{
                  left: `${shineLeft}%`,
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
                  opacity: shineOpacity,
                  transform: 'skewX(-12deg)',
                }}
              />

              {/* SLIDES */}
              {slidesData.map((slide, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex justify-center items-center"
                  style={{
                    transform: `translateX(${slide.x}%)`,
                  }}
                >
                  {/* SVG Círculo animado (circulo.html) como fondo */}
                  <div
                    className="absolute w-[95%] aspect-square flex items-center justify-center pointer-events-none z-1"
                    style={{
                      transform: 'scale(1.25) translate3d(0,0,0)',
                      opacity: interpolate(
                        Math.abs(slide.x),
                        [0, 10, 90, 100],
                        [0.85, 0.85, 0, 0],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                      ),
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <svg
                      viewBox="0 0 200 200"
                      className="w-full h-full"
                      shapeRendering="geometricPrecision"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <g>
                        {/* Centro — opacidad pulso basado en frame */}
                        <circle
                          cx="100" cy="100" r="6"
                          fill="#0ea5e9"
                          opacity={0.3 + 0.7 * (0.5 + 0.5 * Math.sin((frame / 30) * (Math.PI * 2) / 4))}
                          style={{ transformOrigin: 'center' }}
                        />

                        {/* Pista Interior 1 — gira 1 vuelta cada 8s */}
                        <circle
                          cx="100" cy="100" r="35"
                          fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 8"
                          style={{
                            transformOrigin: 'center',
                            transform: `rotate(${(frame / 30) * (360 / 8)}deg)`,
                          }}
                        />

                        {/* Pista Interior 2 — gira inverso 1 vuelta cada 15s */}
                        <circle
                          cx="100" cy="100" r="55"
                          fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth={2} strokeDasharray="40 20 10 20"
                          style={{
                            transformOrigin: 'center',
                            transform: `rotate(${-(frame / 30) * (360 / 15)}deg)`,
                          }}
                        />

                        {/* Pista Intermedia Celeste — gira lento 1 vuelta cada 30s */}
                        <circle
                          cx="100" cy="100" r="75"
                          fill="none" stroke="#7dd3fc" strokeWidth={0.5}
                          style={{
                            transformOrigin: 'center',
                            transform: `rotate(${(frame / 30) * (360 / 30)}deg)`,
                          }}
                        />

                        {/* Pista Exterior Dinámica — dashoffset animado + gira inverso */}
                        {(() => {
                          const t = (frame / 30) % 3.5 / 3.5; // ciclo de 3.5s
                          const dashOffset = t < 0.5
                            ? interpolate(t, [0, 0.5], [565, 0])
                            : interpolate(t, [0.5, 1], [0, -565]);
                          const rotDeg = -(frame / 30) * (360 / 12);
                          return (
                            <circle
                              cx="100" cy="100" r="90"
                              fill="none" stroke="#0ea5e9" strokeWidth={2.5}
                              strokeLinecap="butt" strokeDasharray="565"
                              strokeDashoffset={dashOffset}
                              style={{
                                transformOrigin: 'center',
                                transform: `rotate(${rotDeg}deg)`,
                              }}
                            />
                          );
                        })()}
                      </g>
                    </svg>
                  </div>

                  {/* SVG Cuadrícula de Puntitos (Dots Grid) de Fondo */}
                  <div
                    className="absolute w-[80%] h-[80%] flex items-center justify-center pointer-events-none z-1"
                    style={{
                      opacity: interpolate(
                        Math.abs(slide.x),
                        [0, 10, 90, 100],
                        [0.22, 0.22, 0, 0],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                      ),
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <svg
                      viewBox="0 0 200 200"
                      className="w-full h-full"
                      shapeRendering="geometricPrecision"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <defs>
                        <pattern id={`dot-grid-pattern-${i}`} width="14" height="14" patternUnits="userSpaceOnUse">
                          <circle cx="7" cy="7" r="1.2" fill="#64748b" />
                        </pattern>
                        <radialGradient id={`dot-grid-fade-${i}`} cx="50%" cy="50%" r="45%">
                          <stop offset="0%" stopColor="white" stopOpacity="1" />
                          <stop offset="65%" stopColor="white" stopOpacity="0.75" />
                          <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </radialGradient>
                        <mask id={`dot-grid-mask-${i}`}>
                          <rect width="200" height="200" fill={`url(#dot-grid-fade-${i})`} />
                        </mask>
                      </defs>
                      <rect width="200" height="200" fill={`url(#dot-grid-pattern-${i})`} mask={`url(#dot-grid-mask-${i})`} />
                    </svg>
                  </div>

                  <Img
                    src={slide.img}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: `scale(${slide.scale})`,
                      position: 'relative',
                      zIndex: 2,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d',
                    }}
                    alt={`Slide ${i}`}
                  />
                </div>
              ))}

              {/* BIG HEART DOUBLE-TAP POP */}
              <div className="absolute inset-0 flex justify-center items-center z-25 pointer-events-none">
                {bigPulseOpacity > 0 && (
                  <div
                    className="absolute rounded-full border-2 border-white/60"
                    style={{
                      width: '150px',
                      height: '150px',
                      transform: `scale(${bigPulseScale})`,
                      opacity: bigPulseOpacity,
                      boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                    }}
                  />
                )}

                <svg
                  viewBox="0 0 24 24"
                  className="w-24 h-24 fill-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                  style={{
                    transform: `scale(${bigHeartScale})`,
                    opacity: bigHeartOpacity,
                  }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>

            {/* ACTION BAR */}
            <div className="flex items-center justify-between px-2 py-3 text-slate-500 border-t border-slate-100 mt-2">
              <div className="flex items-center gap-6">
                {/* Like Button & Particles */}
                <div className="relative" style={getIconStyle(36, 0)}>
                  <div
                    className="flex items-center gap-2 hover:text-red-500 transition-colors duration-300"
                    style={{ transform: `scale(${likeIconScale})` }}
                  >
                    <Heart className={`w-6 h-6 transition-all duration-300 ${isLiked ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
                    <span className="text-sm font-semibold text-slate-600">{likesCount.toLocaleString()}</span>
                  </div>

                  {/* Like Click Particles */}
                  {frame >= 90 && frame < 120 && (
                    <div className="absolute left-[12px] top-[12px] pointer-events-none z-30">
                      {likeParticles.map((p, idx) => (
                        <span
                          key={idx}
                          className="absolute inline-block text-xl select-none"
                          style={{
                            left: `${p.x}px`,
                            top: `${p.y}px`,
                            opacity: p.opacity,
                            transform: `translate(-50%, -50%) scale(${p.scale})`,
                          }}
                        >
                          {p.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments */}
                <div
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                  style={{
                    ...getIconStyle(40, 30),
                    transform: `${getIconStyle(40, 30).transform} rotate(${commentWobble}deg)`
                  }}
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-sm font-semibold text-slate-600">28</span>
                </div>

                {/* Reposts */}
                <div className="flex items-center gap-2 hover:text-green-400 transition-colors" style={getIconStyle(44, 60)}>
                  <Repeat className="w-6 h-6" />
                  <span className="text-sm font-semibold text-slate-600">245</span>
                </div>

                {/* Shares */}
                <div
                  className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
                  style={{
                    ...getIconStyle(48, 90),
                    transform: `${getIconStyle(48, 90).transform} rotate(${-shareWobble}deg) translate(${shareWobble}px, ${-shareWobble}px)`
                  }}
                >
                  <Send className="w-6 h-6" />
                  <span className="text-sm font-semibold text-slate-600">155</span>
                </div>
              </div>

              <button className="hover:text-yellow-500 transition-colors text-slate-500" style={getIconStyle(52, 120)}>
                <Bookmark className="w-6 h-6" />
              </button>
            </div>

            {/* DOTS INDICATOR */}
            <div className="flex justify-center items-center gap-2 py-1 z-10">
              <span
                className="rounded-full transition-all duration-150 border border-slate-200 shadow-sm"
                style={{
                  width: `${dot0Size}px`,
                  height: `${dot0Size}px`,
                  backgroundColor: dot0Color,
                }}
              />
              <span
                className="rounded-full transition-all duration-150 border border-slate-200 shadow-sm"
                style={{
                  width: `${dot1Size}px`,
                  height: `${dot1Size}px`,
                  backgroundColor: dot1Color,
                }}
              />
              <span
                className="rounded-full transition-all duration-150 border border-slate-200 shadow-sm"
                style={{
                  width: `${dot2Size}px`,
                  height: `${dot2Size}px`,
                  backgroundColor: dot2Color,
                }}
              />
            </div>

            {/* CAPTION (Commented out to keep the card clean and prevent subtitle overlap) */}
            {/*
          <div className="px-2 pb-2 text-slate-600 space-y-2 mt-2 select-none">
            <div className="text-sm leading-relaxed text-left">
              <span className="font-bold text-slate-800 mr-2">aromaacafe_</span>
              Llevamos el mejor café a tu evento. ☕️✨
            </div>
            <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase text-left">
              HACE 2 HORAS
            </div>
          </div>
          */}

            {/* CURSOR ANIMADO GIGANTE (Scale-aligned relative coordinate pointer) */}
            {cursorOpacity > 0 && (
              <div
                className="absolute z-50 pointer-events-none"
                style={{
                  left: `${cursorX}px`,
                  top: `${cursorY}px`,
                  opacity: cursorOpacity,
                  transform: `scale(${cursorScale}) translate(-15px, -15px)`,
                  filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.35))',
                }}
              >
                <MousePointer2 className="w-8 h-8 text-white fill-black stroke-white" />

                {/* Click pulse ring — frame-based, no CSS animation */}
                {((frame >= 60 && frame < 68) || (frame >= 90 && frame < 98) || (frame >= 121 && frame < 129)) && (() => {
                  const clickStart = frame >= 121 ? 121 : frame >= 90 ? 90 : 60;
                  const localF = frame - clickStart;
                  const scale = interpolate(localF, [0, 7], [0.5, 2.2], { extrapolateRight: 'clamp' });
                  const opacity = interpolate(localF, [0, 7], [0.9, 0], { extrapolateRight: 'clamp' });
                  return (
                    <div
                      className="absolute rounded-full border border-white pointer-events-none"
                      style={{
                        width: 40, height: 40,
                        top: -4, left: -4,
                        transform: `scale(${scale})`,
                        opacity,
                      }}
                    />
                  );
                })()}
              </div>
            )}

          </div>
        </div>
      </AbsoluteFill>
    </WhitePaperBackground>
  );
};



const FinalCTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSp = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const ctaSp = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const urgSp = spring({ frame: frame - 55, fps, config: { damping: 10 } });

  const pulse = 1 + Math.sin(frame * 0.2) * 0.025;

  const particles = Array.from({ length: 18 }, (_, i) => {
    const seed = i * 137.508;
    const x = (Math.sin(seed) * 0.5 + 0.5) * 100;
    const speed = 0.3 + (i % 5) * 0.15;
    const y = ((frame * speed + seed * 3) % 110) - 10;
    const size = 6 + (i % 4) * 4;
    const color = ['#fbab4a', '#74ACDF', '#2c210c'][i % 3];
    const rotate = frame * (i % 2 === 0 ? 2 : -2) + i * 30;
    return { x, y, size, color, rotate };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background radial glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(251, 171, 74, 0.08) 0%, transparent 65%)`,
      }} />

      {/* Partículas adaptadas para fondo claro */}
      <AbsoluteFill style={{ zIndex: 2, pointerEvents: 'none' }}>
        {particles.map((p, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: 2,
            backgroundColor: p.color, opacity: 0.25,
            transform: `rotate(${p.rotate}deg)`,
          }} />
        ))}
      </AbsoluteFill>

      {/* Overlay sutil abajo */}
      <AbsoluteFill style={{
        background: 'linear-gradient(to top, rgba(255,255,255,0.8) 0%, transparent 60%)',
        zIndex: 1,
      }} />

      {/* Contenido central */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        gap: 0, padding: '0 60px',
      }}>
        {/* Contenedor relativo con la escala original del logo (0.7 a 0.75) */}
        <div style={{
          position: 'relative',
          width: 800,
          height: 800,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${interpolate(logoSp, [0, 1], [0.7, 0.75])})`,
          opacity: logoSp,
          marginBottom: 20,
        }}>
          {/* Círculo entrecortado animado (amarillo) */}
          <svg
            width="800"
            height="800"
            style={{
              position: 'absolute',
              transform: `rotate(${frame * 0.6}deg)`,
              zIndex: 1,
            }}
          >
            <circle
              cx="400"
              cy="400"
              r="380"
              fill="none"
              stroke="#fbab4a"
              strokeWidth="9"
              strokeDasharray="32, 22"
              strokeLinecap="round"
            />
          </svg>

          {/* Logo colorizado en marrón oscuro mediante CSS filter */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            filter: 'brightness(0) saturate(100%) invert(11%) sepia(45%) saturate(769%) hue-rotate(357deg) brightness(93%) contrast(91%)',
          }}>
            <Logo type="image" />
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: interpolate(logoSp, [0, 1], [0, 300]),
          height: 1,
          background: `linear-gradient(to right, transparent, rgba(44, 33, 12, 0.15), transparent)`,
          marginBottom: 50,
        }} />

        {/* Urgencia */}
        <div style={{
          fontFamily: sans, fontSize: 38, fontWeight: 500,
          color: '#7a6f63', letterSpacing: 2,
          opacity: interpolate(urgSp, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(urgSp, [0, 1], [20, 0])}px)`,
          marginBottom: 30,
        }}>
          ⚠️ Quedan pocos cupos para el 25
        </div>

        {/* Headline CTA (Montserrat - sans) */}
        <div style={{
          fontFamily: sans, fontSize: 105, fontWeight: 900,
          color: '#2c210c', lineHeight: 1.05,
          opacity: interpolate(ctaSp, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(ctaSp, [0, 1], [40, 0])}px)`,
          marginBottom: 60,
        }}>
          Reservá<br />
          <span style={{ color: '#fbab4a' }}>ahora.</span>
        </div>

        {/* Botón CTA */}
        <div style={{
          backgroundColor: '#fbab4a', color: '#0A1424',
          padding: '28px 70px', borderRadius: 100,
          fontFamily: sans, fontSize: 30, fontWeight: 800,
          letterSpacing: 5, textTransform: 'uppercase',
          boxShadow: `0 15px 45px rgba(251,171,74,0.35)`,
          transform: `scale(${interpolate(ctaSp, [0, 1], [0.8, pulse])})`,
          opacity: ctaSp,
        }}>
          Cotizá tu evento
        </div>

        {/* Handle / web */}
        <div style={{
          display: 'flex', gap: 40, marginTop: 40,
          fontFamily: sans, fontSize: 26, fontWeight: 600,
          color: '#4A89C8', letterSpacing: 2,
          opacity: interpolate(ctaSp, [0, 1], [0, 0.85]),
        }}>
          <span>@aromaacafe</span>
          <span>·</span>
          <span>aromaacafe.com.ar</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// COMPOSICIÓN PRINCIPAL (SHORT FORM + MAYO 25)
// ==========================================
export const ShortFormPrototype: React.FC = () => {
  const frame = useCurrentFrame();

  // Rampa de volumen de la música con ducking inteligente basado en los segmentos de voz en off
  const audioVolume = (() => {
    // Fades in the music from 0 at the very start to 0.06 (ducked level) from frame 0 to 15
    if (frame < 15) {
      return interpolate(frame, [0, 15], [0, 0.06], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }

    // Between Block 1 and Block 2 (Pause from 114 to 184):
    // Music fades up to normal volume (0.22) starting at 114, stays up, swells to 0.28 at 171 (05.21), and fades down to ducked volume (0.06) starting at 171 to 184.
    if (frame >= 114 && frame < 184) {
      return interpolate(frame, [114, 129, 165, 171, 184], [0.06, 0.22, 0.22, 0.28, 0.06], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }

    // During "En cada celebración patria" (scene 2, frames 184-238):
    // Fade-out music when "En" starts (~frame 184), stay ducked, fade-in back after "patria" ends (~frame 238).
    if (frame >= 184 && frame < 250) {
      return interpolate(frame, [184, 190, 238, 250], [0.06, 0.02, 0.02, 0.06], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }

    // After Block 2 (after frame 755):
    // Music fades up to normal volume (0.22) starting at 755, stays up, and fades out to 0 at the end (from frame 840 to 875).
    if (frame >= 755) {
      if (frame >= 840) {
        return interpolate(frame, [840, 875], [0.22, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
      }
      return interpolate(frame, [755, 770], [0.06, 0.22], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }

    // Ducked volume during all other speaking frames (0 to 114, and 184 to 755)
    return 0.06;
  })();

  return (
    <AbsoluteFill style={{ backgroundColor: !ENABLE_INTRO_BACKGROUND ? '#FFFFFF' : '#0A1424', overflow: 'hidden' }}>
      {/* 🎵 Música de fondo: Tame Impala - Dracula (JENNIE Remix Instrumental) */}
      <Audio src={staticFile('dracula.mp3')} volume={audioVolume} startFrom={270} />

      {/* 🎙️ Segmentos de Voz en Off (Voiceover) */}
      <Sequence from={0} durationInFrames={55} layout="none">
        <Audio
          src={staticFile('audio_scene_1_1.mp3')}
          volume={(f) =>
            interpolate(f, [0, 4, 46, 55], [0, 1.5, 1.5, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      </Sequence>
      <Sequence from={60} durationInFrames={59} layout="none">
        <Audio
          src={staticFile('audio_scene_1_2.mp3')}
          volume={(f) =>
            interpolate(f, [0, 6], [0, 1.5], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      </Sequence>
      {/* 🎙️ "En cada celebración patria" — fade-in 4f, sin fade-out gradual al final */}
      <Sequence from={184} durationInFrames={54} layout="none">
        <Audio
          src={staticFile('audio_scene_2.mp3')}
          volume={(f) =>
            interpolate(f, [0, 4, 54], [0, 1.5, 1.5], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      </Sequence>
      {/* 🎙️ "En cada reunión de equipo" — sincronizado f=258 (subtítulo from={8} dentro de Sequence 250) */}
      {/* fade-in 4f en "En cada", fade-out gradual desde "po" (f local ~37) hasta silencio (f local ~43) */}
      <Sequence from={258} durationInFrames={43} layout="none">
        <Audio
          src={staticFile('audio_scene_3_1.mp3')}
          volume={(f) =>
            interpolate(f, [0, 4, 37, 43], [0, 1.5, 1.5, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      </Sequence>
      <Sequence from={301} durationInFrames={80} layout="none">
        <Audio src={staticFile('audio_scene_3_2.mp3')} volume={1.0} />
      </Sequence>
      <Sequence from={393} durationInFrames={70} layout="none">
        <Audio src={staticFile('audio_scene_4_1.mp3')} volume={1.0} />
      </Sequence>
      <Sequence from={460} durationInFrames={63} layout="none">
        <Audio src={staticFile('audio_scene_4_2.mp3')} volume={1.0} />
      </Sequence>
      <Sequence from={528} durationInFrames={105} layout="none">
        <Audio src={staticFile('audio_scene_5.mp3')} volume={1.0} />
      </Sequence>
      <Sequence from={663} durationInFrames={114} layout="none">
        <Audio src={staticFile('audio_scene_6.mp3')} volume={1.0} />
      </Sequence>

      {/* 💧 Sonido de Gota de Agua (Eco) de cuadro 94 a 160 (segundo 03.04 a 05.10) */}
      {/* El volumen inicia moderado (0.45) y se desvanece a partir de cuadro 121 (segundo 4.01 / f=27 local) */}
      <Sequence from={94} durationInFrames={66}>
        <Audio
          src={staticFile('water_drop_clean_loud.mp3')}
          volume={(f) =>
            interpolate(f, [0, 27, 45], [0.45, 0.45, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      </Sequence>

      {/* 👆 Clicks interactivos en la presentación (segundos 14.19, 15.19 y 16.20) */}
      <Sequence from={439} durationInFrames={15}>
        <Audio src={staticFile('click_trim.mp3')} volume={0.8} />
      </Sequence>
      <Sequence from={469} durationInFrames={15}>
        <Audio src={staticFile('click_trim.mp3')} volume={0.8} />
      </Sequence>
      <Sequence from={500} durationInFrames={15}>
        <Audio src={staticFile('click_trim.mp3')} volume={0.8} />
      </Sequence>

      <NoiseOverlay />

      {/* SECCIÓN 1: EL GANCHO */}
      <Sequence durationInFrames={!ENABLE_SUBSEQUENT_SECTIONS ? 877 : 208}>
        <AEPanScene outFrame={ENABLE_SUBSEQUENT_SECTIONS ? 172 : undefined}>
          <HookIntro />
        </AEPanScene>
      </Sequence>

      {ENABLE_SUBSEQUENT_SECTIONS && (
        <>
          {/* SECCIÓN 2: Celebración Patria con Video Revelado */}
          <Sequence from={172} durationInFrames={110}>
            <AEPanScene inFrame={172} outFrame={250}>
              <VideoRevealScene />
            </AEPanScene>
          </Sequence>

          {/* SECCIÓN 3: Reunión de equipo */}
          <Sequence from={250} durationInFrames={165}>
            <AEPanScene inFrame={250} outFrame={379} directionOut="down">
              <TeamMeetingScene />
              <Sequence from={8} durationInFrames={43} layout="none">
                <ProCaption
                  text="En cada reunión de equipo..."
                  highlightWords={['reunión', 'equipo...']}
                  theme="light"
                  startFrame={0}
                  style={{ zIndex: 12, bottom: '8%' }}
                />
              </Sequence>
              <Sequence from={51} durationInFrames={114} layout="none">
                <ProCaption
                  text="en cada momento que vale la pena recordar,"
                  highlightWords={['momento', 'recordar,']}
                  theme="light"
                  startFrame={0}
                  style={{ zIndex: 12, bottom: '8%', fontSize: 50 }}
                />
              </Sequence>
            </AEPanScene>
          </Sequence>

          {/* SECCIÓN 4: El Servicio */}
          <Sequence from={379} durationInFrames={177}>
            <AEPanScene inFrame={379} outFrame={520} directionIn="down" directionOut="up">
              <InteractivePresentationMockup />
              <Sequence from={14} durationInFrames={70} layout="none">
                <ProCaption
                  text="Aroma a Café está presente."
                  highlightWords={['Aroma', 'Café']}
                  theme="light"
                  startFrame={0}
                  style={{ zIndex: 20, bottom: '8%', fontSize: 62 }}
                />
              </Sequence>
              <Sequence from={81} durationInFrames={63} layout="none">
                <ProCaption
                  text="Llevamos nuestro servicio completo"
                  highlightWords={['servicio', 'completo']}
                  theme="light"
                  startFrame={0}
                  style={{ zIndex: 20, bottom: '8%', fontSize: 62 }}
                />
              </Sequence>
            </AEPanScene>
          </Sequence>

          {/* SECCIÓN 5: Disfrutar */}
          <Sequence from={520} durationInFrames={142}>
            <AEPanScene inFrame={520} outFrame={626} directionIn="up" directionOut="left">
              <DisfrutarScene delay={8} />
            </AEPanScene>
          </Sequence>

          {/* SECCIÓN 6: LLAMADO A LA ACCIÓN (CTA) */}
          <Sequence from={626} durationInFrames={251}>
            <AEPanScene inFrame={626} directionIn="left">
              <FinalCTAScene />
            </AEPanScene>
          </Sequence>
        </>
      )}

    </AbsoluteFill>
  );
};
