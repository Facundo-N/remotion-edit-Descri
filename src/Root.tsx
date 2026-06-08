import { Composition } from 'remotion';
import { MainComposition } from './MainComposition';
import { GreenScreenPopupComp } from './GreenScreenPopup';
import { Mayo25Composition } from './Mayo25Composition';
import { AIVisionLines } from './components/AIVisionLines';
import { ShortFormPrototype } from './components/ShortFormPrototype';
import { ReelComposition, REEL_TOTAL_FRAMES } from './ReelComposition';
import { SaaSRefComposition, SAAS_TOTAL_FRAMES } from './SaaSRefComposition';
import KineticIntroCafe, { TOTAL_FRAMES as KINETIC_CAFE_TOTAL_FRAMES } from './components/KineticIntroCafe';
import './index.css';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* ─── Reel cafetería v1 (Fase 1) ──────────────────────────── */}
			<Composition
				id="ReelCafeteria"
				component={ReelComposition}
				durationInFrames={REEL_TOTAL_FRAMES}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="Main"
				component={MainComposition}
				durationInFrames={1501}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="LocationPopup"
				component={GreenScreenPopupComp}
				durationInFrames={210}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="Mayo25"
				component={Mayo25Composition}
				durationInFrames={600}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="AIVisionTest"
				component={AIVisionLines}
				durationInFrames={300}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="PlantillaShortForm"
				component={ShortFormPrototype}
				durationInFrames={877}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="SaaSRef"
				component={SaaSRefComposition}
				durationInFrames={SAAS_TOTAL_FRAMES}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="KineticIntroCafe"
				component={KineticIntroCafe}
				durationInFrames={KINETIC_CAFE_TOTAL_FRAMES}
				fps={30}
				width={1080}
				height={1920}
			/>
		</>
	);
};
