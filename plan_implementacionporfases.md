ROL: Sos un desarrollador experto en Remotion (React + TypeScript). Vas a construir un Reel vertical para Instagram/TikTok de un servicio de café para empresas.

OBJETIVO
Crear una composición en Remotion, formato vertical 9:16 (1080×1920), 30 fps. Esta es la VERSIÓN 1 (v1) — FASE 1: armar cada ESCENA (el HOOK + 3 beats) con su SUBTÍTULO y su AUDIO sincronizado. Usa SOLO los elementos disponibles. En esta fase NO se arman transiciones (ver sección TRANSICIONES). La duración total la definís vos según el ritmo (orientativo ~6–7 s). La duración de cada escena debe ser fácil de cambiar (props o constantes). No hardcodees valores fuera de los presets indicados.

MÉTODO (MUY IMPORTANTE — cómo viene armada cada escena)
Cada escena viene "desarmada". Por cada una te paso:
(a) una IMAGEN DE REFERENCIA = el boceto final de cómo tiene que quedar la escena;
(b) los RECURSOS A USAR = las partes sueltas (materiales separados) para volver a armar ese boceto.
Tu trabajo es REARMAR cada escena para que quede igual a su imagen de referencia, usando esos recursos.
- Lo que NO viene en los recursos (por ejemplo el FONDO) lo agregás vos, siguiendo la imagen de referencia.
- Las ANIMACIONES tampoco vienen incluidas: las agregás vos. Si querés, ANTES de animar, preguntame qué tipo de animación quiero para cada parte.
- Por ahora NO armes transiciones entre escenas (eso es Fase 2): usá cortes simples.
Nota técnica: imágenes -> <Img>; video -> <OffthreadVideo>; audio -> <Audio> dentro de su <Sequence>.

RECURSO COMÚN A TODAS LAS ESCENAS
- Granos de café: [Zoom_out_to_show_all_202606061747.png](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/Zoom_out_to_show_all_202606061747.png)  -> acomodarlos y duplicarlos según la imagen de referencia de cada escena.

ESTRUCTURA Y CONTENIDO (escena por escena)

== HOOK (intro) ==
- IMAGEN DE REFERENCIA: [generated-image-1780756611285.png](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/generated-image-1780756611285.png)
- RECURSOS A USAR:
   · Video de la máquina: [0515.mp4](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/25%20al%20%20principio/0515.mp4) -> usar desde el segundo 3 hasta el 7 (o menos si alcanza), encerrado en un rectángulo redondeado.
   · Granos de café: [Zoom_out_to_show_all_202606061747.png](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/Zoom_out_to_show_all_202606061747.png) (acomodar y duplicar según [generated-image-1780756611285.png](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/generated-image-1780756611285.png)).
- AGREGAR (lo que falta): fondo crema (#FDF8E7); el subtítulo "¿Sabés qué incluye nuestro servicio de cafetería para empresas?" (resaltar "empresas" en ámbar #fbab4a); y las animaciones (cámara con leve zoom-out y luego zoom-in, preset SUAVE; granos entrando lento desde los lados, preset SUAVE).
- AUDIO (sync): [ElevenLabs_2026-06-06T00_02_28_Melisa_pvc_sp103_s50_sb75_se0_b_m2](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/ElevenLabs_2026-06-06T00_02_28_Melisa_pvc_sp103_s50_sb75_se0_b_m2.mp3) -> el subtítulo entra en sync con esta locución.

== BEAT 1 — Máquina de café profesional ==
- IMAGEN DE REFERENCIA: [generated-image-1780759928440.png](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/generated-image-1780759928440.png)
- RECURSOS A USAR:
   · Máquina de café (sin fondo): [elimina_los_granos_y_los_202606061755.png](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/elimina_los_granos_y_los_202606061755.png)
   · Granos de café: [Zoom_out_to_show_all_202606061747.png](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/Zoom_out_to_show_all_202606061747.png) (acomodar y duplicar según [generated-image-1780756611285.png](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/generated-image-1780756611285.png)).
- AGREGAR (lo que falta): fondo; el texto "Máquina de café profesional"; y las animaciones.
- AUDIO (sync): [ElevenLabs_2026-06-06T00_04_14_Melisa_pvc_sp103_s50_sb75_se0_b_m2.mp3](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/ElevenLabs_2026-06-06T00_04_14_Melisa_pvc_sp103_s50_sb75_se0_b_m2.mp3)

== BEAT 2 — Cápsulas premium variadas ==
- IMAGEN DE REFERENCIA: [elimina_lo_selecconado_2K_202606061804.jpeg](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/elimina_lo_selecconado_2K_202606061804.jpeg)
- RECURSOS A USAR:
   · Vaso con granos de café: [elimina_lo_selecconado_2K_202606061804.png](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/elimina_lo_selecconado_2K_202606061804.png)
   · Granos de café: [Zoom_out_to_show_all_202606061747.png](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/Zoom_out_to_show_all_202606061747.png) (acomodar y duplicar según [elimina_lo_selecconado_2K_202606061804.jpeg](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/elimina_lo_selecconado_2K_202606061804.jpeg)).
- AGREGAR (lo que falta): fondo; el texto "Cápsulas premium variadas"; y las animaciones.
- AUDIO (sync): [ElevenLabs_2026-06-06T00_04_14_Melisa_pvc_sp103_s50_sb75_se0_b_m2.mp3](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/ElevenLabs_2026-06-06T00_04_14_Melisa_pvc_sp103_s50_sb75_se0_b_m2.mp3)

== BEAT 3 — Vajilla elegante ==
- IMAGEN DE REFERENCIA: [reemplaza_la_capsula_de_cafe_202606062203.jpeg](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/reemplaza_la_capsula_de_cafe_202606062203.jpeg)
- RECURSOS A USAR:
   · Vajillas elegantes (sin fondo): [QUITA_EL_FONDO_por_ffavor,_202606062203.png](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/QUITA_EL_FONDO_por_ffavor,_202606062203.png)
   · Granos de café: [Zoom_out_to_show_all_202606061747.png](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/Zoom_out_to_show_all_202606061747.png) (acomodar y duplicar según [reemplaza_la_capsula_de_cafe_202606062203.jpeg](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/reemplaza_la_capsula_de_cafe_202606062203.jpeg)).
- AGREGAR (lo que falta): fondo; el texto "Vajilla elegante"; y las animaciones.
- AUDIO (sync): [PENDIENTE: pasar audio del Beat 3]

PLANTILLA DE REFERENCIA — ESTÉTICA (inspiración para TODO el video)
La sección "[Disfrutar scene](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/src/components/DisfrutarScene.tsx)" de la plantilla "[shortfilm](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/src/components/ShortFormPrototype.tsx)" es una REFERENCIA ESTÉTICA / DE INSPIRACIÓN para todo el video: nos gusta su look, sus colores y su estilo en general. Tomala como inspiración para TODAS las escenas (no es una estructura para copiar al pie de la letra).
LIBERTAD TOTAL: tenés total libertad para cambiar y mejorar las plantillas y dejarlas incluso mejor de lo que están. Si encontrás una forma más linda de resolverlo, hacelo.
El fragmento de abajo es solo una muestra del estilo de composición de esa plantilla ([AEPanScene](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/src/components/ShortFormPrototype.tsx#L247) para entrar/sacar escenas). NO hace falta replicarlo tal cual; por ahora NO armes transiciones (eso es Fase 2) -> usá cortes simples.

// SECCIÓN 5: Disfrutar
<Sequence from={520} durationInFrames={142}>
  <AEPanScene inFrame={520} outFrame={626} directionIn="up" directionOut="left">
    <DisfrutarScene delay={8} />
  </AEPanScene>
</Sequence>

// SECCIÓN 4: El Servicio (todavía saliendo)
<Sequence from={379} durationInFrames={177}>
  <AEPanScene inFrame={379} outFrame={520} directionIn="down" directionOut="up">
    <InteractivePresentationMockup />
    ...
  </AEPanScene>
</Sequence>

TRANSICIONES — FASE 2 (NO implementar en esta v1)
En esta fase NO armamos transiciones. Entre escenas usar un CORTE simple (o un fade neutro de ~150 ms como placeholder). Igual dejá todo dentro de un TransitionSeries con la config de cada transición parametrizada (un objeto por transición) para enchufarlas después sin tocar la lógica.
Las transiciones reales (tipo/dirección/duración por fase) se definen DESPUÉS de tener cada escena armada con su subtítulo + audio, y tras el primer render.
Plan tentativo para la Fase 2 (no implementar ahora): alternar lateral / hacia arriba -> Hook→B1 lateral (slide from-right), B1→B2 hacia arriba (slide from-bottom), B2→B3 lateral; timing ~200–270 ms con springTiming (preset WHIP).

PRESETS DE FÍSICA (definir una vez en [constants.ts](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/src/constants.ts) y reutilizar)
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

AUDIO (clave en esta fase) — VO por escena; el subtítulo entra en sync con la locución:
- HOOK: [ElevenLabs_2026-06-06T00_02_28_Melisa_pvc_sp103_s50_sb75_se0_b_m2](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/ElevenLabs_2026-06-06T00_02_28_Melisa_pvc_sp103_s50_sb75_se0_b_m2.mp3)
- BEAT 1 y BEAT 2: [ElevenLabs_2026-06-06T00_04_14_Melisa_pvc_sp103_s50_sb75_se0_b_m2.mp3](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/ElevenLabs_2026-06-06T00_04_14_Melisa_pvc_sp103_s50_sb75_se0_b_m2.mp3)
- BEAT 3: [ElevenLabs_2026-06-06T00_04_14_Melisa_pvc_sp103_s50_sb75_se0_b_m2.mp3](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/ElevenLabs_2026-06-06T00_04_14_Melisa_pvc_sp103_s50_sb75_se0_b_m2.mp3)
- Música de fondo con fade in/out y ducking -8 dB cuando entra el VO.
- SFX pop/tick en cada entrada de texto; vapor/cafetera durante el hook. (Los whoosh de transición quedan para la Fase 2.)

ENTREGABLE (Fase 1)
- Proyecto Remotion: un componente por escena (HOOK + 3 beats) + un Root con TransitionSeries.
- Cada escena con su SUBTÍTULO y su AUDIO (VO) sincronizado, rearmada desde su imagen de referencia + recursos.
- Presets centralizados en [constants.ts](file:///c:/Users/juarez/.gemini/antigravity-ide/scratch/remotion-edit-Descri/src/constants.ts).
- Todo animado con useCurrentFrame() + los 4 presets. Sin valores mágicos sueltos.
- Transiciones como placeholder parametrizado (cortes/fades neutros), listas para definir en Fase 2.
- Duración por escena y config de transición fáciles de editar.