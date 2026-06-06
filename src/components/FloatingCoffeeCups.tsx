import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

const BRAND_YELLOW = '#f7edb0';

interface Cup {
	x: number;
	y: number;
	size: number;
	speed: number;
	delay: number;
	opacity: number;
	rotation: number;
	rotationSpeed: number;
}

// Define random-ish but balanced positions
const CUPS: Cup[] = [
	{ x: 12,  y: 110, size: 100, speed: 0.6,  delay: 0,   opacity: 0.35, rotation: -10, rotationSpeed: 0.4 },
	{ x: 88,  y: 95,  size: 130, speed: 0.8,  delay: 15,  opacity: 0.25, rotation: 15,  rotationSpeed: -0.3 },
	{ x: 48,  y: 125, size: 85,  speed: 0.5,  delay: 5,   opacity: 0.45, rotation: 5,   rotationSpeed: 0.5 },
	{ x: 5,   y: 75,  size: 110, speed: 0.7,  delay: 25,  opacity: 0.20, rotation: -20, rotationSpeed: -0.6 },
	{ x: 95,  y: 35,  size: 95,  speed: 0.55, delay: 10,  opacity: 0.30, rotation: 12,  rotationSpeed: 0.35 },
	{ x: 22,  y: 25,  size: 115, speed: 0.65, delay: 35,  opacity: 0.28, rotation: -8,  rotationSpeed: -0.45 },
	{ x: 75,  y: 55,  size: 105, speed: 0.75, delay: 45,  opacity: 0.35, rotation: 18,  rotationSpeed: 0.55 },
	{ x: 40,  y: 10,  size: 90,  speed: 0.48, delay: 20,  opacity: 0.25, rotation: -15, rotationSpeed: 0.25 },
];

const CupIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => {
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" fill="none">
			{/* Cup Body - Semi-transparent fill */}
			<path 
				d="M25 45 C25 75 35 88 50 88 C65 88 75 75 75 45 L25 45 Z" 
				stroke={color} 
				strokeWidth="2.5" 
				fill={color}
				fillOpacity="0.05"
			/>
			{/* Cup Handle */}
			<path 
				d="M75 52 C85 52 92 60 88 72 C85 82 78 78 75 72" 
				stroke={color} 
				strokeWidth="2.5" 
				fill="none" 
			/>
			{/* Coffee Level (Transparent/Subtle) */}
			<path 
				d="M30 55 C30 72 38 82 50 82 C62 82 70 72 70 55 L30 55 Z" 
				fill={color} 
				fillOpacity="0.15" 
			/>
			{/* Rim Detail */}
			<ellipse cx="50" cy="45" rx="25" ry="6" stroke={color} strokeWidth="2.5" fill="none" />
			{/* Subtle Steam Line */}
			<path 
				d="M45 30 Q50 20 55 30 Q60 40 65 30" 
				stroke={color} 
				strokeWidth="1.5" 
				strokeDasharray="4 4"
				opacity="0.4"
				fill="none"
			/>
		</svg>
	);
};

const FloatingCup: React.FC<{ cup: Cup; frame: number }> = ({ cup, frame }) => {
	const localFrame = Math.max(0, frame - cup.delay);
	
	// Fade in at the start of the sequence
	const fadeIn = interpolate(localFrame, [0, 30], [0, 1], { 
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp' 
	});
	
	// Movement: Floating upwards slightly with looping-like behavior
	// Using a simple drift that resets to keep it in view if needed, 
	// but for a short sequence (4.5s), a single drift is enough.
	const drift = localFrame * cup.speed;
	const rotation = cup.rotation + localFrame * cup.rotationSpeed;
	
	const style: React.CSSProperties = {
		position: 'absolute',
		left: `${cup.x}%`,
		top: `calc(${cup.y}% - ${drift}px)`,
		opacity: cup.opacity * fadeIn,
		transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
		pointerEvents: 'none',
	};

	return (
		<div style={style}>
			<CupIcon size={cup.size} color={BRAND_YELLOW} />
		</div>
	);
};

export const FloatingCoffeeCups: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
	const frame = useCurrentFrame();

	return (
		<div style={{ 
			position: 'absolute', 
			inset: 0, 
			overflow: 'hidden', 
			pointerEvents: 'none',
			...style 
		}}>
			{CUPS.map((cup, i) => (
				<FloatingCup key={i} cup={cup} frame={frame} />
			))}
		</div>
	);
};
