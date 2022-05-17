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

	const sellMineral = (mineral: string, amount?: number) => {
		socket.emit('sellMineral', { mineral, amount: amount !== undefined ? amount : -1 }, () => {
			console.log('sell');
		});
	};

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
									<button
										onClick={() => {
											sellMineral(mineral, 1);
										}}
									>
										Sell 1 {mineral}
									</button>
									{mineralData[mineral].amount > 1 && (
										<button
											onClick={() => {
												sellMineral(mineral, mineralData[mineral].amount);
											}}
										>
											Sell all {mineral}
										</button>
									)}
								</div>
							</li>
						))}
					</ul>
					<button
						onClick={() => {
							sellMineral('all');
						}}
					>
						Sell everything
					</button>
				</div>
			) : (
				<p>No minerals</p>
			)}
		</div>
	);
};

export default MineralShop;
