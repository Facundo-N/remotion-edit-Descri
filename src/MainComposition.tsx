import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	Video,
	Img,
	staticFile,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Easing,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadBevan } from '@remotion/google-fonts/Bevan';
import { CollageFrame } from './components/CollageFrame';
import { AnimatedSteam } from './components/AnimatedSteam';

import { CoffeeBeans } from './components/CoffeeBeans';
import { Logo } from './components/Logo';
import { LowerThird } from './components/LowerThird';
import { KineticText, SceneTitle } from './components/KineticText';
import { FloatingParticles } from './components/FloatingParticles';
import { Viewfinder, StampBadge, FilmGrain } from './components/CinematicOverlays';
import { FloatingMotionGraphics } from './components/FloatingMotionGraphics';
import { FloatingCoffeeCups } from './components/FloatingCoffeeCups';
import { CoffeeLiquidBackground } from './components/CoffeeLiquidBackground';

const { fontFamily: sansFont } = loadMontserrat();
const { fontFamily: titleFont } = loadBevan();

const BRAND_YELLOW = '#f7edb0';
const BRAND_ORANGE = '#fbab4a';
const BRAND_BROWN = '#2c210c';

const DURATIONS = {
	INTRO: 90, // Exactly 3 seconds
	VIDEO1: 500, // Played completely (~16.6s)
	VIDEO2: 296, // Played completely (~9.8s)
	VIDEO3: 210, // Trimmed: 0s to 7s segment (7s)
	VIDEO4: 150, // Trimmed: 5s to 10s segment (5s)
	COLLAGE: 135, // Exactly 4.5 seconds
	OUTRO: 120,
};

// ─── Kinetic text overlay helper ────────────────────────────────────────────
const KineticTextOverlay: React.FC<{ words: string; highlight?: string[]; line2?: string; highlight2?: string[] }> = ({
	words,
	highlight = [],
	line2,
	highlight2 = [],
}) => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	const fadeOut = interpolate(frame, [durationInFrames - 25, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'center',
				paddingBottom: '280px',
				opacity: fadeOut,
				zIndex: 100,
				pointerEvents: 'none',
			}}
		>
			{/* Semi-transparent backdrop */}
			<div style={{
				position: 'absolute',
				bottom: '180px',
				left: '40px',
				right: '40px',
				height: line2 ? '320px' : '260px',
				background: 'linear-gradient(to top, rgba(44,33,12,0.75) 0%, transparent 100%)',
				borderRadius: '24px',
			}} />
			{/* Line 1 */}
			<KineticText
				text={words}
				startAt={0}
				wordDelay={9}
				fontSize={72}
				color={BRAND_YELLOW}
				highlightWords={highlight}
				style={{
					textAlign: 'center',
					padding: '0 60px',
					position: 'absolute',
					bottom: line2 ? '340px' : '250px',
					left: 0,
					right: 0,
				}}
			/>
			{/* Line 2 */}
			{line2 && (
				<KineticText
					text={line2}
					startAt={words.split(' ').length * 9}
					wordDelay={9}
					fontSize={72}
					color={BRAND_YELLOW}
					highlightWords={highlight2}
					style={{
						textAlign: 'center',
						padding: '0 60px',
						position: 'absolute',
						bottom: '250px',
						left: 0,
						right: 0,
					}}
				/>
			)}
		</AbsoluteFill>
	);
};

export const MainComposition: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const backgroundOpacity = interpolate(frame, [0, 30], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Transition points
	const t1 = DURATIONS.INTRO;
	const t2 = t1 + DURATIONS.VIDEO1;
	const t3 = t2 + DURATIONS.VIDEO2;
	const t4 = t3 + DURATIONS.VIDEO3;
	const t5 = t4 + DURATIONS.VIDEO4;
	const t6 = t5 + DURATIONS.COLLAGE;

	return (
		<AbsoluteFill style={{ backgroundColor: BRAND_BROWN }}>
			<AbsoluteFill style={{ opacity: backgroundOpacity }}>
				<CoffeeBeans />
			</AbsoluteFill>

			{/* [0 - 90] INTRO */}
			<Sequence from={0} durationInFrames={DURATIONS.INTRO}>
				<Intro />
			</Sequence>

			{/* GLOBAL FILM GRAIN */}
			<FilmGrain intensity={0.035} />

			{/* FLOATING PARTICLES — ambient throughout */}
			<FloatingParticles count={14} seed={7} />

			{/* VIDEO 1 — Presentación + Lower Third */}
			<Sequence from={t1} durationInFrames={DURATIONS.VIDEO1 + 60} style={{ zIndex: 1 }}>
				<VideoSection
					src="assets/videos_1080p/video1.mp4"
					transitionIn
					transitionOutStart={DURATIONS.VIDEO1}
					fadeDuration={60}
				/>
			</Sequence>
			{/* MG: Lower Third on VIDEO1 */}
			<Sequence from={t1 + 50} durationInFrames={220} style={{ zIndex: 50 }}>
				<LowerThird
					title="Aroma a café"
					subtitle="Catering & Servicio Premium"
					appearAt={0}
					disappearAt={180}
				/>
			</Sequence>
			{/* MG: Viewfinder on VIDEO1 */}
			<Sequence from={t1 + 30} durationInFrames={120} style={{ zIndex: 50 }}>
				<Viewfinder appearAt={0} cornerSize={90} padding={55} />
			</Sequence>

			{/* VIDEO 2 — Cafetera + Kinetic text */}
			<Sequence from={t2} durationInFrames={DURATIONS.VIDEO2 + 30} style={{ zIndex: 2 }}>
				<VideoSection
					src="assets/videos_1080p/video2.mp4"
					transitionIn
					transitionOutStart={DURATIONS.VIDEO2}
					fadeDuration={30}
				/>
			</Sequence>
			{/* MG: Kinetic text VIDEO2 */}
			<Sequence from={t2 + 40} durationInFrames={130} style={{ zIndex: 50 }}>
				<KineticTextOverlay
					words="Máquinas de café de"
					highlight={[]}
					line2="alta calidad"
					highlight2={['alta', 'calidad']}
				/>
			</Sequence>
			{/* MG: Stamp badge VIDEO2 */}
			<Sequence from={t2 + 90} durationInFrames={200} style={{ zIndex: 50 }}>
				<StampBadge
					topText="CAFÉ PREMIUM"
					centerText="100% Nespresso"
					bottomText="★ ★ ★"
					appearAt={0}
					x="65%"
					y="5%"
					size={360}
					rotation={12}
				/>
			</Sequence>

			{/* VIDEO 3 — Otra cafetera + Scene title */}
			<Sequence from={t3} durationInFrames={DURATIONS.VIDEO3 + 30} style={{ zIndex: 3 }}>
				<VideoSection
					src="assets/videos_1080p/video3.mp4"
					transitionIn
					transitionOutStart={DURATIONS.VIDEO3}
					startFrom={0}
					fadeDuration={30}
				/>
			</Sequence>
			{/* MG: Scene title VIDEO3 */}
			<Sequence from={t3 + 20} durationInFrames={100} style={{ zIndex: 50 }}>
				<SceneTitle
					line1="Nos adaptamos"
					line2="a tus necesidades"
					showAt={0}
					hideAt={75}
					align="top"
				/>
			</Sequence>

			{/* VIDEO 4 — Fila + Lower Third */}
			<Sequence from={t4} durationInFrames={DURATIONS.VIDEO4 + 30} style={{ zIndex: 4 }}>
				<VideoSection
					src="assets/videos_1080p/video4.mp4"
					transitionIn
					transitionOutStart={DURATIONS.VIDEO4}
					startFrom={5 * fps}
					fadeDuration={30}
				/>
			</Sequence>
			{/* MG: Lower third VIDEO4 */}
			<Sequence from={t4 + 30} durationInFrames={100} style={{ zIndex: 50 }}>
				<LowerThird
					title="Aroma a café"
					subtitle="Catering para tu evento"
					appearAt={0}
					disappearAt={75}
				/>
			</Sequence>

			{/* COLLAGE SECTION */}
			<Sequence from={t5} durationInFrames={DURATIONS.COLLAGE} style={{ zIndex: 10 }}>
				<CollageSection />
			</Sequence>

			{/* OUTRO */}
			<Sequence from={t6} durationInFrames={DURATIONS.OUTRO} style={{ zIndex: 20 }}>
				<Outro />
			</Sequence>
		</AbsoluteFill>
	);
};


const VideoSection: React.FC<{
	src: string;
	transitionIn?: boolean;
	transitionOutStart?: number;
	useDynamicTransition?: boolean;
	startFrom?: number;
	fadeDuration?: number;
}> = ({ src, transitionIn, transitionOutStart, useDynamicTransition = false, startFrom = 0, fadeDuration = 30 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Transition Easing for natural feel
	const transitionEasing = Easing.bezier(0.33, 1, 0.68, 1);

	// Logic for the "Frosted Glass" Transition
	const fadeIn = transitionIn
		? interpolate(frame, [0, fadeDuration], [0, 1], {
			extrapolateRight: 'clamp',
			easing: transitionEasing,
		})
		: 1;

	// Blur and Tint values for the "Gray Sheet" effect
	const blur = transitionIn
		? interpolate(frame, [0, fadeDuration], [15, 0], {
			extrapolateRight: 'clamp',
			easing: transitionEasing,
		})
		: 0;

	const tintOpacity = transitionIn
		? interpolate(frame, [0, fadeDuration], [0.3, 0], {
			extrapolateRight: 'clamp',
			easing: transitionEasing,
		})
		: 0;

	// SAVED: SCALE & ROTATE LOGIC (Preserved but currently overridden by Corporate Fade)
	const springConfig = { damping: 14, mass: 1.2 };
	const enterSpring = spring({ frame, fps, config: springConfig });
	const exitSpring = transitionOutStart ? spring({ frame: frame - transitionOutStart, fps, config: springConfig }) : 0;

	// Determine final values
	const activeOpacity = fadeIn;

	const scale = useDynamicTransition
		? (transitionIn ? interpolate(enterSpring, [0, 1], [0.4, 1]) : transitionOutStart ? interpolate(exitSpring, [0, 1], [1, 0.4]) : 1)
		: 1;
	const rotate = useDynamicTransition
		? (transitionIn ? interpolate(enterSpring, [0, 1], [10, 0]) : transitionOutStart ? interpolate(exitSpring, [0, 1], [0, -10]) : 0)
		: 0;

	return (
		<AbsoluteFill style={{
			opacity: activeOpacity,
			transform: `scale(${scale}) rotate(${rotate}deg)`,
		}}>
			<Video
				src={staticFile(src)}
				style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				muted
				startFrom={startFrom}
			/>

			{/* THE GRAY SHEET / FROSTED GLASS TRANSITION OVERLAY */}
			{transitionIn && frame < fadeDuration && (
				<AbsoluteFill style={{
					backgroundColor: `rgba(100, 100, 100, ${tintOpacity})`,
					backdropFilter: `blur(${blur}px)`,
					WebkitBackdropFilter: `blur(${blur}px)`, // For broader compatibility
					pointerEvents: 'none',
				}} />
			)}

			<div style={{ position: 'absolute', bottom: '150px', right: '100px', opacity: 0.5 }}>
				<AnimatedSteam width={150} height={300} />
			</div>
		</AbsoluteFill>
	);
};

const Intro = () => {
	const frame = useCurrentFrame();
	useVideoConfig(); // pre-load config (not directly used here)

	const opacity = interpolate(frame, [90 - 30, 90], [1, 0], {
		extrapolateLeft: 'clamp',
	});

	const text = "Aroma a Café";
	const charCount = interpolate(frame, [25, 65], [0, text.length], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const displayedText = text.slice(0, Math.floor(charCount));

	// Decorative bar animations
	const barSlide = interpolate(frame, [5, 35], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const barWidth = interpolate(barSlide, [0, 1], [0, 560]);

	return (
		<AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity }}>
			<CoffeeLiquidBackground />

			{/* Top-left decorative bar */}
			<div style={{
				position: 'absolute',
				top: '90px',
				left: '60px',
				width: `${barWidth}px`,
				height: '32px', // Thicker
				background: `linear-gradient(to right, ${BRAND_ORANGE}, #f7edb0)`,
				borderRadius: '0 16px 16px 0',
				boxShadow: `0 0 30px ${BRAND_ORANGE}aa`,
				overflow: 'hidden',
			}} />

			{/* Bottom-right decorative bar */}
			<div style={{
				position: 'absolute',
				bottom: '110px',
				right: '60px',
				width: `${barWidth}px`,
				height: '24px', // Thicker
				background: `linear-gradient(to left, ${BRAND_ORANGE}, #f7edb0)`,
				borderRadius: '12px 0 0 12px',
				boxShadow: `0 0 30px ${BRAND_ORANGE}aa`,
				overflow: 'hidden',
			}} />

			<div style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				transform: 'scale(0.85)',
				zIndex: 10
			}}>
				<Logo type="image" />
				<div style={{
					fontFamily: titleFont,
					fontSize: '110px',
					color: BRAND_YELLOW,
					marginTop: '-20px',
					textShadow: '0 4px 20px rgba(0,0,0,0.5)',
					letterSpacing: '2px',
					minHeight: '1.2em',
				}}>
					{displayedText}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const CollageSection = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const images = [
		'mejoora_la_calidad_de_la_202604301324.jpeg',
		'elimina_lo_de_azul_2K_202604301151.jpeg',
		'manten_la_misma_foto,_mismo_202604301203.jpeg',
		'mejora_la_calidad_de_la_202604301301.jpeg',
		'imagen central.jpeg',
	];

	const positions = [
		{ x: 25, y: 50, size: 490, rot: -4 },
		{ x: 545, y: 50, size: 490, rot: 5 },
		{ x: 25, y: 1370, size: 490, rot: 2 },
		{ x: 545, y: 1370, size: 490, rot: -3 },
		{ x: width / 2 - 520, y: height / 2 - 355, width: 1040, height: 713, rot: 0, isCenter: true },
	];

	const sectionOpacity = interpolate(frame, [0, 30], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{ opacity: sectionOpacity }}>
			{/* Organic coffee liquid background */}
			<CoffeeLiquidBackground />

			{/* Floating yellow motion graphics in the background */}
			<FloatingMotionGraphics style={{ zIndex: 1 }} />
			
			{/* Floating coffee cups - Transparent motion graphics */}
			<FloatingCoffeeCups style={{ zIndex: 2 }} />

			{images.map((img, i) => {
				const pos = positions[i];
				const startFrame = (pos.isCenter ? 70 : i * 15) + 20;
				const moveSpring = spring({
					frame: frame - startFrame,
					fps,
					config: { damping: 15 },
				});

				// Subtle floating and breathing animation (very slow)
				const floatY = Math.sin((frame + i * 30) / 45) * 12;
				const breatheScale = Math.sin((frame + i * 25) / 60) * 0.02;

				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: pos.x,
							top: pos.y + floatY,
							transform: `rotate(${pos.rot}deg) scale(${interpolate(moveSpring, [0, 1], [0.8, 1]) + breatheScale})`,
							opacity: moveSpring,
							zIndex: pos.isCenter ? 50 : i,
						}}
					>
						<CollageFrame style={{ width: pos.width || pos.size, height: pos.height || pos.size }}>
							<Img
								src={staticFile(`assets/collage_v2/${img}`)}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</CollageFrame>
					</div>
				);
			})}

		</AbsoluteFill>
	);
};

const Outro = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const panelSpring = spring({
		frame,
		fps,
		config: { damping: 20 },
	});

	return (
		<AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, 150], [1, 0.95])})` }}>
			<CoffeeLiquidBackground />
			{/* Floating yellow motion graphics in the background */}
			<FloatingMotionGraphics style={{ zIndex: 0 }} />
			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: `translate(-50%, -50%) translateY(${interpolate(panelSpring, [0, 1], [1000, 0])}px)`,
					width: '900px',
					padding: '80px',
					borderRadius: '50px',
					border: `3px solid ${BRAND_YELLOW}`,
					boxShadow: `0px 30px 100px rgba(0,0,0,0.5), inset 0 1px 0 ${BRAND_YELLOW}44`,
					textAlign: 'center',
					display: 'flex',
					flexDirection: 'column',
					gap: '50px',
					background: 'linear-gradient(160deg, #6b4423 0%, #4a2e14 50%, #3b2510 100%)',
					zIndex: 10,
				}}
			>
				<div style={{ alignSelf: 'center', transform: 'scale(0.8)' }}>
					<Logo type="image" />
				</div>
				<div
					style={{
						fontFamily: sansFont,
						fontSize: '54px',
						color: BRAND_YELLOW,
						lineHeight: '1.2',
						fontWeight: '600',
					}}
				>
					Máquinas de café de calidad.  <br />
					<span style={{ color: BRAND_ORANGE, fontSize: '64px', display: 'inline-block', marginTop: '12px' }}>
						Nos adaptamos a tus necesidades.
					</span>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
					<div
						style={{
							fontFamily: sansFont,
							fontSize: '36px',
							color: BRAND_YELLOW,
							fontWeight: 'bold',
							letterSpacing: '2px',
							padding: '16px 40px',
							border: `2px solid ${BRAND_YELLOW}`,
							borderRadius: '100px',
							alignSelf: 'center',
						}}
					>
						@aromaacafe_catering
					</div>
					<div
						style={{
							fontFamily: sansFont,
							fontSize: '32px',
							color: BRAND_YELLOW,
							fontWeight: 'bold',
							letterSpacing: '2px',
							padding: '16px 40px',
							border: `1px solid ${BRAND_YELLOW}88`,
							borderRadius: '100px',
							alignSelf: 'center',
							opacity: 0.9
						}}
					>
						aromaacafe.com.ar
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
