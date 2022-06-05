import React, { FC, CSSProperties } from 'react';
import { Socket } from 'socket.io-client';

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

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
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
			flexDirection: 'row',
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

	return (
		<div style={style}>
			<h3 style={styling.header}>Global Chat</h3>
			<div style={styling.chats}>
				{chats.map((chat, i) => (
					<div key={i} style={chat.senderId === socket.id ? styling.myChat : styling.otherChat}>
						<div style={styling.avatarAndName}>
							<img style={styling.chatAvatar} src={`https://avatars.dicebear.com/api/personas/${chat.senderName}.svg`} alt="Avatar" />
							<span>{chat.senderName}: </span>
						</div>
						<span>{chat.message}</span>
					</div>
				))}
			</div>
			<form
				onSubmit={(e) => {
					sendChat(e);
				}}
				style={{ height: '10%', width: '90%' }}
			>
				<input
					type="text"
					name="message"
					placeholder="Hello!"
					onChange={(e) => {
						handleInput(e);
					}}
					value={input}
					style={{ resize: 'none', width: '100%', height: '40%' }}
				/>
				<br />
				<button type="submit" style={{ width: '100%' }}>
					Send message!
				</button>
			</form>
		</div>
	);
};

export default Chat;
