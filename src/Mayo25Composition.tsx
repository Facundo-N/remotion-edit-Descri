import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { Logo } from './components/Logo';
import { PatrioticScene } from './components/PatrioticScene';
// Unused coffee scene assets removed

const { fontFamily: sans } = loadMontserrat();
const { fontFamily: serif } = loadPlayfair();

// ─── Paleta ───────────────────────────────────────────
const C = {
	espresso: '#0A1424',
	crema: '#FDF8E7',
	caramelo: '#F6B40E',
	celeste: '#74ACDF',
	blanco: '#FFFFFF',
};

// ─── Timing (frames a 30fps) ──────────────────────────
// Escena 1: apertura 0-5s  (0–150)
// Escena 2: narración 5-15s (150–450)
// Escena 3: CTA 15-20s     (450–600)
const S1 = 150;
const S2 = 300;
const S3 = 150;

// ─── Helpers ──────────────────────────────────────────
const fadeIn = (frame: number, start: number, dur = 20) =>
	interpolate(frame, [start, start + dur], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

const fadeOut = (frame: number, end: number, dur = 20) =>
	interpolate(frame, [end - dur, end], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

// Fundido entre escenas
const CrossFade: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
	const frame = useCurrentFrame();
	const opacity = fadeOut(frame, totalFrames, 25);
	return (
		<AbsoluteFill
			style={{ backgroundColor: C.espresso, opacity: 1 - opacity, zIndex: 999, pointerEvents: 'none' }}
		/>
	);
};

const FadeIn: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = fadeIn(frame, 0, 25);
	return (
		<AbsoluteFill
			style={{ backgroundColor: C.espresso, opacity: 1 - opacity, zIndex: 999, pointerEvents: 'none' }}
		/>
	);
};

// Texto que sube desde máscara
const SlideUp: React.FC<{ text: string; delay: number; style?: React.CSSProperties }> = ({ text, delay, style }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const sp = spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.8 } });
	return (
		<div style={{ overflow: 'hidden', lineHeight: 1.15 }}>
			<div style={{ transform: `translateY(${interpolate(sp, [0, 1], [110, 0])}%)`, opacity: sp, ...style }}>
				{text}
			</div>
		</div>
	);
};



// ─── Partículas de luz / confetti patriótico ──────────
const Particulas: React.FC = () => {
	const frame = useCurrentFrame();
	const particles = Array.from({ length: 18 }, (_, i) => {
		const seed = i * 137.508;
		const x = (Math.sin(seed) * 0.5 + 0.5) * 100;
		const speed = 0.3 + (i % 5) * 0.15;
		const y = ((frame * speed + seed * 3) % 110) - 10;
		const size = 6 + (i % 4) * 4;
		const color = [C.caramelo, C.celeste, C.blanco][i % 3];
		const rotate = frame * (i % 2 === 0 ? 2 : -2) + i * 30;
		return { x, y, size, color, rotate };
	});
	return (
		<AbsoluteFill style={{ zIndex: 2, pointerEvents: 'none' }}>
			{particles.map((p, i) => (
				<div key={i} style={{
					position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
					width: p.size, height: p.size, borderRadius: 2,
					backgroundColor: p.color, opacity: 0.7,
					transform: `rotate(${p.rotate}deg)`,
				}} />
			))}
		</AbsoluteFill>
	);
};

// ─── ESCENA 1: Apertura (Patriótica) ──────────────────
const Scene1: React.FC = () => {
	const frame = useCurrentFrame();
	const DARK_TEXT = '#1A3F6F';

	// Blur flash transition between subtitle (frame 8) and title (frame 18)
	const transitionBlur = interpolate(frame, [14, 18, 22], [0, 8, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const transitionBrightness = interpolate(frame, [14, 18, 22], [1, 1.4, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<PatrioticScene>
			<FadeIn />

			{/* Overlay semitransparente abajo para el texto */}
			<AbsoluteFill style={{
				background: 'linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.0) 55%)',
				zIndex: 8,
			}} />

			{/* Textos de apertura */}
			<div style={{
				position: 'absolute', bottom: 0, left: 0, right: 0,
				zIndex: 10, padding: '0 70px 160px',
				display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
				filter: `blur(${transitionBlur}px) brightness(${transitionBrightness})`,
			}}>
				{/* Eyebrow */}
				<div style={{
					opacity: fadeIn(frame, 8, 20),
					transform: `translateY(${interpolate(fadeIn(frame, 8, 20), [0, 1], [15, 0])}px)`,
					fontFamily: sans, fontSize: 36, fontWeight: 600,
					color: DARK_TEXT, letterSpacing: 2,
					marginBottom: 24,
				}}>
					Este 25 de Mayo,
				</div>

				<SlideUp
					text="tu evento merece"
					delay={18}
					style={{ fontFamily: serif, fontSize: 100, fontWeight: 700, color: DARK_TEXT, lineHeight: 1.05 }}
				/>
				<SlideUp
					text="el mejor café."
					delay={30}
					style={{ fontFamily: serif, fontSize: 110, fontWeight: 800, color: '#C07200', lineHeight: 1.05 }}
				/>
			</div>

			<CrossFade totalFrames={S1} />
		</PatrioticScene>
	);
};

// ─── ESCENA 2: Narración ──────────────────────────────
// "En cada celebración patria... Aroma a Café está presente."
const Scene2: React.FC = () => {
	const frame = useCurrentFrame();
	// Unused fps removed

	const lines = [
		{ text: 'En cada celebración patria,', delay: 10 },
		{ text: 'en cada reunión de equipo,', delay: 30 },
		{ text: 'en cada momento que vale la pena recordar:', delay: 50 },
	];

	const bottomOpacity = fadeIn(frame, 140, 30);

	return (
		<PatrioticScene>
			<FadeIn />

			{/* Fondo y superposición */}
			<AbsoluteFill style={{
				background: 'linear-gradient(to bottom, rgba(10,20,36,0.55) 0%, rgba(10,20,36,0.2) 40%, rgba(10,20,36,0.7) 80%)',
				zIndex: 6,
			}} />

			{/* Texto narración */}
			<div style={{
				position: 'absolute', top: 0, left: 0, right: 0,
				zIndex: 20, padding: '80px 60px 0 60px',
				display: 'flex', flexDirection: 'column', gap: 8,
			}}>
				{lines.map((l, i) => (
					<SlideUp
						key={i}
						text={l.text}
						delay={l.delay}
						style={{
							fontFamily: serif, fontSize: 68, fontWeight: 600,
							color: i === 2 ? '#C07200' : '#1A3F6F',
							textShadow: '0 2px 12px rgba(255,255,255,0.6)',
						}}
					/>
				))}
			</div>

			{/* Parte baja: "Aroma a Café está presente" */}
			<div style={{
				position: 'absolute', bottom: 160, left: 0, right: 0,
				zIndex: 10, textAlign: 'center',
				opacity: bottomOpacity,
				transform: `translateY(${interpolate(bottomOpacity, [0, 1], [30, 0])}px)`,
			}}>
				<div style={{ fontFamily: serif, fontSize: 90, fontWeight: 700, color: '#C07200', lineHeight: 1.1, textShadow: '0 2px 12px rgba(255,255,255,0.5)' }}>
					Aroma a Café
				</div>
				<div style={{ fontFamily: sans, fontSize: 44, fontWeight: 600, color: '#1A3F6F', letterSpacing: 4, marginTop: 10 }}>
					está presente.
				</div>
			</div>

			{/* Línea decorativa */}
			<div style={{
				position: 'absolute', bottom: 130, left: '50%', transform: 'translateX(-50%)',
				width: interpolate(frame, [160, 220], [0, 400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
				height: 2,
				background: `linear-gradient(to right, transparent, ${C.caramelo}, transparent)`,
				zIndex: 11,
			}} />

			<CrossFade totalFrames={S2} />
		</PatrioticScene>
	);
};

// ─── ESCENA 3: CTA ────────────────────────────────────
// "Quedan pocos cupos para el 25. Reservá ahora."
const Scene3: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const logoSp = spring({ frame: frame - 5, fps, config: { damping: 14 } });
	const ctaSp = spring({ frame: frame - 30, fps, config: { damping: 12 } });
	const urgSp = spring({ frame: frame - 55, fps, config: { damping: 10 } });

	// Pulso en el botón
	const pulse = 1 + Math.sin(frame * 0.2) * 0.025;

	return (
		<AbsoluteFill style={{
			backgroundColor: C.espresso,
			alignItems: 'center', justifyContent: 'center',
		}}>
			<FadeIn />

			{/* Fondo radial cálido */}
			<AbsoluteFill style={{
				background: `radial-gradient(ellipse at 50% 50%, rgba(246,180,14,0.12) 0%, transparent 65%)`,
			}} />

			{/* Partículas */}
			<Particulas />



			{/* Overlay sutil abajo */}
			<AbsoluteFill style={{
				background: 'linear-gradient(to top, rgba(10,20,36,0.8) 0%, transparent 60%)',
				zIndex: 1,
			}} />

			{/* Contenido central */}
			<div style={{
				position: 'relative', zIndex: 10,
				display: 'flex', flexDirection: 'column',
				alignItems: 'center', textAlign: 'center',
				gap: 0, padding: '0 60px',
			}}>
				{/* Logo */}
				<div style={{
					transform: `scale(${interpolate(logoSp, [0, 1], [0.7, 0.75])})`,
					opacity: logoSp, marginBottom: 20,
				}}>
					<Logo type="image" />
				</div>

				{/* Divider */}
				<div style={{
					width: interpolate(logoSp, [0, 1], [0, 300]),
					height: 1,
					background: `linear-gradient(to right, transparent, ${C.caramelo}88, transparent)`,
					marginBottom: 50,
				}} />

				{/* Urgencia */}
				<div style={{
					fontFamily: sans, fontSize: 38, fontWeight: 400,
					color: C.crema, letterSpacing: 2,
					opacity: interpolate(urgSp, [0, 1], [0, 1]),
					transform: `translateY(${interpolate(urgSp, [0, 1], [20, 0])}px)`,
					marginBottom: 30,
				}}>
					⚠️ Quedan pocos cupos para el 25
				</div>

				{/* Headline CTA */}
				<div style={{
					fontFamily: serif, fontSize: 105, fontWeight: 700,
					color: C.blanco, lineHeight: 1.05,
					opacity: interpolate(ctaSp, [0, 1], [0, 1]),
					transform: `translateY(${interpolate(ctaSp, [0, 1], [40, 0])}px)`,
					marginBottom: 60,
					textShadow: '0 4px 30px rgba(0,0,0,0.6)',
				}}>
					Reservá<br />
					<span style={{ color: C.caramelo }}>ahora.</span>
				</div>

				{/* Botón CTA */}
				<div style={{
					backgroundColor: C.caramelo, color: C.espresso,
					padding: '28px 70px', borderRadius: 100,
					fontFamily: sans, fontSize: 30, fontWeight: 800,
					letterSpacing: 5, textTransform: 'uppercase',
					boxShadow: `0 15px 50px rgba(246,180,14,0.45)`,
					transform: `scale(${interpolate(ctaSp, [0, 1], [0.8, pulse])})`,
					opacity: ctaSp,
				}}>
					Cotizá tu evento
				</div>

				{/* Handle / web */}
				<div style={{
					display: 'flex', gap: 40, marginTop: 40,
					fontFamily: sans, fontSize: 26, fontWeight: 500,
					color: C.celeste, letterSpacing: 2,
					opacity: interpolate(ctaSp, [0, 1], [0, 0.85]),
				}}>
					<span>@aromaacafe</span>
					<span>·</span>
					<span>aromaacafe.com.ar</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─── Composición principal ────────────────────────────
export const Mayo25Composition: React.FC = () => (
	<AbsoluteFill style={{ backgroundColor: C.espresso }}>
		<Sequence from={0} durationInFrames={S1}>
			<Scene1 />
		</Sequence>
		<Sequence from={S1} durationInFrames={S2}>
			<Scene2 />
		</Sequence>
		<Sequence from={S1 + S2} durationInFrames={S3}>
			<Scene3 />
		</Sequence>
	</AbsoluteFill>
);
