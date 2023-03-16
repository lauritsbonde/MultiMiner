import { Box, ButtonGroup, Button } from '@mui/material';
import React, { FC, useState } from 'react';
import { Socket } from 'socket.io-client';
import Chat from '../Chat/Chat';
import Leaderboard from '../Leaderboard/Leaderboard';

interface Props {
	socket: Socket;
	leaderboard: Array<{ id: string; name: string; points: number }>;
	myId: string;
}

const styling = {
	container: {
		width: '20vw',
		minWidth: '300px',
		maxWidth: '600px',
		border: '1px solid black',
		padding: '2px',
		boxSizing: 'border-box',
		overflow: 'hidden',
		backgroundColor: '#0093E9',
		color: '#fff',
	},
	buttonGroup: {
		height: '8%',
		marginBottom: '2%',
	},
	activeButton: {
		backgroundColor: '#0093E9',
		fontSize: 'clamp(.8rem, 1vw, 1.2rem)',
	},
	inactiveButton: {
		backgroundColor: '#0093E9',
		opacity: 0.4,
		fontSize: 'clamp(.8rem, 1vw, 1.2rem)',
	},
};

const ChatLeaderboardShifter: FC<Props> = ({ socket, leaderboard, myId }) => {
	const [window, setWindow] = useState('leaderboard');
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
			{window === 'chat' ? <Chat socket={socket} myId={myId} /> : <Leaderboard leaderboard={leaderboard} />}
		</Box>
	);
};

export default ChatLeaderboardShifter;
