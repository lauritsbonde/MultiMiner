import { Box, Button, TextField, Typography } from '@mui/material';
import React, { FC, startTransition, useEffect, useState } from 'react';
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

	return (
		<Box style={{ position: 'absolute' }}>
			<Typography variant="h1">Join</Typography>
			<Typography variant="h4">Enter your username</Typography>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					joinGame(input, imageIndex);
				}}
			>
				<TextField
					type="text"
					value={input}
					label="Username"
					onChange={(e) => {
						handleInput(e.target.value);
					}}
					sx={{ marginRight: '1rem' }}
				/>
				<Button variant="contained" type="submit" onClick={() => joinGame(input || `I AM BORING_${(Math.random() + 1).toString(36).substring(2)}`, imageIndex)}>
					Join
				</Button>
			</form>
			<Box>
				<Typography variant="h4">Your random avatar</Typography>
				<img src={avatar} alt="random avatar" style={{ width: '50%' }} />
			</Box>
			{playerImages ? <DrillCustomizer imageIndex={imageIndex} playerImages={playerImages} updatePart={updatePart} /> : <div>test...</div>}
		</Box>
	);
};

export default Join;
