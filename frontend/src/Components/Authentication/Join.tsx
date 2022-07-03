import { Box, Button, TextField, Typography } from '@mui/material';
import React, { FC, startTransition, CSSProperties, useState } from 'react';
import DrillCustomizer from '../Customizer/DrillCustomizer';

interface JoinProps {
	joinGame: (name: string, password: string, imageIndex: { head: string; body: string; bottom: string; wheels: string }) => void;
	playerImages: { [key: string]: any };
}

const Join: FC<JoinProps> = ({ joinGame, playerImages }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [avatar, setAvatar] = useState(`https://avatars.dicebear.com/api/personas/${''}.svg`);
	const [imageIndex, setImageIndex] = useState({ head: '0', body: '0', bottom: '0', wheels: '0' });

	const handleInput = (input: string) => {
		setUsername(input);
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
		playerContainer: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			marginTop: '10px',
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
			<Typography variant="h5">Sign up</Typography>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					joinGame(username, password, imageIndex);
				}}
				style={styling.form}
			>
				<TextField
					value={username}
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
				<TextField
					value={password}
					variant="filled"
					type="password"
					label="Password"
					margin="dense"
					size="small"
					onChange={(e) => {
						setPassword(e.target.value);
					}}
					InputLabelProps={{ style: { color: '#fff' } }}
					InputProps={{ style: { color: '#fff' } }}
				/>
				<Box sx={styling.avatarContainer}>
					<Typography variant="h5">Your random avatar</Typography>
					<img src={avatar} alt="random avatar" />
				</Box>
				{playerImages ? <DrillCustomizer imageIndex={imageIndex} playerImages={playerImages} updatePart={updatePart} /> : <div>Loading...</div>}
				<Button
					sx={styling.joinButton}
					variant="contained"
					type="submit"
					onClick={() => joinGame(username || `I AM BORING_${(Math.random() + 1).toString(36).substring(2)}`, password, imageIndex)}
				>
					Join
				</Button>
			</form>
		</Box>
	);
};

export default Join;
