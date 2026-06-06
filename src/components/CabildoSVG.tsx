import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const CabildoSVG: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
	const frame = useCurrentFrame();

	// Animación de aparición suave
	const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
	const translateY = interpolate(frame, [0, 30], [20, 0], { extrapolateRight: 'clamp' });

	// Colores
	const wall = '#F3E5AB'; // Crema/Vainilla
	const shadow = '#D4B872'; // Sombra crema
	const dark = '#4A3319';   // Interior de los arcos
	const highlight = '#FFF5D1';

	return (
		<div style={{ ...style, opacity, transform: `translateY(${translateY}px)` }}>
			<svg viewBox="0 0 400 400" width="100%" height="100%">
				<defs>
					<linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor={highlight} />
						<stop offset="100%" stopColor={wall} />
					</linearGradient>
					<linearGradient id="archGrad" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#2A1B0D" />
						<stop offset="100%" stopColor={dark} />
					</linearGradient>
					<filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
						<feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.3" />
					</filter>
				</defs>

				<g filter="url(#drop-shadow)">
					{/* ===== ALAS LATERALES ===== */}
					{/* Planta Baja */}
					<rect x="40" y="240" width="320" height="60" fill="url(#wallGrad)" />
					<rect x="40" y="240" width="320" height="4" fill={shadow} />
					
					{/* Planta Alta */}
					<rect x="40" y="190" width="320" height="50" fill={wall} />
					<rect x="40" y="190" width="320" height="4" fill={shadow} />
					<rect x="35" y="186" width="330" height="6" fill={shadow} rx="2" /> {/* Cornisa principal */}

					{/* Techo lateral */}
					<polygon points="40,186 60,170 340,170 360,186" fill="#C85A17" /> {/* Techo de tejas rojizas */}

					{/* ===== ARCOS LATERALES (Planta Baja) ===== */}
					{/* Ala Izquierda */}
					<path d="M 60 300 L 60 260 A 20 20 0 0 1 100 260 L 100 300 Z" fill="url(#archGrad)" />
					<path d="M 110 300 L 110 260 A 20 20 0 0 1 150 260 L 150 300 Z" fill="url(#archGrad)" />
					{/* Ala Derecha */}
					<path d="M 250 300 L 250 260 A 20 20 0 0 1 290 260 L 290 300 Z" fill="url(#archGrad)" />
					<path d="M 300 300 L 300 260 A 20 20 0 0 1 340 260 L 340 300 Z" fill="url(#archGrad)" />

					{/* ===== VENTANAS LATERALES (Planta Alta) ===== */}
					{/* Ala Izquierda */}
					<rect x="65" y="200" width="30" height="30" rx="15" fill="url(#archGrad)" />
					<rect x="115" y="200" width="30" height="30" rx="15" fill="url(#archGrad)" />
					{/* Ala Derecha */}
					<rect x="255" y="200" width="30" height="30" rx="15" fill="url(#archGrad)" />
					<rect x="305" y="200" width="30" height="30" rx="15" fill="url(#archGrad)" />

					{/* ===== CUERPO CENTRAL ===== */}
					{/* Base saliente */}
					<rect x="160" y="180" width="80" height="120" fill="url(#wallGrad)" />
					<rect x="156" y="240" width="88" height="6" fill={shadow} rx="2" /> {/* Cornisa media central */}
					
					{/* Gran arco central (Planta Baja) */}
					<path d="M 175 300 L 175 255 A 25 25 0 0 1 225 255 L 225 300 Z" fill="url(#archGrad)" />
					
					{/* Puerta/Balcón central (Planta Alta) */}
					<rect x="180" y="195" width="40" height="45" rx="20" fill="url(#archGrad)" />
					<rect x="175" y="235" width="50" height="5" fill="#333" /> {/* Reja balcón */}

					{/* ===== TORRE ===== */}
					{/* Primer nivel de la torre */}
					<rect x="170" y="140" width="60" height="40" fill={wall} />
					<rect x="166" y="136" width="68" height="6" fill={shadow} rx="2" /> {/* Cornisa torre 1 */}
					<rect x="190" y="150" width="20" height="30" rx="10" fill="url(#archGrad)" /> {/* Ventana torre */}

					{/* Segundo nivel de la torre (Cúpula base) */}
					<rect x="175" y="100" width="50" height="36" fill={wall} />
					<rect x="172" y="96" width="56" height="6" fill={shadow} rx="2" /> {/* Cornisa torre 2 */}
					<circle cx="200" cy="118" r="10" fill="#333" /> {/* Reloj o tragaluz */}

					{/* Cúpula */}
					<path d="M 180 96 Q 200 60 220 96 Z" fill={shadow} />
					<path d="M 185 96 Q 200 65 215 96 Z" fill={wall} />
					
					{/* Linterna y Cruz */}
					<rect x="196" y="55" width="8" height="10" fill={shadow} />
					<rect x="198" y="35" width="4" height="20" fill="#333" /> {/* Palo vertical cruz */}
					<rect x="194" y="42" width="12" height="4" fill="#333" /> {/* Palo horizontal cruz */}

					{/* Detalles decorativos (Pináculos) */}
					<polygon points="160,180 165,160 170,180" fill={shadow} />
					<polygon points="230,180 235,160 240,180" fill={shadow} />
					<polygon points="170,136 173,120 176,136" fill={shadow} />
					<polygon points="224,136 227,120 230,136" fill={shadow} />
				</g>
			</svg>
		</div>
	);
};
