import React, { useState } from 'react';
import socketProps from '../../Types/Socket';

const Fuelstation: React.FC<socketProps> = ({ socket }) => {
	const [fuelData, setFueldata] = useState({} as { [key: string]: { liters: number; price: number } });
	socket.emit('enterFuelStation', {}, (response: { [key: string]: { liters: number; price: number } }) => {
		setFueldata(response);
	});

	const purchaseFuel = (fuel: { amount: number; price: number }) => {
		socket.emit('purchaseFuel', fuel);
	};

	return (
		<div style={{ margin: 'auto' }}>
			<h3>Fuelstation</h3>
			{Object.keys(fuelData).map((fuel) => (
				<div key={fuel} style={{ display: 'flex', width: '40%', justifyContent: 'space-between', alignItems: 'center' }}>
					<h4>{fuel} tank</h4>
					<p>{fuelData[fuel].liters}L</p>
					<p>{fuelData[fuel].price}$</p>
					<button onClick={() => purchaseFuel({ amount: fuelData[fuel].liters, price: fuelData[fuel].price })}>Buy</button>
				</div>
			))}
		</div>
	);
};

export default Fuelstation;
