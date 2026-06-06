import React from 'react';
import { AbsoluteFill } from 'remotion';

export const CollageFrame: React.FC<{
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({ children, style }) => {
	return (
		<div
			style={{
				backgroundColor: '#2c210c',
				border: 'none',
				boxShadow: '15px 15px 0px #f7edb0', /* Sombra plana amarilla (flat 2D) */
				borderRadius: '40px',
				overflow: 'hidden',
				position: 'relative',
				...style,
			}}
		>
			<AbsoluteFill>{children}</AbsoluteFill>
		</div>
	);
};
