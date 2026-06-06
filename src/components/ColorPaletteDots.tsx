import React from 'react';

const COLORS = ['#f7edb0', '#fbab4a', '#2c210c', '#e5d9a0'];

export const ColorPaletteDots: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '10px',
				...style,
			}}
		>
			{COLORS.map((color, i) => (
				<div
					key={i}
					style={{
						width: '24px',
						height: '24px',
						borderRadius: '50%',
						backgroundColor: color,
						boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
					}}
				/>
			))}
		</div>
	);
};
