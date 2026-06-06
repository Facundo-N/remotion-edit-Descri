import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const CafeSVG: React.FC<{ size?: number }> = ({ size = 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Taza saltando
  const jump = spring({
    frame: frame - 5,
    fps,
    config: { damping: 10, mass: 1 },
    durationInFrames: 25,
  });

  // Salta hacia arriba y vuelve a caer
  const cupTranslateY = interpolate(jump, [0, 0.5, 1], [0, -150, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // 2. Taza girando: El asa gira a la izquierda, luego hacia atrás (y desaparece) y vuelve
  // Simularemos el giro 3D moviendo el asa horizontalmente y escalándola, y modificando el ancho de la taza
  const spin = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, mass: 1 },
    durationInFrames: 30,
  });

  // Asa moviéndose de derecha a izquierda, luego ocultándose
  const handleTranslateX = interpolate(spin, [0, 0.3, 0.6, 1], [0, -260, -260, 0]);
  const handleScaleX = interpolate(spin, [0, 0.3, 0.6, 1], [1, -1, 0, 1]); // Cambia de dirección y se oculta
  const handleOpacity = interpolate(spin, [0.4, 0.6], [1, 0], { extrapolateRight: 'clamp' }); // Se oculta cuando va por detrás

  // 3. Inclinación del agua siguiendo el giro y el salto
  const liquidTilt = interpolate(spin, [0, 0.5, 1], [0, -20, 0]); // El agua se inclina por la inercia del giro
  
  // 4. Salpicadura de agua (la gota)
  const splash = spring({
    frame: frame - 25,
    fps,
    config: { damping: 10 },
    durationInFrames: 15,
  });
  
  const splashY = interpolate(splash, [0, 0.5, 1], [0, -80, 0]);
  const splashScale = interpolate(splash, [0, 0.5, 1], [0, 1, 0]);

  // 5. Inclinación general de la taza (wobble)
  const cupRotation = interpolate(jump, [0, 0.5, 1], [0, -15, 0]);

  return (
    <div style={{
      width: size,
      height: size,
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transform: `translateY(${cupTranslateY}px) rotate(${cupRotation}deg)`
    }}>
      {/* Salpicadura de café */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        width: size * 0.08,
        height: size * 0.08,
        backgroundColor: '#1E140F',
        borderRadius: '50%',
        transform: `translate(-50%, ${splashY}px) scale(${splashScale})`,
        zIndex: 10
      }} />

      {/* Taza y líquido */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        zIndex: 5
      }}>
        <svg viewBox="0 0 512 512" width="100%" height="100%">
          <defs>
            {/* Sombra interna para dar profundidad 3D al cuerpo */}
            <linearGradient id="cupShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="20%" stopColor="#F5F5F5" />
              <stop offset="50%" stopColor="#E8E8E8" />
              <stop offset="100%" stopColor="#D0D0D0" />
            </linearGradient>
          </defs>

          {/* Cuerpo de la taza con gradiente de sombra */}
          <path d="M120 180 C120 400, 390 400, 390 180 Z" fill="url(#cupShadow)" />
          
          {/* Asa de la taza (Simulación 3D rotando) */}
          <g transform={`translate(${handleTranslateX}, 0)`} opacity={handleOpacity}>
            <path 
              d="M380 220 C460 220, 460 320, 380 320" 
              fill="none" 
              stroke="#FFFFFF" 
              strokeWidth="35" 
              strokeLinecap="round" 
              style={{ transformOrigin: '380px 270px', transform: `scaleX(${handleScaleX})` }}
            />
          </g>

          {/* Borde superior de la taza */}
          <path d="M120 180 C120 220, 390 220, 390 180 C390 140, 120 140, 120 180" fill="#E8E8E8" />
          
          {/* Café adentro (inclinado y más curveado) */}
          <g transform={`rotate(${liquidTilt}, 255, 180)`}>
             <path 
               d="M135 190 C135 230, 375 230, 375 190 C375 150, 135 150, 135 190" 
               fill="#1E140F" 
             />
          </g>
        </svg>
      </div>

      {/* Sombra en el suelo */}
      <div style={{
        position: 'absolute',
        bottom: -20,
        width: '80%',
        height: '30px',
        background: 'rgba(0,0,0,0.1)',
        borderRadius: '50%',
        filter: 'blur(5px)',
        transform: `scale(${interpolate(jump, [0, 0.5, 1], [1, 0.3, 1])})`,
        zIndex: 1
      }} />
    </div>
  );
};
