import React from 'react';
import Fuelstation from './Fuelstation';
import MineralShop from './MineralShop';
import ResearchLab from './ResearchLab';
import UpgradeShop from './UpgradeShop';

interface BuildingContainerProps {
	building: string;
	bgColor: string;
}

const BuildingContainer: React.FC<BuildingContainerProps> = ({ building, bgColor }) => {
	const transparentBg = bgColor + 'd8';
	const styling = {
		position: 'absolute',
		top: '25%',
		minHeight: '50vh',
		width: '80vw',
		left: '10vw',
		backgroundColor: transparentBg,
		backdropFilter: 'blur(5px)',
		borderRadius: '10px',
		padding: '10px',
		boxSizing: 'border-box',
	} as React.CSSProperties;
	return (
		<div style={styling}>
			{building === 'Fuelstation' ? (
				<Fuelstation />
			) : building === 'Mineral Shop' ? (
				<MineralShop />
			) : building === 'Upgrade Shop' ? (
				<UpgradeShop />
			) : building === 'Research Lab' ? (
				<ResearchLab />
			) : (
				<h2>Building Error</h2>
			)}
		</div>
	);
};

export default BuildingContainer;
