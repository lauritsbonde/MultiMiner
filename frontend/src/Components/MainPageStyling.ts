import { CSSProperties } from 'react';

export const styling = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		width: '100%',
	},
	infoContainer: {
		display: 'flex',
		justifyContent: 'space-around',
	},
	fuelDisplayContainer: { width: '12vw', minWidth: '40px', height: '3vh', minHeight: '18px', backgroundColor: 'grey', margin: '4px', position: 'relative' },
	canvasAndChat: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	chat: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#ddd',
		width: '20vw',
		minWidth: '300px',
		maxWidth: '600px',
		height: '100%',
		maxHeight: '75vh',
		border: '1px solid black',
		borderRadius: '5px',
		padding: '2px',
		boxSizing: 'border-box',
	},
} as { [key: string]: CSSProperties };
