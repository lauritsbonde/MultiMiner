import { Box } from '@mui/material';
import React from 'react';
import { Socket } from 'socket.io-client';
import Fuelstation from './Fuelstation';
import MineralShop from './MineralShop';
import ResearchLab from './ResearchLab';
import UpgradeShop from './UpgradeShop';

interface BuildingContainerProps {
	building: string;
	bgColor: string;
	socket: Socket;
}

const BuildingContainer: React.FC<BuildingContainerProps> = ({ building, bgColor, socket }) => {
	const transparentBg = bgColor + 'd8';
	const styling = {
		position: 'absolute',
		top: '25%',
		minHeight: '50vh',
		width: '50%',
		backgroundColor: transparentBg,
		backdropFilter: 'blur(5px)',
		borderRadius: '10px',
		padding: '10px',
		boxSizing: 'border-box',
		color: '#fff',
	} as React.CSSProperties;
	return (
		<Box sx={styling}>
			{building === 'Fuelstation' ? (
				<Fuelstation socket={socket} />
			) : building === 'Mineral Shop' ? (
				<MineralShop socket={socket} />
			) : building === 'Upgrade Shop' ? (
				<UpgradeShop socket={socket} />
			) : building === 'Research Lab' ? (
				<ResearchLab socket={socket} />
			) : (
				<h2>Building Error</h2>
			)}
		</Box>
	);
};

export default BuildingContainer;
