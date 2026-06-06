import { Composition } from 'remotion';
import { MainComposition } from './MainComposition';
import { GreenScreenPopupComp } from './GreenScreenPopup';
import { Mayo25Composition } from './Mayo25Composition';
import { AIVisionLines } from './components/AIVisionLines';
import { ShortFormPrototype } from './components/ShortFormPrototype';
import './index.css';

export const RemotionRoot: React.FC = () => {
	return (
		<>
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
		</>
	);
};
