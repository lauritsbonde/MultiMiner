import { useEffect, useState } from 'react';
import Canvas from './Components/Canvas';
import { io } from 'socket.io-client';
import { mineralStyle } from './mineralStyle';
import { buildingStyle } from './BuildingStyle';
import UpdateGameData from './Types/GameTypes';
import kdTree from './kdTree';

function App() {
	const [myId, setMyId] = useState<string>('');
	const [gameData, setGameData] = useState<UpdateGameData>({} as UpdateGameData);
	const [canvasOffSet, setCanvasOffSet] = useState({ x: 0, y: 0 });

	const draw = (ctx: any) => {
		drawBuildings(ctx);
		drawMinerals(ctx);
		drawPlayers(ctx);
	};

	const drawBuildings = (ctx: any) => {
		if (gameData.size) {
			ctx.clearRect(0, 0, gameData.size.width, gameData.size.height);
		}
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
				}
				// else {
				// 	ctx.fillStyle = '#fff';
				// 	ctx.font = '10px Arial';
				// 	ctx.fillText(elementsToDraw[mineral].id, elementsToDraw[mineral].pos.x - canvasOffSet.x + 20, elementsToDraw[mineral].pos.y - canvasOffSet.y + 25);
				// }
			}
		}
	};

	const drawPlayers = (ctx: any) => {
		if (gameData.players) {
			for (let player in gameData.players) {
				const currentPlayer = gameData.players[player];
				ctx.fillStyle = '#000';
				ctx.fillRect(currentPlayer.pos.x - canvasOffSet.x, currentPlayer.pos.y - canvasOffSet.y, currentPlayer.size.width, currentPlayer.size.height);
			}
		}
	};

	useEffect(() => {
		const socket = io('http://localhost:3333');

		socket.on('connect', () => {
			setMyId(socket.id);
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
	}, []);

	return (
		<div>
			<h1>MultiMiner</h1>
			<Canvas draw={draw} />
		</div>
	);
}

export default App;
