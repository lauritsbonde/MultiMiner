import { Box, Button, TextField, Typography } from '@mui/material';
import React, { FC, startTransition, CSSProperties, useState } from 'react';
import DrillCustomizer from './Customizer/DrillCustomizer';

interface JoinProps {
	joinGame: (name: string, imageIndex: { head: string; body: string; bottom: string; wheels: string }) => void;
	playerImages: { [key: string]: any };
}

const Join: FC<JoinProps> = ({ joinGame, playerImages }) => {
	const [input, setInput] = useState('');
	const [avatar, setAvatar] = useState(`https://avatars.dicebear.com/api/personas/${''}.svg`);
	const [imageIndex, setImageIndex] = useState({ head: '0', body: '0', bottom: '0', wheels: '0' });

	const handleInput = (input: string) => {
		setInput(input);
		startTransition(() => {
			// TODO: do some checks to see if the avatar is valid and if someone else is using it
			setAvatar(`https://avatars.dicebear.com/api/personas/${input}.svg`);
		});
	};

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
		container: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		},
		playerContainer: {
			display: 'flex',
			flexDirection: 'column',
			marginTop: '20px',
			width: '40vw',
			maxWidth: '400px',
			backgroundColor: '#0093E9',
			backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
			padding: '10px',
			borderRadius: '10px',
			boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
			boxSizing: 'border-box',
			alignItems: 'center',
			color: '#fff',
		},
		form: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			width: '100%',
		},
		avatarContainer: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			marginTop: '20px',
			img: {
				width: '100px',
				margin: 0,
			},
		},
		joinButton: {
			height: '50px',
			width: '50%',
			fontSize: '1.2rem',
		},
	} as { [key: string]: CSSProperties };

	return (
		<Box sx={styling.container}>
			<Typography variant="h1" sx={{ fontWeight: '600' }}>
				Join MultiMiner
			</Typography>
			<Box sx={styling.playerContainer}>
				<Typography variant="h5">Enter your username</Typography>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						joinGame(input, imageIndex);
					}}
					style={styling.form}
				>
					<TextField
						type="text"
						value={input}
						label="Username"
						variant="filled"
						onChange={(e) => {
							handleInput(e.target.value);
						}}
						margin="dense"
						size="small"
						InputLabelProps={{ style: { color: '#fff' } }}
						InputProps={{ style: { color: '#fff' } }}
					/>
					<Box sx={styling.avatarContainer}>
						<Typography variant="h5">Your random avatar</Typography>
						<img src={avatar} alt="random avatar" />
					</Box>
					{playerImages ? <DrillCustomizer imageIndex={imageIndex} playerImages={playerImages} updatePart={updatePart} /> : <div>Loading...</div>}
					<Button sx={styling.joinButton} variant="contained" type="submit" onClick={() => joinGame(input || `I AM BORING_${(Math.random() + 1).toString(36).substring(2)}`, imageIndex)}>
						Join
					</Button>
				</form>
			</Box>
		</Box>
	);
};

export default Join;
