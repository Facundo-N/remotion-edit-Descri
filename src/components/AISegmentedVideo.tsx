import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, delayRender, continueRender, AbsoluteFill } from 'remotion';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';

// Definimos los props de nuestro componente
export const AISegmentedVideo: React.FC<{
  src: string;
  style?: React.CSSProperties;
}> = ({ src, style }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Detenemos el render de Remotion mientras carga la IA
  const [initHandle] = useState(() => delayRender('Cargando Modelo de IA'));
  const [segmenter, setSegmenter] = useState<bodySegmentation.BodySegmenter | null>(null);

  // Inicializamos la IA una sola vez
  useEffect(() => {
    let isMounted = true;
    
    const loadModel = async () => {
      try {
        await tf.ready(); // Esperamos a que WebGL esté listo
        
        const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
        const segmenterConfig: bodySegmentation.MediaPipeSelfieSegmentationTfjsModelConfig = {
          runtime: 'tfjs',
          modelType: 'general',
        };
        
        const loadedSegmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
        
        if (isMounted) {
          setSegmenter(loadedSegmenter);
          continueRender(initHandle); // IA cargada, dejamos que Remotion continúe
        }
      } catch (e) {
        console.error("Error cargando la IA:", e);
        continueRender(initHandle); // Continuamos igual para no bloquear todo
      }
    };
    
    loadModel();
    return () => { isMounted = false; };
  }, [initHandle]);

  // Ejecutamos la IA cuadro por cuadro
  useEffect(() => {
    if (!segmenter || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculamos el tiempo exacto del video según el frame actual
    const time = frame / fps;
    
    // Pausamos Remotion mientras la IA procesa este frame específico
    const frameHandle = delayRender(`Procesando fotograma ${frame} con IA`);

    const onSeeked = async () => {
      try {
        // Aseguramos que el video tenga las dimensiones correctas
        if (!video.videoWidth || !video.videoHeight) {
           return;
        }
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // 1. La IA analiza la imagen y recorta a la persona
        const segmentation = await segmenter.segmentPeople(video);
        
        // Limpiamos el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (segmentation.length > 0) {
          const person = segmentation[0];
          
          // 2. Extraemos la "máscara" de la persona (la silueta)
          const mask = await person.mask.toImageData();
          
          // Creamos un canvas temporal para la máscara
          const maskCanvas = document.createElement('canvas');
          maskCanvas.width = canvas.width;
          maskCanvas.height = canvas.height;
          const maskCtx = maskCanvas.getContext('2d');
          
          if (maskCtx) {
            maskCtx.putImageData(mask, 0, 0);
            
            // 3. Dibujamos el video original entero
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // 4. Aplicamos la máscara: Solo conservamos los píxeles que están en la silueta
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);
            
            // Restauramos el modo de dibujo a la normalidad
            ctx.globalCompositeOperation = 'source-over';
          }
        }
      } catch (err) {
        console.error("Error segmentando fotograma:", err);
      } finally {
        // Le decimos a Remotion que la IA terminó y puede tomar la "foto" del frame
        continueRender(frameHandle);
      }
    };

    // Le decimos al video que salte al segundo exacto de este frame
    video.addEventListener('seeked', onSeeked, { once: true });
    
    // Solucionamos posibles problemas de precisión con floats en JS
    video.currentTime = time + 0.001; 

  }, [frame, fps, segmenter]);

  return (
    <AbsoluteFill>
      <video
        ref={videoRef}
        src={src}
        width={width}
        height={height}
        style={{ display: 'none' }}
        crossOrigin="anonymous"
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          ...style 
        }}
      />
    </AbsoluteFill>
  );
};
