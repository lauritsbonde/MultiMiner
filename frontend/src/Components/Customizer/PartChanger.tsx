import React, { FC } from 'react';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface props {
	updatePart: (part: 'head' | 'body' | 'bottom' | 'wheels', value: number) => void;
	image: string;
	part: 'head' | 'body' | 'bottom' | 'wheels';
}

const PartChanger: FC<props> = ({ updatePart, image, part }) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'row' }}>
			<Button
				variant="contained"
				onClick={() => {
					updatePart(part, -1);
				}}
			>
				<ArrowBackIcon />
			</Button>
			<img src={image} alt={part} />
			<Button
				variant="contained"
				onClick={() => {
					updatePart(part, 1);
				}}
			>
				<ArrowForwardIcon />
			</Button>
		</Box>
	);
};

export default PartChanger;
