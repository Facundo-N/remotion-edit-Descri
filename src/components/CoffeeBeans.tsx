import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const CoffeeBeans: React.FC = () => {
	const frame = useCurrentFrame();
	const { width, height } = useVideoConfig();

	const beans = Array.from({ length: 15 }).map((_, i) => ({
		x: (i * 137) % width,
		y: (i * 223) % height,
		size: 20 + (i % 5) * 10,
		delay: i * 5,
		speed: 1 + (i % 3),
	}));

	return (
		<>
			{beans.map((bean, i) => {
				const floatY = Math.sin((frame + bean.delay) / 15) * 20;
				const rotate = (frame + bean.delay) * 0.5;
				
				return (
					<svg
						key={i}
						width={bean.size}
						height={bean.size}
						viewBox="0 0 100 100"
						style={{
							position: 'absolute',
							left: bean.x,
							top: bean.y + floatY,
							transform: `rotate(${rotate}deg)`,
							opacity: 0.15,
						}}
					>
						<ellipse
							cx="50"
							cy="50"
							rx="40"
							ry="25"
							fill="#f7edb0"
						/>
						<path
							d="M 20 50 Q 50 45 80 50"
							stroke="#1a1407"
							strokeWidth="4"
							fill="none"
						/>
					</svg>
				);
			})}
		</>
	);
};
