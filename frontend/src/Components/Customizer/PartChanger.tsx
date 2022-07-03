import React, { FC } from 'react';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface props {
	updatePart: (part: 'head' | 'body' | 'bottom' | 'wheels', value: number) => void;
	image: string;
	part: 'head' | 'body' | 'bottom' | 'wheels';
}

const styling = {
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		margin: '2px 0',
		height: '50px',
	},
	button: {
		minWidth: '50px',
		height: '50px',
		padding: '0px',
		margin: '0px',
		color: '#fff',
		borderRadius: '50%',
	},
};

const PartChanger: FC<props> = ({ updatePart, image, part }) => {
	return (
		<Box sx={styling.container}>
			<Button
				onClick={() => {
					updatePart(part, -1);
				}}
				sx={styling.button}
			>
				<ArrowBackIcon fontSize="large" />
			</Button>
			<img src={image} alt={part} />
			<Button
				onClick={() => {
					updatePart(part, 1);
				}}
				sx={styling.button}
			>
				<ArrowForwardIcon fontSize="large" />
			</Button>
		</Box>
	);
};

export default PartChanger;
