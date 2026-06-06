import React from 'react';
import { useCurrentFrame, interpolate, Easing, Img, staticFile } from 'remotion';

export const Logo: React.FC<{ 
	color?: string;
	type?: 'svg' | 'image';
}> = ({ color = '#2c210c', type = 'svg' }) => {
	const frame = useCurrentFrame();
	
	if (type === 'image') {
		const scale = interpolate(frame, [0, 30], [0.8, 1], {
			easing: Easing.out(Easing.quad),
			extrapolateRight: 'clamp',
		});
		const opacity = interpolate(frame, [0, 20], [0, 1], {
			extrapolateRight: 'clamp',
		});

		return (
			<div
				style={{
					width: '800px', // Larger size
					height: '800px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					transform: `scale(${scale})`,
					opacity,
				}}
			>
				<Img
					src={staticFile('assets/logoAmarillo.png')}
					style={{ 
						width: '100%', 
						height: '100%', 
						objectFit: 'contain'
					}}
				/>
			</div>
		);
	}

	const drawProgress = interpolate(frame, [0, 60], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.4, 0, 0.2, 1),
	});

	return (
		<svg width="400" height="400" viewBox="0 0 400 400">
			<path
				d="M 150 150 Q 150 250 200 250 T 250 150 M 150 150 L 250 150 M 250 180 C 300 180 300 220 250 220"
				fill="none"
				stroke={color}
				strokeWidth="8"
				strokeLinecap="round"
				strokeDasharray="1000"
				strokeDashoffset={drawProgress * 1000}
			/>
		</svg>
	);
};
