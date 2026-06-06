import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

// Coffee Bean SVG
export const CoffeeBean: React.FC<{ size?: number; color?: string }> = ({ size = 50, color = '#5C3A21' }) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path
			d="M50 15 C20 15 10 45 10 55 C10 85 40 95 50 95 C80 95 90 65 90 55 C90 25 60 15 50 15 Z"
			fill={color}
		/>
		<path
			d="M45 20 C60 45 30 65 55 90"
			fill="none"
			stroke="#3D2616"
			strokeWidth={4}
			strokeLinecap="round"
		/>
	</svg>
);

// Coffee Cup SVG
export const CoffeeCup: React.FC<{ size?: number }> = ({ size = 150 }) => {
	const frame = useCurrentFrame();
	const steam1 = Math.sin(frame * 0.05) * 5;
	const steam2 = Math.cos(frame * 0.04) * 5;

	return (
		<svg width={size} height={size} viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }}>
			{/* Steam */}
			<path d={`M 80 80 Q ${70 + steam1} 60 80 40 T 80 10`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
			<path d={`M 100 80 Q ${110 + steam2} 55 100 30 T 100 0`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
			<path d={`M 120 80 Q ${110 + steam1} 65 120 50 T 120 20`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.4} />
			
			{/* Cup handle */}
			<path d="M 140 100 C 180 100 180 140 140 140" fill="none" stroke="#F6B40E" strokeWidth={15} strokeLinecap="round" />
			
			{/* Cup body */}
			<path d="M 50 80 L 150 80 C 150 140 120 170 100 170 C 80 170 50 140 50 80 Z" fill="#FDF8E7" />
			
			{/* Cup rim */}
			<ellipse cx={100} cy={80} rx={50} ry={15} fill="#F6B40E" />
			<ellipse cx={100} cy={80} rx={45} ry={10} fill="#5C3A21" />
			
			{/* Saucer */}
			<ellipse cx={100} cy={170} rx={70} ry={15} fill="#FDF8E7" />
			<path d="M 40 170 Q 100 190 160 170" fill="none" stroke="#F6B40E" strokeWidth={4} />
		</svg>
	);
};

// Espresso Machine SVG
export const CoffeeMachine: React.FC<{ size?: number }> = ({ size = 250 }) => {
	const frame = useCurrentFrame();
	// Pouring animation (liquid going down)
	const pourOffset = (frame * 5) % 20;

	return (
		<svg width={size} height={size} viewBox="0 0 300 300" style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))' }}>
			{/* Machine Body */}
			<rect x="50" y="50" width="200" height="220" rx="20" fill="#2A3B4C" />
			<rect x="70" y="70" width="160" height="80" rx="10" fill="#1A2530" />
			
			{/* Dials / Buttons */}
			<circle cx="100" cy="110" r="15" fill="#F6B40E" />
			<circle cx="150" cy="110" r="10" fill="#FDF8E7" />
			<circle cx="200" cy="110" r="10" fill="#FDF8E7" />
			
			{/* Group Head */}
			<path d="M 130 150 L 170 150 L 160 180 L 140 180 Z" fill="#74ACDF" />
			<rect x="145" y="180" width="10" height="10" fill="#5C3A21" />
			
			{/* Portafilter handle */}
			<path d="M 130 165 L 80 175" fill="none" stroke="#1A2530" strokeWidth={12} strokeLinecap="round" />
			
			{/* Coffee Pouring (animated dash array) */}
			<line x1="150" y1="190" x2="150" y2="240" stroke="#5C3A21" strokeWidth={6} strokeDasharray="12 8" strokeDashoffset={-pourOffset} />
			
			{/* Small cup */}
			<path d="M 130 240 L 170 240 C 170 260 160 270 150 270 C 140 270 130 260 130 240 Z" fill="#FDF8E7" />
			<path d="M 170 245 C 185 245 185 260 170 260" fill="none" stroke="#FDF8E7" strokeWidth={4} strokeLinecap="round" />
			
			{/* Drip tray */}
			<rect x="60" y="270" width="180" height="15" rx="5" fill="#74ACDF" />
			<line x1="70" y1="275" x2="230" y2="275" stroke="#2A3B4C" strokeWidth={2} strokeDasharray="5 5" />
		</svg>
	);
};

// Combined Espresso Machine serving a Big Cup
export const CoffeeMachineWithCup: React.FC<{ size?: number }> = ({ size = 350 }) => {
	const frame = useCurrentFrame();
	const pourOffset = (frame * 6) % 20;
	const steam1 = Math.sin(frame * 0.05) * 5;
	const steam2 = Math.cos(frame * 0.04) * 5;

	return (
		<svg width={size} height={size * 0.8} viewBox="0 0 400 320" style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))' }}>
			{/* Machine Body */}
			<rect x="30" y="30" width="220" height="260" rx="20" fill="#2A3B4C" />
			<rect x="50" y="50" width="180" height="90" rx="10" fill="#1A2530" />
			
			{/* Dials / Buttons */}
			<circle cx="80" cy="95" r="18" fill="#F6B40E" />
			<circle cx="140" cy="95" r="12" fill="#FDF8E7" />
			<circle cx="190" cy="95" r="12" fill="#FDF8E7" />
			
			{/* Group Head */}
			<path d="M 160 140 L 220 140 L 205 180 L 175 180 Z" fill="#74ACDF" />
			<rect x="180" y="180" width="20" height="15" fill="#5C3A21" />
			
			{/* Portafilter handle */}
			<path d="M 160 160 L 90 175" fill="none" stroke="#1A2530" strokeWidth={15} strokeLinecap="round" />
			
			{/* Coffee Pouring */}
			<line x1="190" y1="195" x2="190" y2="260" stroke="#5C3A21" strokeWidth={8} strokeDasharray="12 8" strokeDashoffset={-pourOffset} />
			
			{/* Drip tray extending wide */}
			<rect x="20" y="290" width="360" height="20" rx="8" fill="#74ACDF" />
			<line x1="30" y1="300" x2="370" y2="300" stroke="#2A3B4C" strokeWidth={3} strokeDasharray="8 8" />

			{/* Big Cup receiving coffee */}
			<g transform="translate(100, 140) scale(0.9)">
				{/* Steam */}
				<path d={`M 80 60 Q ${70 + steam1} 40 80 20 T 80 -10`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
				<path d={`M 120 60 Q ${130 + steam2} 35 120 10 T 120 -20`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
				
				{/* Cup handle */}
				<path d="M 140 100 C 180 100 180 140 140 140" fill="none" stroke="#F6B40E" strokeWidth={15} strokeLinecap="round" />
				
				{/* Cup body */}
				<path d="M 50 80 L 150 80 C 150 140 120 170 100 170 C 80 170 50 140 50 80 Z" fill="#FDF8E7" />
				
				{/* Cup rim */}
				<ellipse cx={100} cy={80} rx={50} ry={15} fill="#F6B40E" />
				<ellipse cx={100} cy={80} rx={45} ry={10} fill="#5C3A21" />
			</g>
		</svg>
	);
};

export const FloatingBeans: React.FC = () => {
	const frame = useCurrentFrame();
	const beans = [
		{ x: 10, y: 15, delay: 0, scale: 1 },
		{ x: 85, y: 20, delay: 20, scale: 0.8 },
		{ x: 20, y: 75, delay: 40, scale: 1.2 },
		{ x: 80, y: 65, delay: 10, scale: 0.9 },
		{ x: 50, y: 85, delay: 30, scale: 0.7 },
		{ x: 5,  y: 50, delay: 15, scale: 0.85 },
		{ x: 90, y: 45, delay: 25, scale: 1.1 },
	];

	return (
		<>
			{beans.map((b, i) => {
				const yOff = Math.sin((frame - b.delay) * 0.05) * 30;
				const rot = (frame - b.delay) * 0.5;
				// A subtle entry animation
				const op = interpolate(frame - b.delay, [0, 20], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
				return (
					<div key={i} style={{
						position: 'absolute',
						left: `${b.x}%`,
						top: `calc(${b.y}% + ${yOff}px)`,
						transform: `scale(${b.scale}) rotate(${rot}deg)`,
						opacity: op,
						zIndex: 15
					}}>
						<CoffeeBean size={80} color="#85340A" />
					</div>
				);
			})}
		</>
	);
};
