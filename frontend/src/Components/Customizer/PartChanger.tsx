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
		justifyContent: 'space-between',
		minWidth: '300px',
		margin: '4px 0',
	},
	button: {
		minWidth: '50px',
		minHeight: '50px',
		padding: '0px',
		margin: '0px',
		borderRadius: '0px',
	},
};

const PartChanger: FC<props> = ({ updatePart, image, part }) => {
	return (
		<Box sx={styling.container}>
			<Button
				variant="contained"
				onClick={() => {
					updatePart(part, -1);
				}}
				sx={styling.button}
			>
				<ArrowBackIcon />
			</Button>
			<img src={image} alt={part} />
			<Button
				variant="contained"
				onClick={() => {
					updatePart(part, 1);
				}}
				sx={styling.button}
			>
				<ArrowForwardIcon />
			</Button>
		</Box>
	);
};

export default PartChanger;
