import { Box, Button, Typography } from '@mui/material';
import React, { useState, CSSProperties, FC } from 'react';
import socketProps from '../../Types/Socket';

const Fuelstation: FC<socketProps> = ({ socket, myId }) => {
	const [fuelData, setFueldata] = useState({} as { [key: string]: { liters: number; price: number } });
	socket.emit('enterFuelStation', { id: myId }, (response: { [key: string]: { liters: number; price: number } }) => {
		setFueldata(response);
	});

	const purchaseFuel = (fuel: { amount: number; price: number }) => {
		socket.emit('purchaseFuel', { fuel, id: myId });
	};

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

	return (
		<Box style={styling.container}>
			<Typography variant="h5" sx={styling.title}>
				Fuelstation
			</Typography>
			{Object.keys(fuelData).map((fuel) => (
				<Box key={fuel} style={styling.item}>
					<Typography variant="h6">{fuel} tank</Typography>
					<Typography>{fuelData[fuel].liters}L</Typography>
					<Typography>{fuelData[fuel].price}$</Typography>
					<Button variant="contained" sx={styling.buyButton} onClick={() => purchaseFuel({ amount: fuelData[fuel].liters, price: fuelData[fuel].price })}>
						Buy
					</Button>
				</Box>
			))}
		</Box>
	);
};

export default Fuelstation;
