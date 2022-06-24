import React, { FC, useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Box, Fab, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styling } from './ChatStyling';
import css from './styling.module.css';

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
			<Box style={styling.chats} ref={chatRef} className={css.noScrollBar}>
				{chats.map((chat, i) => (
					<Box key={i} style={chat.senderId === socket.id ? styling.myChat : styling.otherChat}>
						<Box style={styling.avatarAndName}>
							<img style={styling.chatAvatar} src={`https://avatars.dicebear.com/api/personas/${chat.senderName}.svg`} alt="Avatar" />
							<p style={styling.sender}>{chat.senderName}</p>
						</Box>
						<Box sx={styling.message}>{chat.message}</Box>
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
