import { CSSProperties } from 'react';

export const styling = {
	chat: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: '90%',
	},
	header: { height: '8%', margin: '4px' },
	chats: {
		overflowY: 'scroll',
		height: '80%',
		width: '100%',
		padding: '2px',
		boxSizing: 'border-box',
	},
	baseChat: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'left',
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
		alignItems: 'left',
		justifyContent: 'left',
		width: '100%',
	},
	sender: {
		fontSize: 'clamp(.9rem, 1.3vw, 1.5rem)',
	},
	message: {
		width: '100%',
		fontSize: 'clamp(.75rem, 1.15vw, 1.3rem)',
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
