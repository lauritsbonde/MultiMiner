import React, { FC } from 'react';
import PartChanger from './PartChanger';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

interface Props {
	playerImages: { [key: string]: any };
	updatePart: (part: 'head' | 'body' | 'bottom' | 'wheels', value: number) => void;
	imageIndex: { head: string; body: string; bottom: string; wheels: string };
}

const DrillCustomizer: FC<Props> = ({ playerImages, updatePart, imageIndex }) => {
	const parts = ['head', 'body', 'bottom', 'wheels'];

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', margin: '20px 0', width: '100%' }}>
			<Typography variant="h6">Customize your drill!</Typography>
			<>
				{parts.map((part, index) => {
					if (part === 'head' || part === 'body' || part === 'bottom' || part === 'wheels') {
						return <PartChanger key={index} updatePart={updatePart} image={playerImages[part] !== undefined ? playerImages[part][imageIndex[part]].src : ''} part={part} />;
					} else {
						return null;
					}
				})}
			</>
		</Box>
	);
};

export default DrillCustomizer;
