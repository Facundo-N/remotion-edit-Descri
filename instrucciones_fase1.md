ROL: Sos un desarrollador experto en Remotion (React + TypeScript). Vas a construir un Reel vertical para Instagram/TikTok de un servicio de café para empresas.

OBJETIVO
Crear una composición en Remotion, formato vertical 9:16 (1080×1920), 30 fps. Esta es la VERSIÓN 1 (v1) — FASE 1: armar cada ESCENA (el HOOK + 3 beats) con su SUBTÍTULO y su AUDIO sincronizado. Usa SOLO los elementos disponibles. En esta fase NO se arman transiciones (ver sección TRANSICIONES). La duración total la definís vos según el ritmo (orientativo ~6–7 s). La duración de cada escena debe ser fácil de cambiar (props o constantes). No hardcodees valores fuera de los presets indicados.

ASSETS (reemplazar por los nombres de archivo reales)
IMÁGENES:
- IMG_HOOK   -> [PENDIENTE] · armar el frame del HOOK replicando la estética de la imagen de referencia (intro-ref), adaptada a NUESTRA marca/producto.
- IMG_BEAT1  -> [PENDIENTE: archivo "Máquina de café profesional"]
- IMG_BEAT2  -> [PENDIENTE: archivo "Cápsulas premium variadas"]
- IMG_BEAT3  -> [PENDIENTE: archivo "Vajilla elegante"]
AUDIO:
- AUDIO_HOOK -> ElevenLabs_2026-06-06T00_02_28_Melisa_pvc_sp103_s50_sb75_se0_b_m2  (VO del HOOK; sincronizar la entrada del subtítulo con esta locución)
Nota: si un elemento es imagen, usar <Img>; si es video, usar <OffthreadVideo>. Audio con <Audio> dentro de su <Sequence>.

ESTRUCTURA Y CONTENIDO
1) HOOK (intro) — fondo crema (#FDF8E7) con granos de café flotando. Estética: replicar el layout de la imagen de referencia (intro-ref), adaptado a nuestra marca.
   - Producto/máquina centrado (IMG_HOOK); la cámara está al servicio del texto.
   - Subtítulo protagonista: "¿Sabés qué incluye nuestro servicio de cafetería para empresas?" (resaltar "empresas" en ámbar #fbab4a).
   - AUDIO: reproducir AUDIO_HOOK (VO). El subtítulo debe entrar/animarse EN SYNC con la locución (las palabras acompañan lo que se escucha).
   - Cámara: leve zoom-out y luego zoom-in (preset SUAVE).
   - Granos entran lento desde los lados (preset SUAVE).
2) BEAT 1 — "Máquina de café profesional" (IMG_BEAT1). Producto centrado con leve tilt; el texto entra desde abajo (preset SNAP).
3) BEAT 2 — "Cápsulas premium variadas" (IMG_BEAT2). El texto aparece con overshoot sutil (preset POP).
4) BEAT 3 — "Vajilla elegante" (IMG_BEAT3). El texto entra desde abajo (preset SNAP).

TRANSICIONES — FASE 2 (NO implementar en esta v1)
En esta fase NO armamos transiciones. Entre escenas usar un CORTE simple (o un fade neutro de ~150 ms como placeholder). Igual dejá todo dentro de un TransitionSeries con la config de cada transición parametrizada (un objeto por transición) para enchufarlas después sin tocar la lógica.
Las transiciones reales (tipo/dirección/duración por fase) se definen DESPUÉS de tener cada escena armada con su subtítulo + audio, y tras el primer render.
Plan tentativo para la Fase 2 (no implementar ahora): alternar lateral / hacia arriba -> Hook→B1 lateral (slide from-right), B1→B2 hacia arriba (slide from-bottom), B2→B3 lateral; timing ~200–270 ms con springTiming (preset WHIP).

PRESETS DE FÍSICA (definir una vez en constants.ts y reutilizar)
- SUAVE: spring({ config: { damping: 200, mass: 1, stiffness: 100 } })  -> entradas/salidas y cámara, sin rebote.
- POP:   spring({ config: { damping: 14, mass: 0.9, stiffness: 110 } }) -> entrada de textos/logo, overshoot sutil.
- SNAP:  spring({ config: { damping: 20, mass: 1, stiffness: 200 } })   -> textos rápidos, firme.
- WHIP:  springTiming({ config: { damping: 200, stiffness: 120 } })     -> transiciones entre escenas (~230–270 ms).

LOOK & FEEL (estricto)
- Paleta: café oscuro #2c210c (texto/títulos), ámbar #fbab4a (acentos, resaltado, glow), amarillo claro #f7edb0 y crema #FDF8E7 (fondos).
- Tipografía en capas: script/cursiva GRANDE y semitransparente de fondo (opacity ~0.25) + sans-serif bold encima.
- Tarjeta/panel con glow cálido ámbar (box-shadow / drop-shadow) y bordes redondeados.
- PROHIBIDO: violeta, aberración cromática, RGB split.
- Sumar motion blur (@remotion/motion-blur, Trail) en lo que se mueve y grano sutil (@remotion/noise u overlay con mix-blend-mode: overlay y opacity baja).

AUDIO (clave en esta fase)
- HOOK: VO = AUDIO_HOOK (ElevenLabs_2026-06-06T00_02_28_Melisa_pvc_sp103_s50_sb75_se0_b_m2). El subtítulo del hook entra en sync con esta locución.
- Música de fondo con fade in/out y ducking -8 dB cuando entra el VO.
- SFX pop/tick en cada entrada de texto; vapor/cafetera durante el hook. (Los whoosh de transición quedan para la Fase 2.)

ENTREGABLE (Fase 1)
- Proyecto Remotion: un componente por escena (HOOK + 3 beats) + un Root con TransitionSeries.
- Cada escena con su SUBTÍTULO y, en el HOOK, el AUDIO (AUDIO_HOOK) sincronizado.
- Presets centralizados en constants.ts.
- Todo animado con useCurrentFrame() + los 4 presets. Sin valores mágicos sueltos.
- Transiciones como placeholder parametrizado (cortes/fades neutros), listas para definir en Fase 2.
- Duración por escena y config de transición fáciles de editar.
