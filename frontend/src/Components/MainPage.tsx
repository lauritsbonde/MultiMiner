import { useEffect, useState, FC } from 'react';
import Canvas from './Canvas';
import { Socket } from 'socket.io-client';
import { buildingStyle } from '../CanvasStyles/BuildingStyle';
import BuildingContainer from '../Components/BuildingMenus/BuildingContainer';
import useCanvas from '../Hooks/useCanvas';
import { MineralData, ConstantData, DynamicData, UpdateGameData } from '../Types/GameTypes';
import kdTree from '../kdTree';
import { drawUpperBackground, drawBuildings, drawMinerals, drawPlayers, drawSelf } from '../CanvasStyles/drawHelper';
import Chat from './Chat/Chat';
import { styling } from './MainPageStyling';
import { Box, Typography } from '@mui/material';

interface Props {
	socket: Socket;
	myId: string;
	constantData: ConstantData;
	startGameData: DynamicData;
	startMinerals: MineralData[];
	images: { [key: string]: { [key: string]: any } };
	allImagesLoaded: boolean;
}

const MainPage: FC<Props> = ({ socket, myId, constantData, startGameData, startMinerals, images, allImagesLoaded }) => {
	const [mineralsKdTree, setMineralsKdTree] = useState<kdTree>(new kdTree([...startMinerals]));
	const [gameData, setGameData] = useState<DynamicData>(startGameData);
	const [canvasOffSet, setCanvasOffSet] = useState({ x: 0, y: 0 });
	// const [skies, setSkies] = useState();

	const newMinerals = (changedMinerals: Array<{ id: number; toType: string; boundingBox: { maxx: number; minx: number; maxy: number; miny: number } }>) => {
		const oldKdTree = mineralsKdTree;
		for (let i = 0; i < changedMinerals.length; i++) {
			oldKdTree.changeMineralType(changedMinerals[i].id, changedMinerals[i].toType, changedMinerals[i].boundingBox);
		}
		setMineralsKdTree(oldKdTree);
	};

	const draw = (ctx: any) => {
		ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
		drawUpperBackground(ctx, constantData, canvasOffSet);
		drawBuildings(ctx, constantData, canvasOffSet);
		drawMinerals(ctx, constantData, canvasOffSet, mineralsKdTree, images.mineralImages, allImagesLoaded);
		drawPlayers(ctx, gameData, canvasOffSet, myId, images.playerImages);
		drawSelf(ctx, gameData, myId, canvasOffSet, images.playerImages);
	};

	const canvasRef = useCanvas(draw);

	useEffect(() => {
		const newOffSet = { ...canvasOffSet };

		socket.on('update', (data: UpdateGameData) => {
			newMinerals(data.changedMinerals);
			setGameData({ players: data.players, selfPlayer: data.selfPlayer });
			calculateCanvasOffSet(data);
		});

		const calculateCanvasOffSet = (data: DynamicData) => {
			const player = data.players[myId];
			if (player.pos.x > (canvasRef.current.width * 0.95) / 2 && player.pos.x < constantData.size.width - canvasRef.current.width / 2) {
				newOffSet.x = Math.max(0, player.pos.x - canvasRef.current.width / 2);
			}

			if (player.pos.y > (canvasRef.current.height * 0.85) / 2 && player.pos.y < constantData.size.height - canvasRef.current.height / 2) {
				newOffSet.y = Math.max(0, player.pos.y - canvasRef.current.height / 2);
			}

			setCanvasOffSet(newOffSet);
		};

		document.addEventListener('keydown', ({ code, repeat }) => {
			if (!repeat) {
				if (code === 'ArrowUp') {
					socket.emit('move', 'up');
				}
				if (code === 'ArrowDown') {
					socket.emit('move', 'down');
				}
				if (code === 'ArrowLeft') {
					socket.emit('move', 'left');
				}
				if (code === 'ArrowRight') {
					socket.emit('move', 'right');
				}
				// else if (code === 'KeyW') {
				// 	socket.emit('stop', 'up');
				// } else if (code === 'KeyS') {
				// 	socket.emit('stop', 'down');
				// } else if (code === 'KeyA') {
				// 	socket.emit('stop', 'left');
				// } else if (code === 'KeyD') {
				// 	socket.emit('stop', 'right');
				// }
			}
		});

		document.addEventListener('keyup', ({ code }) => {
			if (code === 'ArrowUp') {
				socket.emit('stop', 'up');
			} else if (code === 'ArrowDown') {
				socket.emit('stop', 'down');
			} else if (code === 'ArrowLeft') {
				socket.emit('stop', 'left');
			} else if (code === 'ArrowRight') {
				socket.emit('stop', 'right');
			}
			// else if (code === 'KeyW') {
			// 	socket.emit('stop', 'up');
			// } else if (code === 'KeyS') {
			// 	socket.emit('stop', 'down');
			// } else if (code === 'KeyA') {
			// 	socket.emit('stop', 'left');
			// } else if (code === 'KeyD') {
			// 	socket.emit('stop', 'right');
			// }
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fuelRatio = gameData.players !== undefined && myId !== '' ? (gameData.players[myId].fuel.current / gameData.players[myId].fuel.max) * 100 : 0;

	return (
		<Box sx={styling.container}>
			<Box>
				{gameData.players !== undefined && gameData.players[myId].isDead && <Typography variant="h3">You died!</Typography>}
				{gameData.players && (
					<Box sx={styling.infoContainer}>
						<Typography variant="h6" sx={{ display: 'flex' }}>
							Fuel:
							<Box sx={styling.fuelDisplayContainer}>
								<Typography sx={{ position: 'absolute', zIndex: 1, top: '0', left: '20%', margin: 0, padding: 0 }}>
									{gameData.players[myId].fuel.current.toFixed(2)} / {gameData.players[myId].fuel.max} L
								</Typography>
								<Box sx={{ width: fuelRatio + '%', height: '100%', backgroundColor: fuelRatio < 15 ? 'red' : fuelRatio < 30 ? 'orange' : 'green' }}></Box>
							</Box>
						</Typography>
						<Typography variant="h6">Money: {gameData.players[myId].money.toFixed(2)}</Typography>
					</Box>
				)}
			</Box>
			<Box sx={styling.canvasAndChat}>
				<Canvas draw={draw} canvasRef={canvasRef} />
				{gameData.players !== undefined && gameData.players[myId].onBuilding !== '' && gameData.players[myId].onBuilding !== 'graveyard' && (
					<BuildingContainer
						socket={socket}
						building={gameData.players[myId].onBuilding}
						bgColor={gameData.players[myId].onBuilding !== '' ? buildingStyle[gameData.players[myId].onBuilding].innerColor : '#00ff00'}
					/>
				)}
				<Chat socket={socket} />
			</Box>
		</Box>
	);
};

export default MainPage;
