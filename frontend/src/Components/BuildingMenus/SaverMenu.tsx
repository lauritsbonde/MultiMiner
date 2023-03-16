import React, { FC, CSSProperties } from 'react';
import socketProps from '../../Types/Socket';
import { Box, Button, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const SaverMenu: FC<socketProps> = ({ socket, myId }) => {
	const { user } = useAuth0();
	const styling = {
		container: {
			margin: 'auto',
			display: 'flex',
			justifyContent: 'space-between',
			flexDirection: 'column',
			alignItems: 'center',
		},
		title: {
			margin: '10px 0 20px 0',
		},
		item: {
			display: 'flex',
			width: '75%',
			justifyContent: 'space-between',
			alignItems: 'center',
			margin: '8px 0',
		},
		buyButton: {
			backgroundColor: '#2B7756',
			'&:hover': { backgroundColor: '#44916f' },
		},
	} as { [key: string]: CSSProperties };

	const save = () => {
		if (!user) return;
		socket.emit('save', { auth0Id: user.sub });
	};

	return (
		<Box style={styling.container}>
			<Typography variant="h5" sx={styling.title}>
				Saver Menu
			</Typography>
			<Button variant="contained" sx={styling.buyButton} onClick={save}>
				Save
			</Button>
		</Box>
	);
};

export default SaverMenu;
