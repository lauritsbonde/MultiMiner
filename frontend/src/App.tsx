import { useState, useEffect } from 'react';
import MainPage from './Components/MainPage';
import { ConstantData, DynamicData, StartData, MineralData } from './Types/GameTypes';
import { io, Socket } from 'socket.io-client';
import { miscSprite, mineralSprite, playerSprite } from './CanvasStyles/Sprites';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { useAuth0, User } from '@auth0/auth0-react';
import StartPage from './Components/StartPage';

function App() {
	const [socket, setSocket] = useState(null as unknown as Socket);
	const [myId, setMyId] = useState<string>('');
	const [constantData, setConstantData] = useState<ConstantData>({} as ConstantData);
	const [gameData, setGameData] = useState<DynamicData>({} as DynamicData);
	const [minerals, setMinerals] = useState<MineralData[]>([]);
	const [mineralImages, setMineralImages] = useState({} as { [key: string]: any });
	const [playerImages, setPlayerImages] = useState({} as { [key: string]: { [key: string]: any } });
	const [miscImages, setMiscImages] = useState({} as { [key: string]: any });

	//MAYBE REMOVE
	const [aiTraining, setAiTraining] = useState(false);

	const { loginWithRedirect, logout, user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

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
		cacheImages(miscSprite, (loadedImages) => {
			setMiscImages(loadedImages);
		});
		document.title = 'Multiminer!';
	}, []);

	const createSocketConnection = () => {
		return new Promise<Socket>((resolve, reject) => {
			if (socket === null) {
				const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}`;
				const socket = io(BACKEND_URL, {
					path: process.env.REACT_APP_ENVIRONMENT === 'development' ? '/socket.io' : '/api/socket.io',
					withCredentials: true,
					autoConnect: true,
					extraHeaders: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
						'my-custom-header': 'abcd',
					},
					transports: ['websocket', 'polling'],
					auth: {
						auth0Id: user?.sub,
					},
				});

				socket.on('connect', () => {
					resolve(socket);
				});

				socket.on('connect_error', (err) => {
					console.log(err);
					reject(err);
				});

				resolve(socket);
			} else {
				console.log('socket connection already exists');
				reject(null);
			}
		});
	};

	const joinGame = (imageIndex: { head: string; body: string; bottom: string; wheels: string }) => {
		if (socket === null) {
			createSocketConnection()
				.then((socket: Socket) => {
					if (socket === null) {
						return;
					}
					setSocket(socket);
					socket.emit(
						'join',
						{
							user,
							imageIndex,
						},
						(res: { success: boolean; data: string | StartData }) => {
							if (!res.success) {
								console.log('error joining game', res.data);
								return;
							}
							if (typeof res.data === 'string') {
								console.log(res.data);
								return;
							}
							setMyId(res.data.id);
							setConstantData({ size: res.data.size, groundStart: res.data.groundStart, buildings: res.data.buildings });
							setGameData({ players: res.data.players });
							setMinerals(res.data.minerals);
						}
					);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			console.log('socket connection already exists2');
			console.log(socket);
		}
	};

	const logOut = () => {
		if (socket !== undefined) socket.disconnect();
		logout({ returnTo: window.location.href });
	};

	if (!aiTraining) {
		if (isLoading) {
			return (
				<>
					<LinearProgress />
					<Typography variant="h1" sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%)' }}>
						Loading MultiMiner...
					</Typography>
				</>
			);
		}
	}

	if (socket === null) {
		return (
			<StartPage
				loginWithRedirect={() => loginWithRedirect({ redirectUri: window.location.href })}
				authenticated={isAuthenticated}
				logout={() => logout()}
				joinGame={joinGame}
				playerImages={playerImages}
				username={user?.nickname || 'boring'}
			/>
		);
	}

	return (
		<Box>
			{minerals.length === 0 && (
				<>
					<LinearProgress />
					<Typography variant="h1" sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%)' }}>
						Loading Game...
					</Typography>
				</>
			)}
			<Button
				variant="contained"
				onClick={() => {
					logOut();
				}}
			>
				Logout
			</Button>
			{aiTraining && (
				<Button
					variant="contained"
					onClick={() =>
						socket.emit('newAis', {}, (data: string) => {
							setMyId(data);
						})
					}
				>
					New ais
				</Button>
			)}
			<Box sx={{ height: '100vh' }}>
				{minerals.length > 0 && (
					<MainPage
						socket={socket}
						myId={myId}
						constantData={constantData}
						startGameData={gameData}
						startMinerals={minerals}
						images={{ miscImages, mineralImages, playerImages }}
						aiTraining={aiTraining}
						setMyId={setMyId}
					/>
				)}
			</Box>
		</Box>
	);
}
export default App;
