import { useState, useEffect } from 'react';
import MainPage from './Components/MainPage';
import Join from './Components/Join';
import { ConstantData, DynamicData, StartData, MineralData } from './Types/GameTypes';
import { io, Socket } from 'socket.io-client';
import { mineralSprite, playerSprite } from './CanvasStyles/Sprites';

function App() {
	const [joined, setJoined] = useState(false);
	const [socket, setSocket] = useState({} as Socket);
	const [myId, setMyId] = useState<string>('');
	const [constantData, setConstantData] = useState<ConstantData>({} as ConstantData);
	const [gameData, setGameData] = useState<DynamicData>({} as DynamicData);
	const [minerals, setMinerals] = useState<MineralData[]>([]);
	const [mineralImages, setMineralImages] = useState({} as { [key: string]: any });
	const [allImagesLoaded, setAllImagesLoaded] = useState(false);
	const [playerImages, setPlayerImages] = useState({} as { [key: string]: { [key: string]: any } });

	const cacheImages = async (sources: { [key: string]: string }, callback: (loadedImages: { [key: string]: any }) => void) => {
		const loadedImages = {} as { [key: string]: any };
		const promises = await Object.keys(sources).map((src) => {
			return new Promise((resolve, reject) => {
				const img = new Image();

				img.src = sources[src];

				img.onload = () => {
					loadedImages[src] = img;
					resolve('loaded');
				};
				img.onerror = () => {
					reject();
				};
			});
		});
		await Promise.all(promises);
		callback(loadedImages);
	};

	useEffect(() => {
		cacheImages(mineralSprite, (loadedImages) => {
			setMineralImages(loadedImages);
		});
		(async () => {
			const load = async () => {
				const loadingPLayerImages = {} as { [key: string]: any };
				Object.keys(playerSprite).forEach((key) => {
					cacheImages(playerSprite[key], (loadedImages) => {
						loadingPLayerImages[key] = loadedImages;
					});
				});
				return loadingPLayerImages;
			};
			const loadedPlayerImages = await load();
			setPlayerImages(loadedPlayerImages);
		})();
	}, []);

	const joinGame = (name: string, imageIndex: { head: string; body: string; bottom: string; wheels: string }) => {
		socket.emit(
			'join',
			{
				name,
				imageIndex,
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
			{!joined && <Join joinGame={joinGame} playerImages={playerImages} />}
			{minerals.length > 0 && (
				<MainPage
					socket={socket}
					myId={myId}
					constantData={constantData}
					startGameData={gameData}
					startMinerals={minerals}
					images={{ mineralImages, playerImages }}
					allImagesLoaded={allImagesLoaded}
				/>
			)}
		</div>
	);
}
export default App;
