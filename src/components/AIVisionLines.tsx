import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, delayRender, continueRender, AbsoluteFill, staticFile } from 'remotion';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';

export const AIVisionLines: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const videoSrc = staticFile('test_vision.mp4');

  const [initHandle] = useState(() => delayRender('Cargando Modelo de Recorte'));
  const [segmenter, setSegmenter] = useState<bodySegmentation.BodySegmenter | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadModel = async () => {
      try {
        await tf.ready();
        const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
        const segmenterConfig: bodySegmentation.MediaPipeSelfieSegmentationTfjsModelConfig = {
          runtime: 'tfjs',
          modelType: 'general',
        };
        const loadedSegmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
        if (isMounted) {
          setSegmenter(loadedSegmenter);
          continueRender(initHandle);
        }
      } catch (e) {
        console.error("Error IA:", e);
        continueRender(initHandle);
      }
    };
    loadModel();
    return () => { isMounted = false; };
  }, [initHandle]);

  useEffect(() => {
    if (!segmenter || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = frame / fps;
    const frameHandle = delayRender(`Procesando frame ${frame}`);

    const processFrame = async () => {
      try {
        if (!video.videoWidth || !video.videoHeight) {
          console.warn('Video dimensions not ready yet');
          return;
        }
        
        canvas.width = width;
        canvas.height = height;

        // 1. DIBUJAR VIDEO ORIGINAL
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(video, 0, 0, width, height);

        // 2. RECORTAR A LA PERSONA
        const segmentation = await segmenter.segmentPeople(video);
        
        if (segmentation.length > 0) {
          const person = segmentation[0];
          const mask = await person.mask.toImageData();
          
          // Crear un canvas temporal para la máscara original
          const maskCanvas = document.createElement('canvas');
          maskCanvas.width = width;
          maskCanvas.height = height;
          const maskCtx = maskCanvas.getContext('2d')!;
          maskCtx.putImageData(mask, 0, 0);

          // Crear un canvas para dibujar el contorno "expandido"
          const outlineCanvas = document.createElement('canvas');
          outlineCanvas.width = width;
          outlineCanvas.height = height;
          const outlineCtx = outlineCanvas.getContext('2d')!;

          // Animación de temblor (Scribble effect)
          const wobbleX = Math.sin(frame * 0.5) * 3;
          const wobbleY = Math.cos(frame * 0.7) * 3;
          const strokeWidth = 8; // Grosor de la línea

          // Dibujar la máscara varias veces desplazada para crear un borde grueso
          // y la pintamos de color Naranja/Amarillo neón
          const offsets = [
            [strokeWidth, 0], [-strokeWidth, 0], [0, strokeWidth], [0, -strokeWidth],
            [strokeWidth, strokeWidth], [-strokeWidth, -strokeWidth], 
            [strokeWidth, -strokeWidth], [-strokeWidth, strokeWidth]
          ];

          outlineCtx.fillStyle = '#FFA500'; // Naranja tipo marcador
          outlineCtx.shadowColor = '#FF4500'; // Resplandor
          outlineCtx.shadowBlur = 10;

          // Truco: Para colorear la máscara que es blanca/transparente, 
          // la dibujamos con globalCompositeOperation = 'source-over'
          // pero antes la tintamos. Un método rápido es usar shadow o un fill sobre la forma.
          
          // Creamos una máscara tintada de naranja
          const tintedMask = document.createElement('canvas');
          tintedMask.width = width; tintedMask.height = height;
          const tCtx = tintedMask.getContext('2d')!;
          tCtx.putImageData(mask, 0, 0);
          tCtx.globalCompositeOperation = 'source-in';
          tCtx.fillStyle = '#FF9900';
          tCtx.fillRect(0, 0, width, height);

          // Expandimos usando la máscara tintada
          for (let [dx, dy] of offsets) {
            outlineCtx.drawImage(tintedMask, dx + wobbleX, dy + wobbleY);
          }

          // 3. RECORTAR EL CENTRO (Para que solo quede el borde)
          outlineCtx.globalCompositeOperation = 'destination-out';
          outlineCtx.drawImage(maskCanvas, 0, 0); // Borra todo el interior de la silueta

          // 4. DIBUJAR EL CONTORNO FINAL SOBRE EL VIDEO
          ctx.drawImage(outlineCanvas, 0, 0);
        }

      } catch (err) {
        console.error("Error en processFrame:", err);
      } finally {
        continueRender(frameHandle);
      }
    };

    // Asegurarse de que el video salte al tiempo correcto y luego procesar
    const seekAndProcess = () => {
      video.addEventListener('seeked', processFrame, { once: true });
      video.currentTime = time + 0.001;
    };

    if (video.readyState >= 2) { // HAVE_CURRENT_DATA
      seekAndProcess();
    } else {
      video.addEventListener('loadeddata', seekAndProcess, { once: true });
      // Forzar carga si no ha empezado
      video.load();
    }

  }, [frame, fps, segmenter, width, height]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <video
        ref={videoRef}
        src={videoSrc}
        width={width}
        height={height}
        preload="auto"
        style={{ display: 'none' }}
        crossOrigin="anonymous"
        muted
        playsInline
      />
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </AbsoluteFill>
  );
};
