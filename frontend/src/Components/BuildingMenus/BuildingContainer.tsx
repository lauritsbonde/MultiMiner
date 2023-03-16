import { Box } from '@mui/material';
import React, { FC } from 'react';
import { Socket } from 'socket.io-client';
import Fuelstation from './Fuelstation';
import MineralShop from './MineralShop';
import ResearchLab from './ResearchLab';
import UpgradeShop from './UpgradeShop';
import SaverMenu from './SaverMenu';

interface BuildingContainerProps {
	building: string;
	bgColor: string;
	socket: Socket;
	myId: string;
}

const BuildingContainer: FC<BuildingContainerProps> = ({ building, bgColor, socket, myId }) => {
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
				<Fuelstation socket={socket} myId={myId} />
			) : building === 'Mineral Shop' ? (
				<MineralShop socket={socket} myId={myId} />
			) : building === 'Upgrade Shop' ? (
				<UpgradeShop socket={socket} myId={myId} />
			) : building === 'Research Lab' ? (
				<ResearchLab socket={socket} myId={myId} />
			) : building === 'Saver' ? (
				<SaverMenu socket={socket} myId={myId} />
			) : (
				<h2>Building Error</h2>
			)}
		</Box>
	);
};

export default BuildingContainer;
