import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

const BRAND_YELLOW = '#f7edb0';

interface Shape {
	x: number;
	y: number;
	size: number;
	type: 'circle-ring' | 'diamond' | 'cross' | 'dot-ring' | 'circle-fill';
	speed: number;  // vertical drift multiplier
	delay: number;  // start offset in frames
	opacity: number;
	rotation: number;
	rotationSpeed: number;
}

const SHAPES: Shape[] = [
	{ x: 8,   y: 12,  size: 110, type: 'circle-ring',  speed: 0.45, delay: 0,   opacity: 0.35, rotation: 0,   rotationSpeed: 0.5 },
	{ x: 88,  y: 20,  size: 70,  type: 'diamond',       speed: 0.6,  delay: 10,  opacity: 0.30, rotation: 45,  rotationSpeed: -0.7 },
	{ x: 20,  y: 75,  size: 50,  type: 'dot-ring',      speed: 0.4,  delay: 5,   opacity: 0.40, rotation: 0,   rotationSpeed: 0.35 },
	{ x: 75,  y: 65,  size: 140, type: 'circle-ring',   speed: 0.3,  delay: 18,  opacity: 0.25, rotation: 0,   rotationSpeed: -0.3 },
	{ x: 50,  y: 88,  size: 85,  type: 'diamond',       speed: 0.55, delay: 8,   opacity: 0.30, rotation: 30,  rotationSpeed: 0.6 },
	{ x: 92,  y: 48,  size: 60,  type: 'cross',         speed: 0.42, delay: 22,  opacity: 0.35, rotation: 0,   rotationSpeed: 0.9 },
	{ x: 60,  y: 10,  size: 95,  type: 'dot-ring',      speed: 0.35, delay: 14,  opacity: 0.25, rotation: 0,   rotationSpeed: -0.45 },
	{ x: 5,   y: 50,  size: 65,  type: 'cross',         speed: 0.55, delay: 6,   opacity: 0.35, rotation: 45,  rotationSpeed: 0.7 },
	{ x: 80,  y: 85,  size: 75,  type: 'circle-ring',   speed: 0.45, delay: 20,  opacity: 0.30, rotation: 0,   rotationSpeed: 0.4 },
	{ x: 68,  y: 38,  size: 120, type: 'diamond',       speed: 0.28, delay: 25,  opacity: 0.20, rotation: 15,  rotationSpeed: -0.55 },
];

const ShapeEl: React.FC<{ shape: Shape; frame: number }> = ({ shape, frame }) => {
	const localFrame = Math.max(0, frame - shape.delay);

	const fadeIn = interpolate(localFrame, [0, 30], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const drift = (localFrame * shape.speed) % 180;  // loops slightly further
	const currentRotation = shape.rotation + localFrame * shape.rotationSpeed;

	const style: React.CSSProperties = {
		position: 'absolute',
		left: `${shape.x}%`,
		top: `calc(${shape.y}% - ${drift}px)`,
		width: shape.size,
		height: shape.size,
		opacity: shape.opacity * fadeIn,
		transform: `translate(-50%, -50%) rotate(${currentRotation}deg)`,
		pointerEvents: 'none',
	};

	const color = BRAND_YELLOW;
	const s = shape.size;

	switch (shape.type) {
		case 'circle-ring':
			return (
				<div style={style}>
					<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
						<circle cx={s / 2} cy={s / 2} r={s / 2 - 4} fill="none" stroke={color} strokeWidth="4.5" />
					</svg>
				</div>
			);
		case 'dot-ring':
			return (
				<div style={style}>
					<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
						<circle cx={s / 2} cy={s / 2} r={s / 2 - 4} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="6 8" />
						<circle cx={s / 2} cy={s / 2} r={6} fill={color} />
					</svg>
				</div>
			);
		case 'diamond':
			return (
				<div style={style}>
					<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
						<polygon
							points={`${s / 2},4 ${s - 4},${s / 2} ${s / 2},${s - 4} 4,${s / 2}`}
							fill="none"
							stroke={color}
							strokeWidth="4"
						/>
					</svg>
				</div>
			);
		case 'cross':
			return (
				<div style={style}>
					<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
						<line x1={s / 2} y1={0} x2={s / 2} y2={s} stroke={color} strokeWidth="4" />
						<line x1={0} y1={s / 2} x2={s} y2={s / 2} stroke={color} strokeWidth="4" />
					</svg>
				</div>
			);
		case 'circle-fill':
			return (
				<div style={style}>
					<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
						<circle cx={s / 2} cy={s / 2} r={s / 2} fill={color} />
					</svg>
				</div>
			);
		default:
			return null;
	}
};

export const FloatingMotionGraphics: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
	const frame = useCurrentFrame();

	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				overflow: 'hidden',
				pointerEvents: 'none',
				zIndex: 0,
				...style,
			}}
		>
			{SHAPES.map((shape, i) => (
				<ShapeEl key={i} shape={shape} frame={frame} />
			))}
		</div>
	);
};
