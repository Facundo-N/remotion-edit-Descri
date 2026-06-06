import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export const AnimatedSteam: React.FC<{
	width: number;
	height: number;
	color?: string;
}> = ({ width, height, color = '#2c210c' }) => {
	const frame = useCurrentFrame();
	
	const opacity = interpolate(
		(frame % 90),
		[0, 45, 90],
		[0, 0.4, 0],
		{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
	);

	const offset = interpolate(
		(frame % 150),
		[0, 150],
		[100, -100]
	);

	return (
		<svg width={width} height={height} viewBox="0 0 100 200" style={{ overflow: 'visible' }}>
			{[10, 50, 90].map((x, i) => (
				<path
					key={i}
					d={`M ${x} 180 Q ${x + 20} 130 ${x} 80 T ${x} 0`}
					fill="none"
					stroke={color}
					strokeWidth="4"
					strokeLinecap="round"
					strokeDasharray="10 20"
					strokeDashoffset={offset + (i * 20)}
					opacity={opacity}
				/>
			))}
		</svg>
	);
};
