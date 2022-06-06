import React, { FC } from 'react';

interface Props {
	playerImages: { [key: string]: any };
	setImageIndex: (index: number) => void;
	imageIndex: number;
}

const DrillCustomizer: FC<Props> = ({ playerImages, setImageIndex, imageIndex }) => {
	return (
		<div>
			<h3>What do you want to look like?</h3>
			<div>
				<img src={Object.keys(playerImages).length > 0 ? playerImages[Object.keys(playerImages)[imageIndex]].src : ''} alt="avatar" />
				<div>
					<button onClick={() => setImageIndex((imageIndex - 1) % Object.keys(playerImages).length)}>Prev</button>
					<button onClick={() => setImageIndex((imageIndex + 1) % Object.keys(playerImages).length)}>Next</button>
				</div>
			</div>
		</div>
	);
};

export default DrillCustomizer;
