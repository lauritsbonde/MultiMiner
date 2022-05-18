import { useEffect, useState } from 'react';
import Canvas from './Canvas';
import { io, Socket } from 'socket.io-client';
import { mineralStyle } from '../CanvasStyles/mineralStyle';
import { buildingStyle } from '../CanvasStyles/BuildingStyle';
import BuildingContainer from '../Components/BuildingMenus/BuildingContainer';
import useCanvas from '../Hooks/useCanvas';
import { MineralData, StartData } from '../Types/GameTypes';
import { ConstantData } from '../Types/GameTypes';
import { DynamicData } from '../Types/GameTypes';
import { UpdateGameData } from '../Types/GameTypes';
import kdTree from '../kdTree';

function MainPage() {
	const [myId, setMyId] = useState<string>('');
	const [constantData, setConstantData] = useState<ConstantData>({} as ConstantData);
	const [minerals, setMinerals] = useState<MineralData[]>([]);
	const [mineralsKdTree, setMineralsKdTree] = useState<kdTree>({} as kdTree);
	const [gameData, setGameData] = useState<DynamicData>({} as DynamicData);
	const [canvasOffSet, setCanvasOffSet] = useState({ x: 0, y: 0 });
	// const [skies, setSkies] = useState();
	const [socket, setSocket] = useState({} as Socket);

	const newMinerals = (minerals: MineralData[]) => {
		const copyElements = [...minerals];
		const mineralsKdTree = new kdTree(copyElements);
		setMinerals(copyElements);
		setMineralsKdTree(mineralsKdTree);
	};

	const draw = (ctx: any) => {
		ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
		drawUpperBackground(ctx);
		drawBuildings(ctx);
		drawMinerals(ctx);
		drawPlayers(ctx);
		drawSelf(ctx);
	};

	const canvasRef = useCanvas(draw);

	const drawUpperBackground = (ctx: any) => {
		ctx.fillStyle = '#87CEEB';
		ctx.fillRect(0, 0, ctx.canvas.clientWidth, constantData.groundStart === undefined ? ctx.canvas.clientHeight : constantData.groundStart);
		ctx.fillStyle = '#FFFF00';
		ctx.beginPath();
		ctx.arc(40 - canvasOffSet.x, 40 - canvasOffSet.y, 150, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	};

	const drawBuildings = (ctx: any) => {
		if (constantData.buildings) {
			constantData.buildings.forEach((building: any) => {
				const styling = buildingStyle[building.title];
				ctx.fillStyle = styling.outerColor;
				ctx.fillRect(building.pos.x - canvasOffSet.x, building.pos.y - canvasOffSet.y, building.size.width, building.size.height);
				const border = 5;
				ctx.fillStyle = styling.innerColor;
				ctx.fillRect(building.pos.x - canvasOffSet.x + border, building.pos.y - canvasOffSet.y + border, building.size.width - border * 2, building.size.height - border * 2);
				ctx.fillStyle = '#fff';
				ctx.font = '10px Arial';
				ctx.fillText(building.title, building.pos.x - canvasOffSet.x + 20, building.pos.y - canvasOffSet.y + 45);
			});
		}
	};

	const drawMinerals = (ctx: any) => {
		if (minerals.length > 0) {
			const padding = Math.max(ctx.canvas.clientWidth, ctx.canvas.clientHeight) / 10;
			const boundingBox = {
				minx: 0 + canvasOffSet.x - padding,
				miny: 0 + canvasOffSet.y - padding,
				maxx: ctx.canvas.clientWidth + canvasOffSet.x + padding,
				maxy: ctx.canvas.clientHeight + canvasOffSet.y + padding,
			};
			const mineralsInRange = mineralsKdTree.rangeSearch(boundingBox);
			for (let mineral in mineralsInRange) {
				const styling = mineralStyle[mineralsInRange[mineral].type];
				ctx.fillStyle = styling.outerColor;
				ctx.fillRect(
					mineralsInRange[mineral].pos.x - canvasOffSet.x,
					mineralsInRange[mineral].pos.y - canvasOffSet.y,
					mineralsInRange[mineral].size.width,
					mineralsInRange[mineral].size.height
				);
				const border = 2;
				ctx.fillStyle = styling.innerColor;
				ctx.fillRect(
					mineralsInRange[mineral].pos.x - canvasOffSet.x + border,
					mineralsInRange[mineral].pos.y - canvasOffSet.y + border,
					mineralsInRange[mineral].size.width - border * 2,
					mineralsInRange[mineral].size.height - border * 2
				);

				if (mineralsInRange[mineral].type === 'Concrete' && mineralsInRange[mineral].pos.y !== constantData.groundStart) {
					ctx.fillStyle = '#fff';
					ctx.font = '10px Arial';
					ctx.fillText('BOTTOM', mineralsInRange[mineral].pos.x - canvasOffSet.x + 2, mineralsInRange[mineral].pos.y - canvasOffSet.y + 25);
				} else {
					ctx.fillStyle = '#fff';
					ctx.font = '10px Arial';
					ctx.fillText(mineralsInRange[mineral].type, mineralsInRange[mineral].pos.x - canvasOffSet.x + 20, mineralsInRange[mineral].pos.y - canvasOffSet.y + 25);
				}
			}
		}
	};

	const drawPlayers = (ctx: any) => {
		if (gameData.players) {
			for (let player in gameData.players) {
				if (!gameData.players[player].isDead) {
					const currentPlayer = gameData.players[player];
					ctx.fillStyle = '#000';
					ctx.fillRect(currentPlayer.pos.x - canvasOffSet.x, currentPlayer.pos.y - canvasOffSet.y, currentPlayer.size.width, currentPlayer.size.height);
					ctx.fillStyle = '#fff';
					ctx.fillRect(currentPlayer.pos.x - canvasOffSet.x + 3, currentPlayer.pos.y - canvasOffSet.y + 3, currentPlayer.size.width - 6, currentPlayer.size.height - 6);
				}
			}
		}
	};

	const drawSelf = (ctx: any) => {
		if (gameData.selfPlayer) {
			const currentPlayer = gameData.selfPlayer;
			ctx.fillStyle = '#000';
			ctx.fillRect(currentPlayer.pos.x - canvasOffSet.x, currentPlayer.pos.y - canvasOffSet.y, currentPlayer.size.width, currentPlayer.size.height);
			ctx.fillStyle = '#fff';
			ctx.fillRect(currentPlayer.pos.x - canvasOffSet.x + 3, currentPlayer.pos.y - canvasOffSet.y + 3, currentPlayer.size.width - 6, currentPlayer.size.height - 6);
		}
	};

	const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}`;

	useEffect(() => {
		const socket = io(BACKEND_URL);

		let minerals = Array<MineralData>();
		let constantData = {} as ConstantData;
		let myId = '';

		socket.on('connect', () => {
			socket.emit(
				'join',
				{
					canvasSize: {
						width: canvasRef.current.clientWidth,
						height: canvasRef.current.clientHeight,
					},
				},
				(data: StartData) => {
					setConstantData({ size: data.size, groundStart: data.groundStart, buildings: data.buildings });
					setGameData({ players: data.players, selfPlayer: data.selfPlayer });
					newMinerals(data.minerals);
					minerals = data.minerals;
					constantData = { size: data.size, groundStart: data.groundStart, buildings: data.buildings };
				}
			);
			myId = socket.id;
			setMyId(socket.id);
			setSocket(socket);
		});

		const newOffSet = { ...canvasOffSet };

		socket.on('update', (data: UpdateGameData) => {
			if (minerals.length > 0) {
				const oldMinerals = [...minerals];

				for (let i = 0; i < data.changedMinerals.length; i++) {
					const change = data.changedMinerals[i];
					oldMinerals[change.index].type = change.toType;
				}
				newMinerals(oldMinerals);
			}
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
				if (code === 'KeyW' || code === 'ArrowUp') {
					socket.emit('move', 'up');
				}
				if (code === 'KeyS' || code === 'ArrowDown') {
					socket.emit('move', 'down');
				}
				if (code === 'KeyA' || code === 'ArrowLeft') {
					socket.emit('move', 'left');
				}
				if (code === 'KeyD' || code === 'ArrowRight') {
					socket.emit('move', 'right');
				}
			}
		});

		document.addEventListener('keyup', ({ code }) => {
			if (code === 'KeyW' || code === 'ArrowUp') {
				socket.emit('stop', 'up');
			} else if (code === 'KeyS' || code === 'ArrowDown') {
				socket.emit('stop', 'down');
			} else if (code === 'KeyA' || code === 'ArrowLeft') {
				socket.emit('stop', 'left');
			} else if (code === 'KeyD' || code === 'ArrowRight') {
				socket.emit('stop', 'right');
			}
		});

		return () => {
			socket.disconnect();
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fuelRatio = gameData.players !== undefined && myId !== '' ? (gameData.selfPlayer.fuel.current / gameData.selfPlayer.fuel.max) * 100 : 0;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
			<div>
				{gameData.players !== undefined && gameData.selfPlayer.isDead && <h3>You died!</h3>}
				{gameData.players && (
					<div style={{ display: 'flex', justifyContent: 'space-around' }}>
						<h3 style={{ display: 'flex' }}>
							Fuel:
							<div style={{ width: '12vw', minWidth: '40px', height: '3vh', minHeight: '18px', backgroundColor: 'grey', margin: '4px', position: 'relative' }}>
								<h4 style={{ position: 'absolute', zIndex: 1, top: '0', left: '20%', margin: 0, padding: 0 }}>
									{gameData.selfPlayer.fuel.current.toFixed(2)} / {gameData.selfPlayer.fuel.max} L
								</h4>
								<div style={{ width: fuelRatio + '%', height: '100%', backgroundColor: fuelRatio < 15 ? 'red' : fuelRatio < 30 ? 'orange' : 'green' }}></div>
							</div>
						</h3>
						<h3>Money: {gameData.selfPlayer.money.toFixed(2)}</h3>
					</div>
				)}
			</div>
			<Canvas draw={draw} canvasRef={canvasRef} />
			{gameData.players !== undefined && gameData.selfPlayer.onBuilding !== '' && gameData.selfPlayer.onBuilding !== 'graveyard' && (
				<BuildingContainer
					socket={socket}
					building={gameData.selfPlayer.onBuilding}
					bgColor={gameData.selfPlayer.onBuilding !== '' ? buildingStyle[gameData.selfPlayer.onBuilding].innerColor : '#00ff00'}
				/>
			)}
		</div>
	);
}

export default MainPage;
