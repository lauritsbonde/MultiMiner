import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import React, { FC, useState } from 'react';
import Join from './Join';
import Login from './Login';

interface props {
	joinGame: (imageIndex: { head: string; body: string; bottom: string; wheels: string }) => void;
	playerImages: { [key: string]: any };
}

const styling = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	signingContainer: {
		marginTop: '20px',
		width: '40vw',
		maxWidth: '400px',
		backgroundColor: '#0093E9',
		backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
		padding: '10px',
		borderRadius: '10px',
		boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
		boxSizing: 'border-box',
		color: '#fff',
	},
	activeButton: {
		backgroundColor: '#0093E9',
	},
	inactiveButton: {
		backgroundColor: '#0093E9',
		opacity: '0.5',
	},
};

const Wrapper: FC<props> = ({ joinGame, playerImages }) => {
	const [screen, setScreen] = useState('join');

	return (
		<Box sx={styling.container}>
			<Typography variant="h1">Join MultiMiner</Typography>
			<Box sx={styling.signingContainer}>
				<ButtonGroup fullWidth={true}>
					<Button
						variant="contained"
						onClick={() => {
							setScreen('join');
						}}
						sx={screen === 'join' ? styling.activeButton : styling.inactiveButton}
					>
						Sign up
					</Button>
					<Button
						variant="contained"
						onClick={() => {
							setScreen('login');
						}}
						sx={screen === 'login' ? styling.activeButton : styling.inactiveButton}
					>
						Log in
					</Button>
				</ButtonGroup>
				{screen === 'join' ? <Join joinGame={joinGame} playerImages={playerImages} username="" /> : <Login />}
			</Box>
		</Box>
	);
};

export default Wrapper;
