import React, { FC } from 'react';
import PartChanger from './PartChanger';

interface Props {
	playerImages: { [key: string]: any };
	updatePart: (part: 'head' | 'body' | 'bottom' | 'wheels', value: number) => void;
	imageIndex: { head: string; body: string; bottom: string; wheels: string };
}

const DrillCustomizer: FC<Props> = ({ playerImages, updatePart, imageIndex }) => {
	const parts = ['head', 'body', 'bottom', 'wheels'];

	return (
		<div>
			<h3>What do you want to look like?</h3>
			{Object.keys(playerImages).length > 0 ? (
				<>
					{parts.map((part, index) => {
						if (part === 'head' || part === 'body' || part === 'bottom' || part === 'wheels') {
							return <PartChanger key={index} updatePart={updatePart} image={playerImages[part][imageIndex[part]].src} part={part} />;
						} else {
							return null;
						}
					})}
				</>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
};

export default DrillCustomizer;
