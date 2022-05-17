import { useEffect, useState } from 'react';
import Canvas from './Canvas';
import { io, Socket } from 'socket.io-client';
import { mineralStyle } from '../CanvasStyles/mineralStyle';
import { buildingStyle } from '../CanvasStyles/BuildingStyle';
import UpdateGameData from '../Types/GameTypes';
import kdTree from '../kdTree';
import BuildingContainer from '../Components/BuildingMenus/BuildingContainer';

function MainPage() {
	const [myId, setMyId] = useState<string>('');
	const [gameData, setGameData] = useState<UpdateGameData>({} as UpdateGameData);
	const [canvasOffSet, setCanvasOffSet] = useState({ x: 0, y: 0 });
	// const [skies, setSkies] = useState();
	const [socket, setSocket] = useState({} as Socket);

	const draw = (ctx: any) => {
		ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
		drawUpperBackground(ctx);
		drawBuildings(ctx);
		drawMinerals(ctx);
		drawPlayers(ctx);
	};

	const drawUpperBackground = (ctx: any) => {
		ctx.fillStyle = '#87CEEB';
		if (gameData.groundStart === undefined) {
			ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
		} else {
			ctx.fillRect(0, 0, ctx.canvas.clientWidth, gameData.groundStart);
		}
		ctx.fillStyle = '#FFFF00';
		ctx.beginPath();
		ctx.arc(40 - canvasOffSet.x, 40 - canvasOffSet.y, 150, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	};

	const drawBuildings = (ctx: any) => {
		if (gameData.buildings) {
			gameData.buildings.forEach((building: any) => {
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
		if (gameData.minerals) {
			const kdtree = new kdTree(gameData.minerals);
			const padding = 100; // to secure searchbox is larger than canvas
			const range = {
				minx: 0 + canvasOffSet.x - padding,
				maxx: window.innerWidth + canvasOffSet.x + padding,
				miny: 0 + canvasOffSet.y - padding,
				maxy: window.innerHeight + canvasOffSet.y + padding,
			};
			const elementsToDraw = kdtree.rangeSearch(range); //todo: use player pos
			for (let mineral in elementsToDraw) {
				const styling = mineralStyle[elementsToDraw[mineral].type];
				ctx.fillStyle = styling.outerColor;
				ctx.fillRect(elementsToDraw[mineral].pos.x - canvasOffSet.x, elementsToDraw[mineral].pos.y - canvasOffSet.y, elementsToDraw[mineral].size.width, elementsToDraw[mineral].size.height);
				const border = 2;
				ctx.fillStyle = styling.innerColor;
				ctx.fillRect(
					elementsToDraw[mineral].pos.x - canvasOffSet.x + border,
					elementsToDraw[mineral].pos.y - canvasOffSet.y + border,
					elementsToDraw[mineral].size.width - border * 2,
					elementsToDraw[mineral].size.height - border * 2
				);

				if (elementsToDraw[mineral].type === 'Concrete' && elementsToDraw[mineral].pos.y !== gameData.groundStart) {
					ctx.fillStyle = '#fff';
					ctx.font = '10px Arial';
					ctx.fillText('BOTTOM', elementsToDraw[mineral].pos.x - canvasOffSet.x + 2, elementsToDraw[mineral].pos.y - canvasOffSet.y + 25);
				} else {
					ctx.fillStyle = '#fff';
					ctx.font = '10px Arial';
					ctx.fillText(elementsToDraw[mineral].type, elementsToDraw[mineral].pos.x - canvasOffSet.x + 20, elementsToDraw[mineral].pos.y - canvasOffSet.y + 25);
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

	useEffect(() => {
		const socket = io(process.env.BACKEND_URL as string);

		socket.on('connect', () => {
			setMyId(socket.id);
			setSocket(socket);
		});

		const newOffSet = { ...canvasOffSet };

		socket.on('update', (data: UpdateGameData) => {
			setGameData(data);
			calculateCanvasOffSet(data);
		});

		const calculateCanvasOffSet = (data: UpdateGameData) => {
			if (data.players[socket.id].pos.x > (window.innerWidth * 0.95) / 2 && data.players[socket.id].pos.x < data.size.width - (window.innerWidth * 0.95) / 2) {
				newOffSet.x = data.players[socket.id].pos.x - (window.innerWidth * 0.95) / 2;
			}

			if (data.players[socket.id].pos.y > (window.innerHeight * 0.85) / 2 && data.players[socket.id].pos.y < data.size.height - (window.innerHeight * 0.85) / 2) {
				newOffSet.y = data.players[socket.id].pos.y - (window.innerHeight * 0.85) / 2;
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

	const fuelRatio = gameData.players !== undefined && myId !== '' ? (gameData.players[myId].fuel.current / gameData.players[myId].fuel.max) * 100 : 0;

	return (
		<div>
			{gameData.players !== undefined && gameData.players[myId].isDead && <h3>You died!</h3>}
			{gameData.players && (
				<div style={{ display: 'flex', justifyContent: 'space-around' }}>
					<h3 style={{ display: 'flex' }}>
						Fuel:
						<div style={{ width: '12vw', minWidth: '40px', height: '3vh', minHeight: '18px', backgroundColor: 'grey', margin: '4px', position: 'relative' }}>
							<h4 style={{ position: 'absolute', zIndex: 1, top: '0', left: '20%', margin: 0, padding: 0 }}>
								{gameData.players[myId].fuel.current.toFixed(2)} / {gameData.players[myId].fuel.max} L
							</h4>
							<div style={{ width: fuelRatio + '%', height: '100%', backgroundColor: fuelRatio < 15 ? 'red' : fuelRatio < 30 ? 'orange' : 'green' }}></div>
						</div>
					</h3>
					<h3>Money: {gameData.players[myId].money.toFixed(2)}</h3>
				</div>
			)}
			<Canvas draw={draw} />
			{gameData.players !== undefined && gameData.players[myId].onBuilding !== '' && gameData.players[myId].onBuilding !== 'graveyard' && (
				<BuildingContainer
					socket={socket}
					building={gameData.players[myId].onBuilding}
					bgColor={gameData.players[myId].onBuilding !== '' ? buildingStyle[gameData.players[myId].onBuilding].innerColor : '#00ff00'}
				/>
			)}
		</div>
	);
}

export default MainPage;
