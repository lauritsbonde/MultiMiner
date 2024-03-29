import { CSSProperties } from 'react';

export const styling = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		width: '100vw',
		marginTop: '50px',
	},
	gameContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: 'auto',
		maxWidth: '1600px',
		margin: '0 auto',
	},
	infoContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'left',
		alignItems: 'center',
		width: '100%',
		maxWidth: '1600px',
		padding: '10px 0',
		boxSizing: 'border-box',
		backgroundColor: '#0093E9',
	},
	infoElement: {
		margin: '0 10px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		color: 'white',
	},
	fuelDisplayContainer: {
		width: '12vw',
		minWidth: '40px',
		height: '40px',
		minHeight: '18px',
		backgroundColor: '#505050',
		margin: '4px',
		position: 'relative',
		border: '2px solid black',
	},
	fuelText: {
		margin: 0,
		padding: 0,
		position: 'absolute',
		zIndex: 2,
		top: '25%',
		left: '50%',
		transform: 'translate(-50%)',
		lineHeight: '100%',
	},
	canvasAndChat: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
} as { [key: string]: CSSProperties };
