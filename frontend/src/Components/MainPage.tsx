import { useEffect, useState, FC } from 'react';
import Canvas from './Canvas';
import { Socket } from 'socket.io-client';
import { buildingStyle } from '../CanvasStyles/BuildingStyle';
import BuildingContainer from '../Components/BuildingMenus/BuildingContainer';
import useCanvas from '../Hooks/useCanvas';
import { MineralData, ConstantData, DynamicData, UpdateGameData } from '../Types/GameTypes';
import kdTree from '../kdTree';
import { drawUpperBackground, drawBuildings, drawMinerals, drawPlayers, drawSelf, drawPing, drawPlayerBasket } from '../CanvasStyles/drawHelper';
import { styling } from './MainPageStyling';
import { Box, Typography } from '@mui/material';
import ChatLeaderboardShifter from './ChatLeaderboardShifter/ChatLeaderboardShifter';

interface Props {
	socket: Socket;
	myId: string;
	constantData: ConstantData;
	startGameData: DynamicData;
	startMinerals: MineralData[];
	aiTraining: boolean;
	setMyId?: (id: string) => void;
	images?: { [key: string]: { [key: string]: any } };
}

const MainPage: FC<Props> = ({ socket, myId, constantData, startGameData, startMinerals, aiTraining, setMyId, images }) => {
	const [mineralsKdTree, setMineralsKdTree] = useState<kdTree>(new kdTree([...startMinerals]));
	const [gameData, setGameData] = useState<DynamicData>(startGameData);
	const [canvasOffSet, setCanvasOffSet] = useState({ x: 0, y: 0 });
	const [leaderBoard, setLeaderBoard] = useState([] as Array<{ id: string; name: string; points: number }>);
	const [latency, setLatency] = useState(0);
	// const [skies, setSkies] = useState();

	const newMinerals = (changedMinerals: Array<{ id: number; toType: string; boundingBox: { maxx: number; minx: number; maxy: number; miny: number } }>) => {
		if (changedMinerals.length === 0) return;

		const oldKdTree = mineralsKdTree;
		for (let i = 0; i < changedMinerals.length; i++) {
			oldKdTree.changeMineralType(changedMinerals[i].id, changedMinerals[i].toType, changedMinerals[i].boundingBox);
		}
		setMineralsKdTree(oldKdTree);
	};

	const draw = (ctx: CanvasRenderingContext2D) => {
		ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
		drawUpperBackground(ctx, constantData, canvasOffSet);
		drawBuildings(ctx, constantData, canvasOffSet);
		drawMinerals(ctx, constantData, canvasOffSet, mineralsKdTree, images.mineralImages);
		drawPlayers(ctx, gameData, canvasOffSet, myId, images.playerImages);
		drawPing(ctx, latency);
		drawPlayerBasket(ctx, gameData.players[myId].basket, images.miscImages.storage);
		drawSelf(ctx, gameData, myId, canvasOffSet, images.playerImages);
	};

	const canvasRef = useCanvas(draw);

	useEffect(() => {
		const interval = setInterval(() => {
			const start = Date.now();
			socket.emit('ping', () => {
				const duration = Date.now() - start;
				setLatency(duration);
			});
		}, 100);

		return () => clearInterval(interval);
	}, [socket]);

	useEffect(() => {
		const newOffSet = { ...canvasOffSet };

		socket.on('update', (data: UpdateGameData) => {
			newMinerals(data.changedMinerals);
			setGameData({ players: data.players });
			setLeaderBoard(data.leaderBoard);
			calculateCanvasOffSet(data);
		});

		socket.on('changeBestAi', (data: { newId: string }) => {
			if (Object.keys(gameData).length > 0 && gameData.players[data.newId]) {
				if (setMyId !== undefined && myId !== data.newId) {
					setMyId(data.newId);
				}
			}
		});

		const calculateCanvasOffSet = (data: DynamicData) => {
			const player = data.players[myId];
			if (player.pos.x > (canvasRef.current.width * 0.95) / 2 && player.pos.x < constantData.size.width - canvasRef.current.width / 2) {
				newOffSet.x = Math.max(0, player.pos.x - canvasRef.current.width / 2);
			}

			if (player.pos.y > (canvasRef.current.height * 0.85) / 2 && player.pos.y < constantData.size.height - canvasRef.current.height / 2) {
				newOffSet.y = Math.max(0, player.pos.y - canvasRef.current.height / 2);
			}

			if (canvasOffSet.x !== newOffSet.x || canvasOffSet.y !== newOffSet.y) {
				setCanvasOffSet(newOffSet);
			}
		};

		if (!aiTraining) {
			document.addEventListener('keydown', ({ code, repeat, target }) => {
				if (target instanceof HTMLInputElement) return;
				if (!repeat) {
					if (code === 'ArrowUp' || code === 'KeyW') {
						socket.emit('move', { dir: 'up', id: myId });
					} else if (code === 'ArrowDown' || code === 'KeyS') {
						socket.emit('move', { dir: 'down', id: myId });
					} else if (code === 'ArrowLeft' || code === 'KeyA') {
						socket.emit('move', { dir: 'left', id: myId });
					} else if (code === 'ArrowRight' || code === 'KeyD') {
						socket.emit('move', { dir: 'right', id: myId });
					}
				}
			});

			document.addEventListener('keyup', ({ code, target }) => {
				if (target instanceof HTMLInputElement) return;
				if (code === 'ArrowUp' || code === 'KeyW') {
					socket.emit('stop', { dir: 'up', id: myId });
				} else if (code === 'ArrowDown' || code === 'KeyS') {
					socket.emit('stop', { dir: 'down', id: myId });
				} else if (code === 'ArrowLeft' || code === 'KeyA') {
					socket.emit('stop', { dir: 'left', id: myId });
				} else if (code === 'ArrowRight' || code === 'KeyD') {
					socket.emit('stop', { dir: 'right', id: myId });
				}
			});
		}

		return () => {
			socket.off('update');
			socket.off('changeBestAi');
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameData.players]);

	const fuelRatio = gameData.players !== undefined && myId !== '' ? (gameData.players[myId].fuel.current / gameData.players[myId].fuel.max) * 100 : 0;

	return (
		<Box sx={styling.container}>
			<Box>{gameData.players !== undefined && gameData.players[myId].isDead && <Typography variant="h3">You died!</Typography>}</Box>
			<Box sx={styling.gameContainer}>
				{gameData.players && (
					<Box sx={styling.infoContainer}>
						<Box sx={styling.infoElement}>
							<Typography variant="h6">Fuel:</Typography>
							<Box sx={styling.fuelDisplayContainer}>
								<Typography sx={styling.fuelText}>
									{gameData.players[myId].fuel.current.toFixed(2)} / {gameData.players[myId].fuel.max} L
								</Typography>
								<Box sx={{ width: fuelRatio + '%', height: '100%', backgroundColor: fuelRatio < 15 ? 'red' : fuelRatio < 30 ? 'orange' : 'green' }} />
							</Box>
						</Box>
						<Box sx={styling.infoElement}>
							<Typography variant="h6">Money: {gameData.players[myId].money.toFixed(2)}</Typography>
						</Box>
					</Box>
				)}
				<Box sx={styling.canvasAndChat}>
					<Canvas draw={draw} canvasRef={canvasRef} />
					{gameData.players !== undefined &&
						gameData.players[myId].onBuilding !== '' &&
						gameData.players[myId].onBuilding !== 'graveyard' &&
						gameData.players[myId].onBuilding !== 'spectating' && (
							<BuildingContainer
								socket={socket}
								building={gameData.players[myId].onBuilding}
								bgColor={gameData.players[myId].onBuilding !== '' ? buildingStyle[gameData.players[myId].onBuilding].innerColor : '#00ff00'}
								myId={myId}
							/>
						)}
					<ChatLeaderboardShifter socket={socket} leaderboard={leaderBoard} myId={myId} />
				</Box>
			</Box>
		</Box>
	);
};

export default MainPage;
