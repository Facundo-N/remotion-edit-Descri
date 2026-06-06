import React, { useEffect, useState, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, delayRender, continueRender } from 'remotion';
import gsap from 'gsap';

// Componente estático memorizado para que React NUNCA lo vuelva a renderizar ni a diffear.
// Esto previene que el Virtual DOM de React resetee las propiedades animadas directamente por GSAP en el DOM.
const StaticCupSVG = React.memo(() => {
  return (
    <svg viewBox="0 0 600 600" id="scene" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <style>{`
        .spiral-path {
          stroke-dasharray: 250 2000;
          stroke-dashoffset: 250;
        }
        #flag-group {
          opacity: 0;
        }
      `}</style>
      <defs>
        <clipPath id="body-mask">
          <path d="M 210 240 L 390 240 L 354 370 C 344 388, 256 388, 246 370 Z" />
        </clipPath>
        {/* MÁSCARA LIMPIA: Solo recorta el café en el borde exacto de la taza */}
        <clipPath id="rim-mask">
          <ellipse cx="300" cy="240" rx="86" ry="22" />
        </clipPath>

        {/* Gradiente Bicolor de la Bandera */}
        <linearGradient id="arg-bicolor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="30%" stopColor="#74ACDF" />
          <stop offset="70%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>

      {/* SOMBRA DEL SUELO (Estilo Cel Shading, subida para coincidir con la taza) */}
      <ellipse id="shadow" cx="300" cy="400" rx="110" ry="22" fill="#262626" opacity={0} />

      {/* GRUPO DEL PLATO (Subido para que la taza encaje perfectamente dentro) */}
      <g id="saucer-group" opacity={0}>
        {/* Grosor exterior (Sombra dura cel shading idéntica a la taza) */}
        <ellipse cx="300" cy="389" rx="130" ry="35" fill="#E0E0E0" />
        {/* Superficie blanca plana */}
        <ellipse cx="300" cy="383" rx="130" ry="35" fill="#FFFFFF" />
        {/* Hendidura central plana con color sólido para dar profundidad 2D */}
        <ellipse cx="300" cy="384" rx="85" ry="23" fill="#F4F4F4" />
      </g>

      {/* EXPLOSIÓN DE LÍNEAS (Burst) desde el centro del impacto (Detrás de la taza) */}
      <g id="confetti-group" opacity={0}>
        {/* Líneas de velocidad rotadas simulando una explosión circular */}
        <g transform="rotate(0 300 240)"><rect className="burst-line" x="297" y="170" width={6} height={40} rx={3} fill="#74ACDF" /></g>
        <g transform="rotate(35 300 240)"><rect className="burst-line" x="298" y="175" width={4} height={35} rx={2} fill="#F6B40E" /></g>
        <g transform="rotate(70 300 240)"><rect className="burst-line" x="297" y="165" width={6} height={45} rx={3} fill="#FFFFFF" /></g>
        <g transform="rotate(110 300 240)"><rect className="burst-line" x="298" y="180" width={4} height={30} rx={2} fill="#74ACDF" /></g>
        <g transform="rotate(145 300 240)"><rect className="burst-line" x="297.5" y="170" width={5} height={40} rx={2.5} fill="#F6B40E" /></g>
        <g transform="rotate(180 300 240)"><rect className="burst-line" x="298" y="175" width={4} height={35} rx={2} fill="#FFFFFF" /></g>
        <g transform="rotate(215 300 240)"><rect className="burst-line" x="297" y="165" width={6} height={45} rx={3} fill="#74ACDF" /></g>
        <g transform="rotate(250 300 240)"><rect className="burst-line" x="298" y="180" width={4} height={30} rx={2} fill="#F6B40E" /></g>
        <g transform="rotate(290 300 240)"><rect className="burst-line" x="297.5" y="170" width={5} height={40} rx={2.5} fill="#FFFFFF" /></g>
        <g transform="rotate(325 300 240)"><rect className="burst-line" x="298" y="175" width={4} height={35} rx={2} fill="#74ACDF" /></g>
      </g>

      {/* ESPIRALES TRASEROS (Líneas que pasan por detrás de la taza) */}
      <g id="swoosh-back-group">
        <path className="spiral-path spiral-back spiral-blue" d="M 450 250 C 400 150, 150 170, 120 200" fill="none" stroke="#74ACDF" strokeWidth={12} strokeLinecap="round" />
        <path className="spiral-path spiral-back spiral-white" d="M 470 200 C 420 120, 120 150, 90 150" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
        <path className="spiral-path spiral-back spiral-yellow" d="M 420 300 C 350 220, 180 240, 150 240" fill="none" stroke="#F6B40E" strokeWidth={5} strokeLinecap="round" />
      </g>

      {/* CONTENEDOR PRINCIPAL DE LA TAZA (Ahora se dibuja SOBRE el platillo) */}
      <g id="master-cup" opacity={0}>

        {/* GRUPO DEL ASA */}
        <g id="handle-group">
          <path d="M 370 260 C 450 260, 440 340, 350 340" fill="none" stroke="#FFFFFF" strokeWidth={26} strokeLinecap="round" />
          <path id="handle-shadow" d="M 370 260 C 450 260, 440 340, 350 340" fill="none" stroke="#E0E0E0" strokeWidth={10} strokeLinecap="round" />
        </g>

        {/* CUERPO PRINCIPAL CON SOMBRA */}
        <g id="cup-body-group">
          <path d="M 210 240 L 390 240 L 354 370 C 344 388, 256 388, 246 370 Z" fill="#FFFFFF" />
          <rect id="body-shadow" x="330" y="240" width="80" height="160" fill="#E0E0E0" clipPath="url(#body-mask)" />
        </g>

        {/* BASE INFERIOR (Aparece en el impacto para el efecto de rebote elástico) */}
        <g id="cup-bottom-group" opacity={0}>
          <ellipse cx="300" cy="374" rx="55" ry="16" fill="#757575" />
          <ellipse cx="300" cy="378" rx="45" ry="12" fill="#5C5C5C" />
        </g>

        {/* APERTURA SUPERIOR */}
        <g id="top-opening">
          {/* Borde exterior */}
          <ellipse cx="300" cy="240" rx="90" ry="25" fill="#FFFFFF" />

          {/* LÍQUIDO CON MÁSCARA */}
          <g clipPath="url(#rim-mask)">
            {/* Fondo base de Café Marrón */}
            <rect id="liquid-base" x="100" y="100" width="400" height="400" fill="#5C3A21" />

            {/* Contenedor del líquido animado */}
            <g id="liquid-surface-container">

              {/* ONDA BICOLOR: Se expande con el impacto de la gota */}
              <ellipse id="bicolor-ripple" cx="300" cy="240" rx="0" ry="0" fill="url(#arg-bicolor)" opacity={0} />

              {/* Brillo cristalino (Iluminación grande) */}
              <g id="surface-highlights">
                <ellipse cx="260" cy="237" rx="18" ry="3" fill="#FFFFFF" opacity={0.25} transform="rotate(-6 260 237)" />
                <ellipse cx="285" cy="235" rx="3" ry="1.5" fill="#FFFFFF" opacity={0.2} transform="rotate(-6 285 235)" />
              </g>

              {/* Burbujas internas */}
              <g id="liquid-bubbles">
                <circle cx="270" cy="246" r="2.5" fill="#FFFFFF" opacity={0.4} />
                <circle cx="310" cy="241" r="1.5" fill="#FFFFFF" opacity={0.3} />
                <circle cx="290" cy="250" r="2" fill="#FFFFFF" opacity={0.5} />
                <circle cx="330" cy="245" r="3" fill="#FFFFFF" opacity={0.2} />
                <circle cx="250" cy="243" r="1.5" fill="#FFFFFF" opacity={0.4} />
              </g>
            </g>
          </g>
        </g>

        {/* DOMO DE IMPACTO INICIAL */}
        <g id="liquid-bulge-group" opacity={0}>
          <path d="M 214 240 C 220 220, 260 225, 290 230 C 310 140, 400 160, 386 240 Z" fill="url(#arg-bicolor)" />
          <path d="M 270 225 C 290 160, 360 165, 370 230" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.25} />
        </g>

        {/* PARTÍCULAS INTERNAS (Colores de la bandera) */}
        <g id="internal-particles">
          <circle className="splash-impact" id="splash-imp-1" cx="300" cy="240" r="6" fill="#74ACDF" opacity={0} />
          <circle className="splash-impact" id="splash-imp-2" cx="300" cy="240" r="4" fill="#FFFFFF" opacity={0} />
          <circle className="splash-impact" id="splash-imp-3" cx="300" cy="240" r="5" fill="#74ACDF" opacity={0} />
          <circle className="splash-impact" id="splash-imp-4" cx="300" cy="240" r="3" fill="#FFFFFF" opacity={0} />
          <circle className="splash-impact" id="splash-imp-5" cx="300" cy="240" r="4.5" fill="#74ACDF" opacity={0} />
          <circle className="splash-impact" id="splash-imp-6" cx="300" cy="240" r="3.5" fill="#FFFFFF" opacity={0} />

          <circle className="splash" id="splash-1" cx="300" cy="240" r="8" fill="#74ACDF" opacity={0} />
          <circle className="splash" id="splash-2" cx="300" cy="240" r="5" fill="#FFFFFF" opacity={0} />
          <circle className="splash" id="splash-3" cx="300" cy="240" r="6" fill="#74ACDF" opacity={0} />
          <circle className="splash" id="splash-4" cx="300" cy="240" r="4" fill="#FFFFFF" opacity={0} />
          <circle className="splash" id="splash-5" cx="300" cy="240" r="3.5" fill="#74ACDF" opacity={0} />
          <circle className="splash" id="splash-6" cx="300" cy="240" r="5" fill="#FFFFFF" opacity={0} />

          <circle className="splash-land" id="splash-land-1" cx="300" cy="240" r="4" fill="#74ACDF" opacity={0} />
          <circle className="splash-land" id="splash-land-2" cx="300" cy="240" r="5" fill="#FFFFFF" opacity={0} />
          <circle className="splash-land" id="splash-land-3" cx="300" cy="240" r="3" fill="#74ACDF" opacity={0} />
          <circle className="splash-land" id="splash-land-4" cx="300" cy="240" r="3.5" fill="#FFFFFF" opacity={0} />
          <circle className="splash-land" id="splash-land-5" cx="300" cy="240" r="2.5" fill="#74ACDF" opacity={0} />
        </g>
      </g> {/* FIN TAZA */}

      {/* ESPIRALES DELANTEROS (Líneas que envuelven por el frente) */}
      <g id="swoosh-front-group">
        {/* Hilo Azul */}
        <path className="spiral-path spiral-front-1 spiral-blue" d="M 120 320 C 150 450, 480 380, 450 250" fill="none" stroke="#74ACDF" strokeWidth={12} strokeLinecap="round" />
        <path className="spiral-path spiral-front-2 spiral-blue" d="M 120 200 C 150 300, 400 250, 450 100" fill="none" stroke="#74ACDF" strokeWidth={12} strokeLinecap="round" />
        
        {/* Hilo Blanco */}
        <path className="spiral-path spiral-front-1 spiral-white" d="M 90 280 C 120 400, 500 350, 470 200" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
        <path className="spiral-path spiral-front-2 spiral-white" d="M 90 150 C 120 250, 420 200, 470 50" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
        
        {/* Hilo Amarillo */}
        <path className="spiral-path spiral-front-1 spiral-yellow" d="M 150 360 C 200 480, 450 420, 420 300" fill="none" stroke="#F6B40E" strokeWidth={5} strokeLinecap="round" />
        <path className="spiral-path spiral-front-2 spiral-yellow" d="M 150 240 C 200 350, 400 300, 420 150" fill="none" stroke="#F6B40E" strokeWidth={5} strokeLinecap="round" />
      </g>

      {/* BANDERA DE ARGENTINA (Empieza centrada y salta) */}
      <g id="flag-group">
        <rect className="flag-stripe" id="stripe-top" x={255} y={30} width={90} height={20} fill="#74ACDF" />
        <rect className="flag-stripe" id="stripe-mid" x={255} y={50} width={90} height={20} fill="#FFFFFF" />
        <rect className="flag-stripe" id="stripe-bot" x={255} y={70} width={90} height={20} fill="#74ACDF" />
        <circle id="flag-sun" cx={300} cy={60} r={6} fill="#F6B40E" />
      </g>

      {/* GOTA PRINCIPAL (Conserva colores de la bandera) */}
      <g id="drop-group" opacity={0}>
        <circle cx="300" cy={60} r={9} fill="url(#arg-bicolor)" />
        <circle cx="297" cy="57" r="2.5" fill="#FFFFFF" opacity={0.3} />
      </g>

      {/* Partículas flotantes aromáticas */}
      <g id="floating-particles">
        <circle className="float-part" id="fp-1" cx="290" cy="240" r="2.5" fill="#2E1B0F" opacity={0} />
        <circle className="float-part" id="fp-2" cx="310" cy="240" r="1.5" fill="#2E1B0F" opacity={0} />
        <circle className="float-part" id="fp-3" cx="280" cy="240" r="2" fill="#2E1B0F" opacity={0} />
        <circle className="float-part" id="fp-4" cx="320" cy="240" r="1.5" fill="#2E1B0F" opacity={0} />
        <circle className="float-part" id="fp-5" cx="300" cy="240" r="3" fill="#2E1B0F" opacity={0} />
      </g>
    </svg>
  );
}, () => true);

export const PerfectCupAnimation: React.FC<{ size?: number }> = ({ size = 600 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [handle] = useState(() => delayRender('gsap-init'));

  useEffect(() => {
    // Configuración de GSAP dentro del contexto del contenedor de React
    const ctx = gsap.context(() => {
      // Establecer puntos de pivote iniciales en coordenadas del viewBox del SVG usando svgOrigin.
      // Esto permite que el navegador escale responsivamente las transformaciones en el espacio del viewBox (600x600),
      // evitando cualquier desalineación o desfasamiento de elementos cuando la taza cambia de tamaño.
      gsap.set("#master-cup", { svgOrigin: "300 380" });
      gsap.set(["#top-opening", "#liquid-bulge-group", "#liquid-surface-container"], { svgOrigin: "300 240" });
      gsap.set("#surface-highlights", { svgOrigin: "260 237" });
      gsap.set("#bicolor-ripple", { svgOrigin: "300 240" });
      gsap.set("#cup-bottom-group", { svgOrigin: "300 374" });
      gsap.set("#saucer-group", { svgOrigin: "300 384" }); // Origen del plato actualizado
      gsap.set("#shadow", { svgOrigin: "300 400" }); // Origen de sombra actualizado
      gsap.set("#handle-group", { svgOrigin: "350 300" });
      gsap.set("#handle-shadow", { x: -5, y: 5 });
      gsap.set("#flag-group", { svgOrigin: "300 60" });

      const animation = gsap.timeline({ paused: true });

      // RESET: Estado inicial antes de cada bucle
      animation.set("#flag-group", { y: 350, scaleX: 1.7, scaleY: 1.7, opacity: 1, rotation: -4 })
        .set(".flag-stripe", { attr: { x: 255, width: 90, rx: 0 } })
        .set("#stripe-top", { attr: { y: 30, height: 20 }, fill: "#74ACDF" })
        .set("#stripe-mid", { attr: { y: 50, height: 20 }, fill: "#FFFFFF" })
        .set("#stripe-bot", { attr: { y: 70, height: 20 }, fill: "#74ACDF" })
        .set("#flag-sun", { scale: 1, opacity: 1 })
        .set("#drop-group", { y: 0, opacity: 0, scaleY: 1, scaleX: 1 })

        .set("#master-cup", { y: 200, opacity: 0, rotation: 0, scaleY: 1, scaleX: 1 })
        .set("#saucer-group", { y: 100, opacity: 0, scale: 0.8 })
        .set("#shadow", { x: 0, scale: 0, opacity: 0 })

        .set("#top-opening", { scaleY: 1, opacity: 1 })
        .set("#liquid-bulge-group", { scaleY: 0, opacity: 0 })
        .set("#cup-bottom-group", { scaleY: 0, opacity: 0 })
        .set(".splash, .splash-impact, .splash-land", { opacity: 0, x: 0, y: 0, scale: 1, scaleY: 1, scaleX: 1 })
        .set(".float-part", { opacity: 0, x: 0, y: 0, scale: 1 })
        .set("#liquid-surface-container", { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, opacity: 1 })
        .set("#handle-group", { x: 0, scaleX: 1, rotation: 0 })
        .set("#handle-shadow", { x: -5, y: 5 })
        .set("#bicolor-ripple", { attr: { rx: 0, ry: 0 }, opacity: 0 })
        
        .set("#confetti-group", { opacity: 0 })
        .set(".burst-line", { y: 0, scaleY: 0.1, opacity: 1, transformOrigin: "center bottom" })
        .set(".spiral-path", { strokeDasharray: "250 2000", strokeDashoffset: 250 });

      // ------------------------------------------
      // FASE 1: BANDERA DE ARGENTINA SOLA DESDE EL PRINCIPIO (ONDEANDO DEBAJO DEL TEXTO)
      // ------------------------------------------
      // Ondea debajo del texto "Este 25 de Mayo" de 0s a 1.5s (Frame 0 a 45)
      animation.to("#flag-group", { rotation: 4, duration: 0.75, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0);
      
      // Entrada pop elástica un ratito después del texto "Este" (t = 0.4s / Frame 12)
      animation.to("#flag-group", { scaleX: 1.7, scaleY: 1.7, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }, 0.4);

      // ------------------------------------------
      // FASE 2: COMIENZA LA ANIMACIÓN EN EL MOMENTO DEL TÍTULO (A PARTIR DE 1.5s / FRAME 45)
      // El squash ocurre directamente en la parte inferior para catapultarse hacia arriba
      // ------------------------------------------
      // Squash (sincronizado al beat del frame 47, t = 1.567s)
      const startSec = 47 / 30; // 1.567s
      animation.to("#flag-group", { y: 380, scaleY: 1.36, scaleX: 2.2, rotation: 0, duration: 0.3, ease: "power2.in" }, startSec)
        // Salto vertical y estiramiento a speed line (catapulta hacia arriba)
        .to("#flag-group", { y: -80, scaleY: 2.2, scaleX: 2.2, duration: 0.35, ease: "power1.out" }, startSec + 0.3)
        .to(".flag-stripe", { attr: { x: 298, width: 4, rx: 2 }, duration: 0.25, ease: "power2.in" }, startSec + 0.3)
        .to(["#stripe-top", "#stripe-mid", "#stripe-bot"], { attr: { y: 10, height: 100 }, duration: 0.25, ease: "power2.in" }, startSec + 0.3)
        .to("#flag-sun", { scale: 0, opacity: 0, duration: 0.15 }, startSec + 0.3)

        // Colapso a gota redonda bicolor (ocurre arriba)
        .to(".flag-stripe", { attr: { x: 291, width: 18, rx: 9 }, duration: 0.2, ease: "back.out(1.5)" }, startSec + 0.65)
        .to(["#stripe-top", "#stripe-mid", "#stripe-bot"], { attr: { y: 51, height: 18 }, duration: 0.2, ease: "back.out(1.5)" }, startSec + 0.65)

        .to("#flag-group", { opacity: 0, duration: 0.05 }, startSec + 0.8)
        .set("#drop-group", { y: -80, opacity: 1, scaleY: 1, scaleX: 1 }, startSec + 0.8)
        .to("#drop-group", { y: -85, duration: 0.25, ease: "sine.out" }, startSec + 0.8)

        // APARECE LA TAZA Y EL PLATO en el centro (mientras la gota está arriba)
        .to("#master-cup", { y: 0, opacity: 1, duration: 0.9, ease: "elastic.out(1, 0.7)" }, startSec + 0.4)
        .to("#saucer-group", { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "elastic.out(1, 0.7)" }, startSec + 0.4)
        .to("#shadow", { scale: 1, opacity: 1, duration: 0.9, ease: "elastic.out(1, 0.7)" }, startSec + 0.4);

      // ------------------------------------------
      // FASE 3: CAE LA GOTA Y EFECTO BICOLOR (impacto en frame 94 / t = 3.133s)
      // ------------------------------------------
      const impact = 94 / 30; // 3.133s (exacto en el beat del frame 94)

      animation.to("#drop-group", { y: 195, scaleY: 1.6, scaleX: 0.6, duration: 0.28, ease: "power2.in" }, impact - 0.28)
        .set("#drop-group", { opacity: 0 }, impact);

      // IMPACTO Y EXPANSIÓN DE LA ONDA BICOLOR
      animation.to("#master-cup", { y: 20, scaleY: 0.95, scaleX: 1.02, rotation: -2, duration: 0.15, ease: "power2.out" }, impact)
        .to("#saucer-group", { y: 20, scaleY: 0.95, scaleX: 1.02, duration: 0.15, ease: "power2.out" }, impact)
        .to("#shadow", { x: 5, scale: 0.9, opacity: 0.7, duration: 0.15, ease: "power2.out" }, impact)
        .to("#top-opening", { scaleY: 0, opacity: 0, duration: 0.1 }, impact)
        .to("#handle-group", { x: -3, scaleX: 0.95, duration: 0.15, ease: "power2.out" }, impact)
        .to("#liquid-bulge-group", { scaleY: 1, opacity: 1, duration: 0.2, ease: "back.out(1.5)" }, impact)
        .to("#cup-bottom-group", { scaleY: 2.2, opacity: 1, duration: 0.2, ease: "power2.out" }, impact)

        // Animación de mezcla
        .set("#bicolor-ripple", { opacity: 1 }, impact)
        .to("#bicolor-ripple", { attr: { rx: 90, ry: 25 }, duration: 0.35, ease: "power2.out" }, impact)
        .to("#bicolor-ripple", { opacity: 0, duration: 1.2, ease: "sine.inOut" }, impact + 1.2)

        // Salpicaduras
        .set(".splash-impact", { opacity: 1, x: 0, y: 0, scaleX: 1.5, scaleY: 0.5 }, impact)
        .to("#splash-imp-1", { x: -65, y: -60, duration: 0.3, ease: "power2.out" }, impact)
        .to("#splash-imp-2", { x: 55, y: -50, duration: 0.25, ease: "power2.out" }, impact)
        .to("#splash-imp-3", { x: -25, y: -70, duration: 0.35, ease: "power2.out" }, impact)
        .to("#splash-imp-4", { x: -80, y: -40, duration: 0.35, ease: "power2.out" }, impact)
        .to("#splash-imp-5", { x: 75, y: -35, duration: 0.3, ease: "power2.out" }, impact)
        .to("#splash-imp-6", { x: 15, y: -95, duration: 0.4, ease: "power2.out" }, impact)
        .to(".splash-impact", { opacity: 0, duration: 0.15 }, impact + 0.15);

      // SALTO AÉREO (La taza se despega del plato)
      const rebound = impact + 0.45;
      animation.to("#master-cup", { y: 25, scaleY: 0.8, scaleX: 1.1, rotation: -6, duration: 0.15, ease: "power2.in" }, rebound - 0.15)
        .to("#saucer-group", { y: 22, scaleY: 0.9, scaleX: 1.05, rotation: 4, duration: 0.15, ease: "power2.in" }, rebound - 0.15)

        .to("#master-cup", { y: -90, rotation: 35, scaleY: 1.08, scaleX: 0.95, duration: 0.45, ease: "power2.out" }, rebound)
        .to("#saucer-group", { y: -12, rotation: -12, scaleY: 1, scaleX: 1, duration: 0.45, ease: "power2.out" }, rebound)

        .to("#shadow", { x: -10, scale: 0.7, opacity: 0.5, duration: 0.45, ease: "power2.out" }, rebound)
        .to("#handle-group", { x: -18, scaleX: 0.75, rotation: 5, duration: 0.45, ease: "power2.out" }, rebound)
        .to("#top-opening", { scaleY: 1, opacity: 1, duration: 0.3, ease: "power2.out" }, rebound)
        .to("#liquid-bulge-group", { scaleY: 0, opacity: 0, duration: 0.25, ease: "power2.in" }, rebound)
        .to("#cup-bottom-group", { scaleY: 0, opacity: 0, duration: 0.15 }, rebound)

        // Gotas aéreas
        .set(".splash", { opacity: 1, x: 0, y: 0, scaleX: 0.6, scaleY: 1.8 }, rebound)
        .to("#splash-1", { y: -130, x: -10, duration: 0.45, ease: "power2.out" }, rebound)
        .to("#splash-2", { y: -80, x: -35, duration: 0.35, ease: "power2.out" }, rebound)
        .to("#splash-3", { y: -100, x: 25, duration: 0.4, ease: "power2.out" }, rebound)
        .to("#splash-4", { y: -120, x: -50, duration: 0.4, ease: "power2.out" }, rebound)
        .to("#splash-5", { y: -60, x: 45, duration: 0.35, ease: "power2.out" }, rebound)
        .to("#splash-6", { y: -150, x: 10, duration: 0.5, ease: "power2.out" }, rebound);

      // EXPLOSIÓN DE LÍNEAS (Burst Radial) justo al impactar
      const explosionTime = impact + 0.05;
      animation.set("#confetti-group", { opacity: 1 }, explosionTime)
        .set(".burst-line", { y: 0, scaleY: 0.1, opacity: 1, transformOrigin: "center bottom" }, explosionTime)
        .to(".burst-line", { y: -50, scaleY: 1.5, duration: 0.2, ease: "power2.out", stagger: 0.005 }, explosionTime)
        .to(".burst-line", { y: -100, scaleY: 0, opacity: 0, duration: 0.2, ease: "power1.in", stagger: 0.005 }, explosionTime + 0.2);

      // ESPIRAL 3D ENVOLVENTE (segmentos de trazos coordinados)
      const spiralTime = impact + 0.25;
      const colors = ["blue", "white", "yellow"];
      colors.forEach((color, i) => {
        const delay = spiralTime + (i * 0.12);
        animation.to(`.spiral-front-1.spiral-${color}`, { strokeDashoffset: -600, duration: 0.35, ease: "power1.in" }, delay)
          .to(`.spiral-back.spiral-${color}`, { strokeDashoffset: -600, duration: 0.35, ease: "none" }, delay + 0.15)
          .to(`.spiral-front-2.spiral-${color}`, { strokeDashoffset: -600, duration: 0.35, ease: "power1.out" }, delay + 0.15 * 2);
      });

      // ATERRIZAJE Y OLEAJE (La taza aterriza y el plato se hunde un poco)
      const settle = rebound + 0.55;
      const landTime = 0.6;
      animation.to("#master-cup", { y: 0, rotation: 0, scaleY: 1.1, scaleX: 0.95, duration: landTime - 0.1, ease: "power2.in" }, settle)
        .to("#saucer-group", { y: 0, rotation: 0, duration: landTime - 0.1, ease: "power2.in" }, settle)
        .to("#shadow", { x: 0, scale: 1, opacity: 1, duration: landTime, ease: "power2.inOut" }, settle)

        .to("#saucer-group", { y: 10, scaleY: 0.9, duration: 0.15, ease: "power2.out" }, settle + landTime - 0.1)

        .to(["#master-cup", "#saucer-group"], { y: 8, scaleY: 0.85, scaleX: 1.12, duration: 0.15, ease: "power2.out" }, settle + landTime - 0.1)
        .to(["#master-cup", "#saucer-group"], { y: 0, scaleY: 1, scaleX: 1, duration: 0.5, ease: "elastic.out(1.2, 0.4)" }, settle + landTime + 0.05)
        .to("#handle-group", { x: 0, scaleX: 1, rotation: 0, duration: landTime + 0.4, ease: "sine.inOut" }, settle)
        .to(".splash", { y: -10, x: 0, scale: 0, opacity: 0, duration: 0.4, ease: "power2.in" }, settle)

        // Oleaje
        .to("#liquid-surface-container", { rotation: 10, scaleX: 1.05, scaleY: 0.8, duration: 0.2, ease: "power2.out" }, settle + landTime - 0.1)
        .to("#liquid-surface-container", { rotation: -5, scaleX: 0.96, scaleY: 1.1, duration: 0.3, ease: "back.out(1.2)" }, settle + landTime + 0.1)
        .to("#liquid-surface-container", { rotation: 2, scaleX: 1.01, scaleY: 0.95, duration: 0.35, ease: "sine.inOut" }, settle + landTime + 0.4)
        .to("#liquid-surface-container", { rotation: 0, scaleX: 1, scaleY: 1, duration: 0.4, ease: "sine.out" }, settle + landTime + 0.75)

        // Partículas de aterrizaje
        .set(".splash-land", { opacity: 1, x: 0, y: 0, scaleX: 1.3, scaleY: 0.7 }, settle + landTime - 0.1)
        .to("#splash-land-1", { x: -35, y: -30, duration: 0.25, ease: "power2.out" }, settle + landTime - 0.1)
        .to("#splash-land-2", { x: 30, y: -20, duration: 0.2, ease: "power2.out" }, settle + landTime - 0.1)
        .to("#splash-land-3", { x: -45, y: -15, duration: 0.25, ease: "power2.out" }, settle + landTime - 0.1)
        .to("#splash-land-4", { x: 45, y: -10, duration: 0.2, ease: "power2.out" }, settle + landTime - 0.1)
        .to("#splash-land-5", { x: -10, y: -45, duration: 0.3, ease: "power2.out" }, settle + landTime - 0.1)
        .to(".splash-land", { opacity: 0, scale: 0, duration: 0.15 }, settle + landTime + 0.1)

        // Partículas aromáticas
        .set(".float-part", { opacity: 1, x: 0, y: 0, scale: 0.5 }, settle + landTime + 0.1)
        .to("#fp-1", { keyframes: [{ y: -30, x: -25, scale: 1.5, ease: "back.out(1.2)", duration: 0.5 }, { y: -50, x: -10, scale: 0, opacity: 0, ease: "sine.in", duration: 0.7 }] }, settle + landTime + 0.1)
        .to("#fp-2", { keyframes: [{ y: -25, x: 15, scale: 1.3, ease: "back.out(1.2)", duration: 0.6 }, { y: -45, x: 5, scale: 0, opacity: 0, ease: "sine.in", duration: 0.9 }] }, settle + landTime + 0.2)
        .to("#fp-3", { keyframes: [{ y: -35, x: -15, scale: 1.2, ease: "back.out(1.2)", duration: 0.5 }, { y: -60, x: 0, scale: 0, opacity: 0, ease: "sine.in", duration: 0.8 }] }, settle + landTime + 0.3)
        .to("#fp-4", { keyframes: [{ y: -20, x: 25, scale: 1.4, ease: "back.out(1.2)", duration: 0.5 }, { y: -40, x: 10, scale: 0, opacity: 0, ease: "sine.in", duration: 0.9 }] }, settle + landTime + 0.15)
        .to("#fp-5", { keyframes: [{ y: -40, x: 10, scale: 1.6, ease: "back.out(1.2)", duration: 0.6 }, { y: -65, x: -5, scale: 0, opacity: 0, ease: "sine.in", duration: 1.0 }] }, settle + landTime + 0.25);

      // Animación de la iluminación grande (flote suave constante)
      animation.to("#surface-highlights", {
        x: 6, y: -1.5, scaleX: 1.15, scaleY: 0.85, rotation: 2,
        duration: 1.3, yoyo: true, repeat: 1, ease: "sine.inOut"
      }, settle);

      // Animación continua de burbujas en el café
      animation.to("#liquid-bubbles circle", {
        keyframes: [
          { y: -6, x: 4, scale: 1.5, opacity: 0.8, duration: 0.8, ease: "sine.inOut" },
          { y: -15, x: -3, scale: 0, opacity: 0, duration: 1.0, ease: "power2.in" }
        ],
        stagger: { each: 0.3 }
      }, settle);

      tlRef.current = animation;
      animation.seek(frame / fps);
      continueRender(handle);
    }, containerRef.current || undefined);

    return () => ctx.revert();
  }, []);

  // Sincronizar el cabezal de Remotion con el seek de GSAP
  useEffect(() => {
    if (tlRef.current) {
      const timeInSeconds = frame / fps;
      tlRef.current.seek(timeInSeconds);
    }
  }, [frame, fps]);

  return (
    <div ref={containerRef} style={{ width: size, height: size, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <StaticCupSVG />
    </div>
  );
};
