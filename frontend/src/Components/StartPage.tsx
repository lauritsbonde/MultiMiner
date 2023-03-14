import React, { FC, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Join from './Authentication/Join';
import MuiThemeProvider from './MuiThemeProvider';

interface props {
	loginWithRedirect: () => void;
	authenticated: boolean;
	logout: () => void;
	joinGame: (imageIndex: { head: string; body: string; bottom: string; wheels: string }) => void;
	playerImages: { [key: string]: any };
	username: string;
}

const StartPage: FC<props> = ({ loginWithRedirect, authenticated, logout, joinGame, playerImages, username }) => {
	interface ContainerProps {
		children: ReactNode;
	}

	const Container: FC<ContainerProps> = ({ children }) => (
		<MuiThemeProvider>
			<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
				<Typography variant="h1">Welcome to the MultiMiner!</Typography>
				{children}
			</Box>
		</MuiThemeProvider>
	);

	if (authenticated) {
		return (
			<Container>
				<Typography variant="h2">Hi {username}!</Typography>
				<Button variant="contained" onClick={logout}>
					Logout
				</Button>
				<Join joinGame={joinGame} playerImages={playerImages} username={username} />
			</Container>
		);
	}
	return (
		<Container>
			<Typography variant="h2">Please login to continue</Typography>
			<Button variant="contained" onClick={loginWithRedirect}>
				Login
			</Button>
		</Container>
	);
};

export default StartPage;
