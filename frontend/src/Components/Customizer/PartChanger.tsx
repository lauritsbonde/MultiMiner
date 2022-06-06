import React, { FC } from 'react';

interface props {
	updatePart: (part: 'head' | 'body' | 'bottom' | 'wheels', value: number) => void;
	image: string;
	part: 'head' | 'body' | 'bottom' | 'wheels';
}

const PartChanger: FC<props> = ({ updatePart, image, part }) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'row' }}>
			<button
				onClick={() => {
					updatePart(part, -1);
				}}
			>
				{'<-'}
			</button>
			<img src={image} alt={part} />
			<button
				onClick={() => {
					updatePart(part, 1);
				}}
			>
				{'->'}
			</button>
		</div>
	);
};

export default PartChanger;
