import { Box, Table, TableBody, TableCell, Typography, TableRow, Button } from '@mui/material';
import React, { useState, CSSProperties } from 'react';
import socketProps from '../../Types/Socket';

const MineralShop: React.FC<socketProps> = ({ socket }) => {
	const [mineralData, setMineralData] = useState({} as { [type: string]: { price: number; amount: number; totalPrice: number } });

	socket.emit('enterMineralShop', {}, (response: { [type: string]: { price: number; amount: number; totalPrice: number } }) => {
		setMineralData(response);
	});

	const styling = {
		outerContainer: {
			display: 'flex',
			flexDirection: 'column',
		},
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
		mineralList: {},
		cell: {
			color: '#fff',
		},
		sellButtons: {
			width: '10%',
		},
	} as { [key: string]: CSSProperties };

	const sellMineral = (mineral: string, amount?: number) => {
		socket.emit('sellMineral', { mineral, amount: amount !== undefined ? amount : -1 }, () => {
			console.log('sell');
		});
	};

	return (
		<Box sx={styling.container}>
			<Typography variant="h5">MineralShop</Typography>
			{Object.keys(mineralData).length > 0 ? (
				<Box sx={styling.outerContainer}>
					<Table sx={styling.mineralList}>
						<TableBody>
							{Object.keys(mineralData).map((mineral) => (
								<TableRow key={mineral}>
									<TableCell sx={styling.cell}>
										<Typography>{mineral}</Typography>
									</TableCell>
									<TableCell sx={styling.cell}>Amount: {mineralData[mineral].amount}</TableCell>
									<TableCell sx={styling.cell}>Price pr: {mineralData[mineral].price}$</TableCell>
									<TableCell sx={styling.cell}>Total price: {mineralData[mineral].totalPrice}$</TableCell>
									<TableCell sx={{ ...styling.cell, ...styling.sellButtons }}>
										<Typography>Sell {mineral}</Typography>
										<Button
											variant="contained"
											onClick={() => {
												sellMineral(mineral, 1);
											}}
										>
											1
										</Button>
										{mineralData[mineral].amount > 1 && (
											<Button
												variant="contained"
												onClick={() => {
													sellMineral(mineral, mineralData[mineral].amount);
												}}
											>
												All
											</Button>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Button
						sx={{ marginTop: '10px' }}
						variant="contained"
						onClick={() => {
							sellMineral('all');
						}}
					>
						Sell everything
					</Button>
				</Box>
			) : (
				<Typography variant="h5">No minerals</Typography>
			)}
		</Box>
	);
};

export default MineralShop;
