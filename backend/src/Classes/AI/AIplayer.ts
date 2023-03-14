import Player, { surroundingMinerals } from '../Player';
import Bulding from '../Building';
import Brain from './Brain';
import { savedWeights } from './Brain';
import ShopManager from '../ShopManager';
import Mineral from '../Mineral';
import { mineralFriction } from '../../Lookups/minerals';

export default class AIplayer extends Player {
	brain: Brain;
	spawnTime: Date;
	shopManager: ShopManager;

	constructor(
		socketId: string,
		pos: { x: number; y: number },
		worldSize: { width: number; height: number },
		worldGroundLevel: number,
		worldBuildings: Array<Bulding>,
		name: string,
		shopManager: ShopManager,
		getSurroundingMinerals: (
			pos: { x: number; y: number },
			size: { width: number; height: number }
		) => { topMineral: Mineral; bottomMineral: Mineral; leftMineral: Mineral; rightMineral: Mineral },
		aiWeights?: savedWeights
	) {
		super(socketId, pos, worldSize, worldGroundLevel, worldBuildings, name, getSurroundingMinerals);
		this.brain = new Brain(3, { nodes: 10, layers: 3 }, 3, aiWeights);
		this.spawnTime = new Date();
		this.shopManager = shopManager;
	}

	//OVERRIDE
	drill(mineral?: Mineral, startDirection?: string, addDrillMineralToChanged?: (mineral: Mineral) => void) {
		if (!this.isDrilling && mineral !== undefined && startDirection !== undefined) {
			this.isDrilling = true;
			this.drillingMineral = mineral;
			this.finalDrillPosition = this.calculateFinalDrillPosition(mineral, startDirection);
			this.drillingStartDirection = startDirection;
			this.speed = { x: 0, y: 0 };
		}

		// create a vector from player to final drill position
		if (this.finalDrillPosition.x !== undefined && this.finalDrillPosition.y !== undefined && this.drillingMineral !== undefined) {
			//move player center towards final drill position
			this.moveTowardsVector(this.finalDrillPosition);

			//check that max speed is not exceeded
			const mineralMaxSpeed = this.maxSpeed * mineralFriction[this.drillingMineral.type];
			this.limitMaxSpeed(mineralMaxSpeed);

			//check if player is close enough to final drill position
			let done = this.doneDrilling();

			if (done) {
				this.isDrilling = false;

				this.addMineralToBasket(this.drillingMineral);

				if (addDrillMineralToChanged !== undefined) {
					addDrillMineralToChanged(this.drillingMineral);
				}

				if (this.basket.amount < this.basket.maxItems) {
					this.points += this.drillingMineral.destroy();
				} else {
					this.points -= this.drillingMineral.destroy() * 50;
				}

				this.drillingMineral = undefined;

				this.finalDrillPosition = { x: undefined, y: undefined };
				this.drillingStartDirection = '';
				this.speed = { x: 0, y: 0 };
			} else if (this.drillingMineral.type === 'Empty') {
				this.isDrilling = false;
				this.drillingMineral = undefined;
				this.finalDrillPosition = { x: undefined, y: undefined };
				this.drillingStartDirection = '';
				this.speed = { x: 0, y: 0 };
			}

			//move the player
			this.pos.x += this.speed.x;
			this.pos.y += this.speed.y;
		}
	}

	makeDecission() {
		let input = [this.pos.x, this.pos.y, this.basket.amount / this.basket.maxItems];

		let decission = this.brain.guess(input);

		this.useDecission(decission);
	}

	useDecission(decission: Array<number>) {
		this.moveX(decission[0]);
		this.moveY(decission[1]);
		this.handleBasketOutput(decission[2]);
	}

	moveX(direction: number) {
		if (direction < 0.33) {
			this.moving.left = false;
			this.moving.right = false;
		} else if (direction < 0.66) {
			this.moving.left = true;
			this.moving.right = false;
		} else {
			this.moving.left = false;
			this.moving.right = true;
		}
	}

	moveY(direction: number) {
		if (direction < 0.33) {
			this.moving.up = false;
			this.moving.down = false;
		} else if (direction < 0.66) {
			this.moving.up = true;
			this.moving.down = false;
		} else {
			this.moving.up = false;
			this.moving.down = true;
		}
	}

	handleBasketOutput(output: number) {
		if (output < 0.2) {
			//TODO: make the AI move to mineralbuilding
			//Find path
			const mineralBuilding = this.shopManager.buildings.find((building) => building.title === 'Mineral Shop');
			//const path = this.calculatePath({ ...mineralBuilding.pos, width: this.shopManager.buildingSize.width, height: this.shopManager.buildingSize.height }, this.pos);
			// move player along path

			//Sells all minerals
			const oldMoney = this.money;
			const pointRatio = this.basket.amount - 2;

			this.shopManager.sellMineral(this, 'all', 0);
			const newMoney = this.money;
			const pointsToAdd = newMoney - oldMoney;

			const res = (pointsToAdd === 0 ? 50 : pointsToAdd) * pointRatio;

			this.points += res;
		}
	}

	calculatePath(boundingBox: { x: number; y: number; width: number; height: number }, pos: { x: number; y: number }) {
		let path = [];
		let frontier = [{ x: pos.x, y: pos.y }];
		let visited = [{ x: pos.x, y: pos.y }];

		console.log('Calculating path');

		let test = 0;
		while (!this.posInBB(pos, boundingBox) && frontier.length > 0) {
			const surrounding = this.getSurroundingMinerals({ x: frontier[0].x, y: frontier[0].y }, this.size);

			if (surrounding.topMineral.type === 'Empty') {
				path.push({ x: surrounding.topMineral.pos.x, y: surrounding.topMineral.pos.y });
			}
			if (surrounding.rightMineral.type === 'Empty') {
				path.push({ x: surrounding.rightMineral.pos.x, y: surrounding.rightMineral.pos.y });
			}
			if (surrounding.bottomMineral.type === 'Empty') {
				path.push({ x: surrounding.bottomMineral.pos.x, y: surrounding.bottomMineral.pos.y });
			}
			if (surrounding.leftMineral.type === 'Empty') {
				path.push({ x: surrounding.leftMineral.pos.x, y: surrounding.leftMineral.pos.y });
			}

			//TODO: remove
			if (test > 1000) break;
			test++;
		}
	}

	posInBB(pos: { x: number; y: number }, boundingBox: { x: number; y: number; width: number; height: number }) {
		return pos.x > boundingBox.x && pos.x < boundingBox.x + boundingBox.width && pos.y > boundingBox.y && pos.y < boundingBox.y + boundingBox.height;
	}
}
