import React, { FC, CSSProperties, useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Box, Fab, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

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

	const styling = {
		chat: {
			display: 'flex',
			flexDirection: 'column',
			backgroundColor: '#ddd',
			width: '20vw',
			minWidth: '300px',
			maxWidth: '600px',
			height: '85vh',
			border: '1px solid black',
			borderRadius: '5px',
			padding: '2px',
			boxSizing: 'border-box',
			overflow: 'hidden',
		},
		header: { height: '8%', margin: '4px' },
		chats: { overflowY: 'scroll', height: '80%', width: '100%', paddingRight: '5px' },
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
			width: '30%',
			height: '30px',
			borderRadius: '50%',
			margin: '5px',
		},
		avatarAndName: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			maxWidth: '30%',
		},
		sender: {
			fontSize: '.8 em',
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
			marginRight: '4px',
			boxSizing: 'border-box',
		},
	} as { [key: string]: CSSProperties };

	const chatRef = useRef({} as HTMLDivElement);

	useEffect(() => {
		chatRef.current.scrollTop = chatRef.current.scrollHeight;
	}, [chats]);

	return (
		<Box style={styling.chat}>
			<h3 style={styling.header}>Global Chat</h3>
			<Box style={styling.chats} ref={chatRef}>
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
				/>
				<br />
				<Fab type="submit" size="small" aria-label="Send">
					<SendIcon />
				</Fab>
			</form>
		</Box>
	);
};

export default Chat;
