import React from 'react';
import { AbsoluteFill, useCurrentFrame, staticFile, Video } from 'remotion';
import { AISegmentedVideo } from './AISegmentedVideo';

export const AILayeredScene: React.FC = () => {

  const frame = useCurrentFrame();

  // Aquí pones el nombre de tu video (debería estar en la carpeta public/)
  // O puedes usar import para videos en src/
  const videoSource = staticFile('viode º1.mp4'); // Asegúrate que el video exista o ajusta el nombre

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
      
      {/* CAPA 1: EL FONDO ORIGINAL (OPCIONAL) */}
      {/* Si quieres que el fondo original se vea borroso, puedes ponerlo aquí */}
      <AbsoluteFill>
         <Video src={videoSource} style={{ objectFit: 'cover', opacity: 0.3, filter: 'blur(10px)' }} />
      </AbsoluteFill>

      {/* CAPA 2: MOTION GRAPHIC (POR DETRÁS DE LA PERSONA) */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h1 
          style={{ 
            fontSize: '150px', 
            color: '#FFD700', 
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            transform: `scale(${1 + Math.sin(frame / 30) * 0.1}) rotate(${frame * 0.5}deg)`,
            textShadow: '0 0 50px rgba(255, 215, 0, 0.8)'
          }}
        >
          25 DE MAYO
        </h1>
        {/* Aquí puedes meter partículas, svg animados, cintas, etc. */}
      </AbsoluteFill>

      {/* CAPA 3: LA PERSONA (RECORTADA POR LA IA) */}
      {/* La IA recortará el fondo y solo dibujará a la persona, tapando el texto solo en la zona donde está su cuerpo */}
      <AbsoluteFill>
        <AISegmentedVideo src={videoSource} />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
