import React, { FC, useRef, useEffect, FormEvent } from 'react';
import { Socket } from 'socket.io-client';
import { Box, Fab, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styling } from './ChatStyling';
import { useUser } from '@auth0/nextjs-auth0/client';

interface Props {
	socket: Socket;
	myId: string;
}

const Chat: FC<Props> = ({ socket, myId }) => {
	const [chats, setChats] = React.useState<Array<{ senderName: string; message: string }>>([]);
	const [input, setInput] = React.useState('');

	const { error, user } = useUser();

	const sendChat = (e: FormEvent) => {
		e.preventDefault();
		socket.emit('chat', { message: input, id: myId });
		setInput('');
	};

	socket.on('newchat', (data: { senderName: string; message: string }) => {
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
			<Box style={styling.chats} ref={chatRef}>
				{chats.map((chat, i) => (
					<Box key={i} style={chat.senderName === user?.nickname ? { ...styling.baseChat, backgroundColor: '#00bae9' } : { ...styling.baseChat, backgroundColor: '#0080e9' }}>
						<Box style={styling.avatarAndName}>
							<img style={styling.chatAvatar} src={`https://avatars.dicebear.com/api/personas/${chat.senderName}.svg`} alt="Avatar" />
							<Typography variant="h6" sx={styling.sender}>
								{chat.senderName}
							</Typography>
						</Box>
						<Box sx={styling.message}>
							<Typography variant="body1">{chat.message}</Typography>
						</Box>
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
				<Fab type="submit" size="small" aria-label="Send" sx={styling.fab}>
					<SendIcon />
				</Fab>
			</form>
		</Box>
	);
};

export default Chat;
