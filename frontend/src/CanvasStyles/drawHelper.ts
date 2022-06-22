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

		const type = mineralsInRange[mineral].type;
		const style = mineralsInRange[mineral].style;
		let imgsrc =
			type === 'Mud' && mineralsInRange[mineral].id < constantData.size.width / 50
				? 'mudtop'
				: type === 'Mud'
				? 'mudbasic'
				: type === 'Concrete'
				? 'concrete'
				: type === 'Coal'
				? 'coalbasic'
				: type === 'Iron'
				? 'ironbasic'
				: type === 'Gold'
				? 'goldbasic'
				: type === 'Diamond'
				? 'diamondbasic'
				: type === 'Emerald'
				? 'emeraldbasic'
				: type === 'Ruby'
				? 'rubybasic'
				: type === 'Sapphire'
				? 'sapphirebasic'
				: type === 'Topaz'
				? 'topazbasic'
				: type === 'Amethyst'
				? 'amethystbasic'
				: type === 'Quartz'
				? 'quartzbasic'
				: type === 'Amber'
				? 'amberbasic'
				: type === 'Jade'
				? 'jadebasic'
				: type === 'Pearl'
				? 'pearlbasic'
				: type === 'Opal'
				? 'opalbasic'
				: 'empty';

		if (imgsrc !== 'empty' && imgsrc !== 'mudtop' && imgsrc !== 'concrete') {
			imgsrc += style;
		}
		if (images[imgsrc]) {
			ctx.drawImage(images[imgsrc], pos.startx, pos.starty, pos.width, pos.height);
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

export const drawPlayers = (ctx: any, gameData: DynamicData, canvasOffSet: { x: number; y: number }, myId: string, playerImages: { [key: string]: any }) => {
	if (gameData.players) {
		for (let player in gameData.players) {
			if (!gameData.players[player].isDead) {
				const currentPlayer = gameData.players[player];
				if (currentPlayer.id === myId) {
					continue;
				}
				drawHead(ctx, currentPlayer.pos, canvasOffSet, playerImages.head, currentPlayer.imageIndex.head, currentPlayer.size);
				drawBody(ctx, currentPlayer.pos, canvasOffSet, playerImages.body, currentPlayer.imageIndex.body, currentPlayer.size);
				drawBottom(ctx, currentPlayer.pos, canvasOffSet, playerImages.bottom, currentPlayer.imageIndex.bottom, currentPlayer.size);
				drawWheels(ctx, currentPlayer.pos, canvasOffSet, playerImages.wheels, currentPlayer.imageIndex.wheels, currentPlayer.size);

				ctx.font = '10px Arial';
				ctx.fillText(currentPlayer.name, currentPlayer.pos.x - canvasOffSet.x, currentPlayer.pos.y - canvasOffSet.y - 5);
			}
		}
	}
};

export const drawSelf = (ctx: any, gameData: DynamicData, myId: string, canvasOffSet: { x: number; y: number }, playerImages: { [key: string]: any }) => {
	if (gameData.players[myId]) {
		const currentPlayer = gameData.players[myId];
		if (!currentPlayer.isDead) {
			// ctx.fillStyle = '#000';
			// ctx.fillRect(currentPlayer.pos.x - canvasOffSet.x, currentPlayer.pos.y - canvasOffSet.y, currentPlayer.size.width, currentPlayer.size.height);
			drawHead(ctx, currentPlayer.pos, canvasOffSet, playerImages.head, currentPlayer.imageIndex.head, currentPlayer.size);
			drawBody(ctx, currentPlayer.pos, canvasOffSet, playerImages.body, currentPlayer.imageIndex.body, currentPlayer.size);
			drawBottom(ctx, currentPlayer.pos, canvasOffSet, playerImages.bottom, currentPlayer.imageIndex.bottom, currentPlayer.size);
			drawWheels(ctx, currentPlayer.pos, canvasOffSet, playerImages.wheels, currentPlayer.imageIndex.wheels, currentPlayer.size);
			ctx.font = '10px Arial';
			ctx.fillText(currentPlayer.name, currentPlayer.pos.x - canvasOffSet.x, currentPlayer.pos.y - canvasOffSet.y - 5);
		}
	}
};

const drawHead = (ctx: any, pos: { x: number; y: number }, canvasOffSet: { x: number; y: number }, images: { [key: string]: any }, index: string, size: { width: number; height: number }) => {
	ctx.drawImage(images[index], pos.x - canvasOffSet.x, pos.y - canvasOffSet.y, size.width, size.height / 2);
};

const drawBody = (ctx: any, pos: { x: number; y: number }, canvasOffSet: { x: number; y: number }, images: { [key: string]: any }, index: string, size: { width: number; height: number }) => {
	ctx.drawImage(images[index], pos.x - canvasOffSet.x, pos.y + size.height * 0.33 - canvasOffSet.y, size.width, size.height / 3);
};

const drawBottom = (ctx: any, pos: { x: number; y: number }, canvasOffSet: { x: number; y: number }, images: { [key: string]: any }, index: string, size: { width: number; height: number }) => {
	ctx.drawImage(images[index], pos.x - canvasOffSet.x, pos.y + size.height * 0.6 - canvasOffSet.y, size.width, size.height / 4);
};

const drawWheels = (ctx: any, pos: { x: number; y: number }, canvasOffSet: { x: number; y: number }, images: { [key: string]: any }, index: string, size: { width: number; height: number }) => {
	ctx.drawImage(images[index], pos.x - canvasOffSet.x, pos.y + size.height * 0.75 - canvasOffSet.y, size.width, size.height / 4);
};
