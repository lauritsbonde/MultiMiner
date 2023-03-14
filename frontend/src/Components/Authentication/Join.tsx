import { Box, Button, TextField, Typography } from '@mui/material';
import React, { FC, startTransition, CSSProperties, useState } from 'react';
import DrillCustomizer from '../Customizer/DrillCustomizer';

interface JoinProps {
	joinGame: (imageIndex: { head: string; body: string; bottom: string; wheels: string }) => void;
	playerImages: { [key: string]: any };
	username: string;
}

const Join: FC<JoinProps> = ({ joinGame, playerImages, username }) => {
	const [imageIndex, setImageIndex] = useState({ head: '0', body: '0', bottom: '0', wheels: '0' });

	const updatePart = (part: 'head' | 'body' | 'bottom' | 'wheels', index: number) => {
		startTransition(() => {
			if (index === -1 && imageIndex[part] === '0') {
				setImageIndex({ ...imageIndex, [part]: '' + (Object.keys(playerImages[part]).length - 1) });
			} else {
				setImageIndex({ ...imageIndex, [part]: '' + ((+imageIndex[part] + index) % Object.keys(playerImages[part]).length) });
			}
		});
	};

	const styling = {
		playerContainer: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			marginTop: '10px',
			width: '100%',
			maxWidth: '500px',
			background: 'rgb(0,133,254) linear-gradient(170deg, rgba(0,133,254,1) 50%, rgba(0,212,255,1) 100%)',
			padding: '20px 5px',
			boxSizing: 'border-box',
			borderRadius: '14px',
			boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
		},
		avatarContainer: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			marginTop: '10px',
			img: {
				width: '100px',
				margin: 0,
			},
		},
		joinButton: {
			height: '40px',
			width: '50%',
			fontSize: '1.2rem',
		},
	} as { [key: string]: CSSProperties };

	return (
		<Box sx={styling.playerContainer}>
			<Box sx={styling.avatarContainer}>
				<Typography variant="h5">Your random avatar</Typography>
				<img src={`https://avatars.dicebear.com/api/personas/${username}.svg`} alt="random avatar" />
			</Box>
			{playerImages ? <DrillCustomizer imageIndex={imageIndex} playerImages={playerImages} updatePart={updatePart} /> : <div>Loading...</div>}
			<Button sx={styling.joinButton} variant="contained" type="submit" onClick={() => joinGame(imageIndex)}>
				Join
			</Button>
		</Box>
	);
};

export default Join;
