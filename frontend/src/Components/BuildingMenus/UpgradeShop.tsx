import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';
import socketProps from '../../Types/Socket';

const styling = {
	container: {
		margin: 'auto',
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'column',
		alignItems: 'center',
	},
};

const UpgradeShop: FC<socketProps> = ({ socket }) => {
	return (
		<Box sx={styling.container}>
			<Typography variant="h5">UpgradeShop</Typography>
		</Box>
	);
};

export default UpgradeShop;
