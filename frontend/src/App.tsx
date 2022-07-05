import { useState, useEffect } from 'react';
import MainPage from './Components/MainPage';
import { ConstantData, DynamicData, StartData, MineralData } from './Types/GameTypes';
import { io, Socket } from 'socket.io-client';
import { mineralSprite, playerSprite } from './CanvasStyles/Sprites';
import { Box, createTheme, ThemeProvider, Button } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

declare module '@mui/material/styles' {
	interface Theme {
		status: {
			danger: string;
		};
	}
	// allow configuration using `createTheme`
	interface ThemeOptions {
		status?: {
			danger?: string;
		};
	}
}

function App() {
	const [socket, setSocket] = useState({} as Socket);
	const [myId, setMyId] = useState<string>('');
	const [constantData, setConstantData] = useState<ConstantData>({} as ConstantData);
	const [gameData, setGameData] = useState<DynamicData>({} as DynamicData);
	const [minerals, setMinerals] = useState<MineralData[]>([]);
	const [mineralImages, setMineralImages] = useState({} as { [key: string]: any });
	const [allImagesLoaded, setAllImagesLoaded] = useState(false);
	const [playerImages, setPlayerImages] = useState({} as { [key: string]: { [key: string]: any } });

	//MAYBE REMOVE
	const [aiTraining, setAiTraining] = useState(false);

	const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

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
			setAllImagesLoaded(true);
		})();
	}, []);

	const joinGame = (name: string) => {
		socket.emit(
			'join',
			{
				name,
			},
			(data: StartData) => {
				setMyId(data.id);
				setConstantData({ size: data.size, groundStart: data.groundStart, buildings: data.buildings });
				setGameData({ players: data.players });
				setMinerals(data.minerals);
			}
		);
		setSocket(socket);
	};

	const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}`;

	useEffect(() => {
		const socket = io(BACKEND_URL);

		socket.on('connect', () => {
			setSocket(socket);
		});

		return () => {
			socket.close();
		};
	}, [BACKEND_URL]);

	const theme = createTheme({
		status: {
			danger: '#f44336',
		},
		typography: {
			fontFamily: ['Roboto', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(
				','
			),
			h1: {
				fontWeight: '600',
			},
			h4: {
				fontWeight: '600',
			},
			h5: {
				fontWeight: '500',
			},
		},
	});

	useEffect(() => {
		document.title = isAuthenticated ? 'MultiMiner' : 'MultiMiner - Join';
		if (isAuthenticated) {
			joinGame(user?.nickname || 'boring');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated]);

	if (!aiTraining) {
		if (isLoading) return <div>Loading...</div>;
		if (!isAuthenticated)
			return (
				<>
					<Button variant="contained" onClick={() => loginWithRedirect({ redirectUri: window.location.href })}>
						Login
					</Button>
					<Button
						variant="contained"
						onClick={() => {
							setAiTraining(true);
							joinGame('ai');
						}}
					>
						AI
					</Button>
				</>
			);
	}

	return (
		<ThemeProvider theme={theme}>
			<Button
				variant="contained"
				onClick={() => {
					console.log(socket);
					socket.disconnect();
					logout({ returnTo: window.location.href });
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
						images={{ mineralImages, playerImages }}
						allImagesLoaded={allImagesLoaded}
						aiTraining={aiTraining}
						setMyId={setMyId}
					/>
				)}
			</Box>
		</ThemeProvider>
	);
}
export default App;
