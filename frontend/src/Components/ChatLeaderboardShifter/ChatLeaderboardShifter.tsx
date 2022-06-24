import { Box, ButtonGroup, Button } from '@mui/material';
import React, { FC, useState } from 'react';
import { Socket } from 'socket.io-client';
import Chat from '../Chat/Chat';
import Leaderboard from '../Leaderboard/Leaderboard';

interface Props {
	socket: Socket;
	leaderboard: Array<{ id: string; name: string; points: number }>;
}

const styling = {
	container: {
		width: '20vw',
		minWidth: '300px',
		maxWidth: '600px',
		height: '85vh',
		maxHeight: '1000px',
		border: '1px solid black',
		borderRadius: '5px',
		padding: '2px',
		boxSizing: 'border-box',
		overflow: 'hidden',
		backgroundColor: '#0093E9',
		backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
		color: '#fff',
	},
	buttonGroup: {
		height: '8%',
		marginBottom: '2%',
	},
	activeButton: {
		backgroundColor: '#0093E9',
	},
	inactiveButton: {
		backgroundColor: '#0093E9',
		opacity: 0.3,
	},
};

const ChatLeaderboardShifter: FC<Props> = ({ socket, leaderboard }) => {
	const [window, setWindow] = useState('chat');
	return (
		<Box sx={styling.container}>
			<ButtonGroup variant="contained" sx={styling.buttonGroup} fullWidth={true}>
				<Button onClick={() => setWindow('chat')} sx={window === 'chat' ? styling.activeButton : styling.inactiveButton}>
					Chat
				</Button>
				<Button onClick={() => setWindow('leaderboard')} sx={window === 'leaderboard' ? styling.activeButton : styling.inactiveButton}>
					LeaderBoard
				</Button>
			</ButtonGroup>
			{window === 'chat' ? <Chat socket={socket} /> : <Leaderboard leaderboard={leaderboard} />}
		</Box>
	);
};

export default ChatLeaderboardShifter;
