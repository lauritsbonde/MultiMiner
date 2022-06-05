import React, { useState, useEffect } from 'react';
import MainPage from './Components/MainPage';
import Join from './Components/Join';
import { ConstantData, DynamicData, StartData, MineralData } from './Types/GameTypes';
import { io, Socket } from 'socket.io-client';

function App() {
	const [joined, setJoined] = useState(false);
	const [socket, setSocket] = useState({} as Socket);
	const [myId, setMyId] = useState<string>('');
	const [constantData, setConstantData] = useState<ConstantData>({} as ConstantData);
	const [gameData, setGameData] = useState<DynamicData>({} as DynamicData);
	const [minerals, setMinerals] = useState<MineralData[]>([]);

	const joinGame = (name: string) => {
		socket.emit(
			'join',
			{
				name,
			},
			(data: StartData) => {
				setConstantData({ size: data.size, groundStart: data.groundStart, buildings: data.buildings });
				setGameData({ players: data.players, selfPlayer: data.selfPlayer });
				setMinerals(data.minerals);
			}
		);
		setMyId(socket.id);
		setSocket(socket);
		setJoined(true);
	};

	const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}`;

	useEffect(() => {
		const socket = io(BACKEND_URL);

		socket.on('connect', () => {
			setMyId(socket.id);
			setSocket(socket);
		});

		return () => {
			socket.close();
		};
	}, [BACKEND_URL]);

	return (
		<div style={{ height: '100vh' }}>
			{!joined && <Join joinGame={joinGame} />}
			{minerals.length > 0 && <MainPage socket={socket} myId={myId} constantData={constantData} startGameData={gameData} startMinerals={minerals} />}
		</div>
	);
}
export default App;
