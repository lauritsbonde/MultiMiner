import React, { FC, CSSProperties, useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Box, Fab, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import css from './styling.module.css';

const styling = {
	chat: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
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
	header: { height: '8%', margin: '4px' },
	chats: {
		overflowY: 'scroll',
		height: '80%',
		width: '100%',
		padding: '2px',
		boxSizing: 'border-box',
	},
	myChat: {
		backgroundColor: '#00bae9',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '2px 4px',
		boxSizing: 'border-box',
		margin: '2px 0',
		border: '1px solid',
		borderColor: '#ffffffa9',
	},
	otherChat: {
		backgroundColor: '#0080e9',
		display: 'flex',
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '2px 4px',
		boxSizing: 'border-box',
		margin: '2px 0',
		border: '1px solid',
		borderColor: '#ffffffa9',
	},
	chatAvatar: {
		width: '30px',
		height: '30px',
		maxHeight: '90%',
		maxWidth: '30%',
		borderRadius: '50%',
		margin: '2px',
		padding: 0,
	},
	avatarAndName: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		maxWidth: '35%',
	},
	sender: {
		fontSize: '0.8rem',
		whiteSpace: 'nowrap',
		maxWidth: '70%',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		margin: 0,
		padding: 0,
	},
	form: {
		width: '100%',
		display: 'flex',
		margin: '2px 0',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	input: {
		width: '90%',
		margin: '0 4px',
		boxSizing: 'border-box',
		color: 'white',
	},
	fab: {
		backgroundColor: '#0093E9',
		backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
		color: 'white',
		border: '1px solid',
		borderColor: '#ffffffa9',
	},
} as { [key: string]: CSSProperties };

interface Props {
	socket: Socket;
}

const Chat: FC<Props> = ({ socket }) => {
	const [chats, setChats] = React.useState<Array<{ senderId: string; senderName: string; message: string }>>([]);
	const [input, setInput] = React.useState('');

	const sendChat = (e: React.FormEvent) => {
		e.preventDefault();
		socket.emit('chat', { message: input });
		setInput('');
	};

	socket.on('newchat', (data: { senderId: string; senderName: string; message: string }) => {
		setChats([...chats, data]);
	});

	const handleInput = (e: string) => {
		setInput(e);
	};

	const chatRef = useRef({} as HTMLDivElement);

	useEffect(() => {
		chatRef.current.scrollTop = chatRef.current.scrollHeight;
	}, [chats]);

	return (
		<Box style={styling.chat}>
			<Typography sx={styling.header} variant="h4">
				Global Chat
			</Typography>
			<Box style={styling.chats} ref={chatRef} className={css.noScrollBar}>
				{chats.map((chat, i) => (
					<Box key={i} style={chat.senderId === socket.id ? styling.myChat : styling.otherChat}>
						<Box style={styling.avatarAndName}>
							<img style={styling.chatAvatar} src={`https://avatars.dicebear.com/api/personas/${chat.senderName}.svg`} alt="Avatar" />
							<p style={styling.sender}>{chat.senderName}</p>
						</Box>
						<span>{chat.message}</span>
					</Box>
				))}
			</Box>
			<form
				onSubmit={(e) => {
					sendChat(e);
				}}
				style={styling.form}
			>
				<TextField
					type="text"
					name="message"
					label="Chat"
					onChange={(e) => {
						handleInput(e.target.value);
					}}
					value={input}
					sx={styling.input}
					InputLabelProps={{ style: { color: '#fff' } }}
					InputProps={{ style: { color: '#fff' } }}
					autoComplete="off"
					variant="filled"
				/>
				<br />
				<Fab type="submit" size="small" aria-label="Send" sx={styling.fab}>
					<SendIcon />
				</Fab>
			</form>
		</Box>
	);
};

export default Chat;
