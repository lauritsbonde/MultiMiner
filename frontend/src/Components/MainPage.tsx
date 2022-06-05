import { useEffect, useState, FC } from 'react';
import Canvas from './Canvas';
import { Socket } from 'socket.io-client';
import { buildingStyle } from '../CanvasStyles/BuildingStyle';
import BuildingContainer from '../Components/BuildingMenus/BuildingContainer';
import useCanvas from '../Hooks/useCanvas';
import { MineralData, ConstantData, DynamicData, UpdateGameData } from '../Types/GameTypes';
import kdTree from '../kdTree';
import { allsources } from '../CanvasStyles/Sprites';
import { drawUpperBackground, drawBuildings, drawMinerals, drawPlayers, drawSelf } from '../CanvasStyles/drawHelper';

interface Props {
	socket: Socket;
	myId: string;
	constantData: ConstantData;
	startGameData: DynamicData;
	startMinerals: MineralData[];
}

const MainPage: FC<Props> = ({ socket, myId, constantData, startGameData, startMinerals }) => {
	const [mineralsKdTree, setMineralsKdTree] = useState<kdTree>(new kdTree([...startMinerals]));
	const [gameData, setGameData] = useState<DynamicData>(startGameData);
	const [canvasOffSet, setCanvasOffSet] = useState({ x: 0, y: 0 });
	const [images, setImages] = useState({} as { [key: string]: any });
	const [allImagesLoaded, setAllImagesLoaded] = useState(false);
	// const [skies, setSkies] = useState();

	const cacheImages = async (sources: { [key: string]: string }) => {
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
		Promise.all(promises)
			.then(() => {
				setImages(loadedImages);
				setAllImagesLoaded(true);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		cacheImages(allsources);
	}, []);

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
		drawMinerals(ctx, constantData, canvasOffSet, mineralsKdTree, images, allImagesLoaded);
		drawPlayers(ctx, gameData, canvasOffSet);
		drawSelf(ctx, gameData, myId, canvasOffSet);
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

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fuelRatio = gameData.players !== undefined && myId !== '' ? (gameData.players[myId].fuel.current / gameData.players[myId].fuel.max) * 100 : 0;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
			</div>
			<Canvas draw={draw} canvasRef={canvasRef} />
			{gameData.players !== undefined && gameData.players[myId].onBuilding !== '' && gameData.players[myId].onBuilding !== 'graveyard' && (
				<BuildingContainer
					socket={socket}
					building={gameData.players[myId].onBuilding}
					bgColor={gameData.players[myId].onBuilding !== '' ? buildingStyle[gameData.players[myId].onBuilding].innerColor : '#00ff00'}
				/>
			)}
		</div>
	);
};

export default MainPage;
