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
		mineralList: {},
	} as { [key: string]: CSSProperties };

	return (
		<div>
			<h3>MineralShop</h3>
			{Object.keys(mineralData).length > 0 ? (
				<div style={styling.outerContainer}>
					<ul style={styling.mineralList}>
						{Object.keys(mineralData).map((mineral) => (
							<li key={mineral}>
								<div>
									<p>{mineral}</p>
									<p>Amount: {mineralData[mineral].amount}</p>
									<p>Price pr: {mineralData[mineral].price}$</p>
									<p>Total price: {mineralData[mineral].totalPrice}$</p>
								</div>
								<div>
									<button>Sell 1 {mineral}</button>
									<button>Sell all {mineral}</button>
								</div>
							</li>
						))}
					</ul>
					<button>Sell everything</button>
				</div>
			) : (
				<p>No minerals</p>
			)}
		</div>
	);
};

export default MineralShop;
