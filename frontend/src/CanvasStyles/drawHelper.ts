import kdTree from '../kdTree';
import { ConstantData, DynamicData } from '../Types/GameTypes';
import { mineralStyle } from './mineralStyle';
import { buildingStyle } from './BuildingStyle';

export const drawUpperBackground = (ctx: any, constantData: ConstantData, canvasOffSet: { x: number; y: number }) => {
	ctx.fillStyle = '#87CEEB';
	ctx.fillRect(0, 0, ctx.canvas.clientWidth, constantData.groundStart === undefined ? ctx.canvas.clientHeight : constantData.groundStart);
	ctx.fillStyle = '#FFFF00';
	ctx.beginPath();
	ctx.arc(40 - canvasOffSet.x, 40 - canvasOffSet.y, 150, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
};

export const drawBuildings = (ctx: any, constantData: ConstantData, canvasOffSet: { x: number; y: number }) => {
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

export const drawMinerals = (ctx: any, constantData: ConstantData, canvasOffSet: { x: number; y: number }, mineralsKdTree: kdTree, images: { [key: string]: any }, allImagesLoaded: boolean) => {
	const padding = Math.max(ctx.canvas.clientWidth, ctx.canvas.clientHeight) / 10;
	const boundingBox = {
		minx: 0 + canvasOffSet.x - padding,
		miny: 0 + canvasOffSet.y - padding,
		maxx: ctx.canvas.clientWidth + canvasOffSet.x + padding,
		maxy: ctx.canvas.clientHeight + canvasOffSet.y + padding,
	};
	const mineralsInRange = mineralsKdTree.rangeSearch(boundingBox);

	for (let mineral in mineralsInRange) {
		const pos = {
			startx: mineralsInRange[mineral].pos.x - canvasOffSet.x,
			starty: mineralsInRange[mineral].pos.y - canvasOffSet.y,
			width: mineralsInRange[mineral].size.width,
			height: mineralsInRange[mineral].size.height,
		};

		if (allImagesLoaded) {
			const type = mineralsInRange[mineral].type;
			const style = mineralsInRange[mineral].style;
			let imgsrc =
				type === 'Mud' && mineralsInRange[mineral].id <= constantData.size.width / 50
					? 'mud_top'
					: type === 'Mud'
					? 'mud_basic'
					: type === 'Concrete'
					? 'concrete'
					: type === 'Coal'
					? 'coal_basic'
					: type === 'Iron'
					? 'iron_basic'
					: type === 'Gold'
					? 'gold_basic'
					: type === 'Diamond'
					? 'diamond_basic'
					: type === 'Emerald'
					? 'emerald_basic'
					: type === 'Ruby'
					? 'ruby_basic'
					: type === 'Sapphire'
					? 'sapphire_basic'
					: type === 'Topaz'
					? 'topaz_basic'
					: type === 'Amethyst'
					? 'amethyst_basic'
					: type === 'Quartz'
					? 'quartz_basic'
					: type === 'Amber'
					? 'amber_basic'
					: type === 'Jade'
					? 'jade_basic'
					: type === 'Pearl'
					? 'pearl_basic'
					: type === 'Opal'
					? 'opal_basic'
					: 'empty';

			if (imgsrc !== 'empty' && imgsrc !== 'mud_top' && imgsrc !== 'concrete') {
				imgsrc += style;
			}
			if (images[imgsrc]) {
				ctx.drawImage(images[imgsrc], pos.startx, pos.starty, pos.width, pos.height);
			}
		} else {
			const styling = mineralStyle[mineralsInRange[mineral].type];
			ctx.fillStyle = styling.outerColor;
			ctx.fillRect(pos.startx, pos.starty, pos.width, pos.height);
			const border = 2;
			ctx.fillStyle = styling.innerColor;
			ctx.fillRect(pos.startx + border, pos.starty + border, pos.width - border * 2, pos.height - border * 2);
		}

		// if (mineralsInRange[mineral].type === 'Concrete' && mineralsInRange[mineral].pos.y !== constantData.groundStart) {
		// 	ctx.fillStyle = '#fff';
		// 	ctx.font = '10px Arial';
		// 	ctx.fillText('BOTTOM', mineralsInRange[mineral].pos.x - canvasOffSet.x + 2, mineralsInRange[mineral].pos.y - canvasOffSet.y + 25);
		// } else {
		// 	ctx.fillStyle = '#fff';
		// 	ctx.font = '10px Arial';
		// 	ctx.fillText(mineralsInRange[mineral].type, mineralsInRange[mineral].pos.x - canvasOffSet.x + 20, mineralsInRange[mineral].pos.y - canvasOffSet.y + 25);
		// }
	}
};

export const drawPlayers = (ctx: any, gameData: DynamicData, canvasOffSet: { x: number; y: number }) => {
	if (gameData.players) {
		for (let player in gameData.players) {
			if (!gameData.players[player].isDead) {
				const currentPlayer = gameData.players[player];
				ctx.fillStyle = '#000';
				ctx.fillRect(currentPlayer.pos.x - canvasOffSet.x, currentPlayer.pos.y - canvasOffSet.y, currentPlayer.size.width, currentPlayer.size.height);
				ctx.fillStyle = '#fff';
				ctx.fillRect(currentPlayer.pos.x - canvasOffSet.x + 3, currentPlayer.pos.y - canvasOffSet.y + 3, currentPlayer.size.width - 6, currentPlayer.size.height - 6);
				ctx.fillStyle = '#fff';
				ctx.font = '10px Arial';
				ctx.fillText(currentPlayer.name, currentPlayer.pos.x - canvasOffSet.x, currentPlayer.pos.y - canvasOffSet.y - 5);
			}
		}
	}
};

export const drawSelf = (ctx: any, gameData: DynamicData, myId: string, canvasOffSet: { x: number; y: number }) => {
	if (gameData.players[myId]) {
		const currentPlayer = gameData.players[myId];
		ctx.fillStyle = '#000';
		ctx.fillRect(currentPlayer.pos.x - canvasOffSet.x, currentPlayer.pos.y - canvasOffSet.y, currentPlayer.size.width, currentPlayer.size.height);
		ctx.fillStyle = '#fff';
		ctx.fillRect(currentPlayer.pos.x - canvasOffSet.x + 3, currentPlayer.pos.y - canvasOffSet.y + 3, currentPlayer.size.width - 6, currentPlayer.size.height - 6);
	}
};
