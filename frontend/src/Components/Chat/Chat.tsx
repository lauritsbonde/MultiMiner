import React, { FC, CSSProperties, useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Box, Button, TextField } from '@mui/material';

interface Props {
	socket: Socket;
	style?: React.CSSProperties;
}

const Chat: FC<Props> = ({ socket, style }) => {
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

	const styling = {
		header: { height: '8%', margin: '4px' },
		chats: { overflowY: 'scroll', height: '88%' },
		myChat: {
			backgroundColor: '#f0f0f0',
			borderRadius: '5px',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		otherChat: {
			backgroundColor: '#e0e0e0',
			borderRadius: '5px',
			display: 'flex',
			flexDirection: 'row-reverse',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		chatAvatar: {
			width: '30px',
			height: '30px',
			borderRadius: '50%',
			margin: '5px',
		},
		avatarAndName: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
		},
	} as { [key: string]: CSSProperties };

	const chatRef = useRef({} as HTMLDivElement);

	useEffect(() => {
		chatRef.current.scrollTop = chatRef.current.scrollHeight;
	}, [chats]);

	return (
		<Box style={style}>
			<h3 style={styling.header}>Global Chat</h3>
			<Box style={styling.chats} ref={chatRef}>
				{chats.map((chat, i) => (
					<Box key={i} style={chat.senderId === socket.id ? styling.myChat : styling.otherChat}>
						<Box style={styling.avatarAndName}>
							<img style={styling.chatAvatar} src={`https://avatars.dicebear.com/api/personas/${chat.senderName}.svg`} alt="Avatar" />
							<span>{chat.senderName}: </span>
						</Box>
						<span>{chat.message}</span>
					</Box>
				))}
			</Box>
			<form
				onSubmit={(e) => {
					sendChat(e);
				}}
				style={{ height: '15%', width: '95%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}
			>
				<TextField
					type="text"
					name="message"
					placeholder="Hello!"
					onChange={(e) => {
						handleInput(e.target.value);
					}}
					value={input}
					sx={{ resize: 'none', width: '100%', height: '40%' }}
				/>
				<br />
				<Button variant="contained" type="submit" sx={{ width: '100%' }}>
					Send message!
				</Button>
			</form>
		</Box>
	);
};

export default Chat;
