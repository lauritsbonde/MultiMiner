import PlayerDto from './PlayerDto';
import Mineral from './Mineral';
import Bulding from './Building';
import PosClass from './PosClass';
import { mineralFriction } from '../Lookups/minerals';

export interface surroundingMinerals {
	topMineral: Mineral;
	bottomMineral: Mineral;
	leftMineral: Mineral;
	rightMineral: Mineral;
}

export default class Player extends PosClass {
	auth0id: string;

	name: string;
	canvasSize: { width: number; height: number };
	imageSpriteIndex: { head: string; body: string; bottom: string; wheels: string };

	moving: { up: boolean; down: boolean; left: boolean; right: boolean };
	speed: { x: number; y: number };
	acceleration: number;
	maxSpeed: number;
	grounded: boolean;
	brakes: number; // lower is faster
	gravityAffect: boolean;

	fuel: { current: number; max: number; consumption: number };
	money: number;
	isDead: boolean;

	isDrilling: boolean;
	drillingMineral?: Mineral;
	finalDrillPosition: { x?: number; y?: number };
	drillingStartDirection: string;

	worldSize: { width: number; height: number };
	worldGroundLevel: number;
	worldBuildings: Array<Bulding>;
	onBuilding: string;

	basket: { maxItems: number; items: { [type: string]: number }; amount: number };

	points: number;

	getSurroundingMinerals: (pos: { x: number; y: number }, size: { width: number; height: number }) => { topMineral: Mineral; bottomMineral: Mineral; leftMineral: Mineral; rightMineral: Mineral };

	constructor(
		auth0id: string,
		pos: { x: number; y: number },
		worldSize: { width: number; height: number },
		worldGroundLevel: number,
		worldBuildings: Array<Bulding>,
		name: string,
		getSurroundingMinerals: (
			pos: { x: number; y: number },
			size: { width: number; height: number }
		) => { topMineral: Mineral; bottomMineral: Mineral; leftMineral: Mineral; rightMineral: Mineral },
		imageIndex?: { head: string; body: string; bottom: string; wheels: string },
		points?: number
	) {
		super({ width: 32, height: 32 }, pos);
		this.auth0id = auth0id;

		this.name = name;
		this.imageSpriteIndex = imageIndex || {
			head: '0',
			body: '0',
			bottom: '0',
			wheels: '0',
		};

		this.canvasSize = { width: 1000, height: 1000 };

		this.worldSize = worldSize;
		this.worldGroundLevel = worldGroundLevel;
		this.worldBuildings = worldBuildings;
		this.onBuilding = '';

		this.moving = { up: false, down: false, left: false, right: false };
		this.speed = { x: 0, y: 0 };
		this.acceleration = 1;
		this.maxSpeed = 15;
		this.grounded = false;
		this.brakes = 0.95;
		this.grounded = false;
		this.gravityAffect = true;

		this.fuel = { current: 10, max: 10, consumption: 0.001 };
		this.money = 50;
		this.isDead = false;

		this.isDrilling = false;
		this.drillingMineral = undefined;
		this.finalDrillPosition = { x: undefined, y: undefined };
		this.drillingStartDirection = '';

		this.basket = { maxItems: 10, items: {}, amount: 0 };

		this.points = points || 0;

		console.log(points);

		this.getSurroundingMinerals = getSurroundingMinerals;
	}

	toDto() {
		return new PlayerDto(
			this.auth0id,
			this.name,
			this.imageSpriteIndex,
			this.pos,
			this.size,
			this.onBuilding,
			{ current: this.fuel.current, max: this.fuel.max },
			this.money,
			this.isDead,
			{
				items: this.basket.items,
				amount: this.basket.amount,
				maxItems: this.basket.maxItems,
			},
			this.points
		);
	}

	setCanvasSize(canvasSize: { width: number; height: number }) {
		this.canvasSize = canvasSize;
	}

	move(addDrillMineralToChanged: (mineral: Mineral) => void) {
		this.useFuel();
		if (this.isDrilling) {
			this.drill(undefined, undefined, addDrillMineralToChanged);
			return;
		}

		let movingy = false;
		let movingx = false;

		if (this.moving.up) {
			this.speed.y += -this.acceleration;
			movingy = true;
		}
		if (this.moving.down) {
			this.speed.y += this.acceleration;
			movingy = true;
		}
		if (this.moving.left) {
			this.speed.x += -this.acceleration;
			movingx = true;
		}
		if (this.moving.right) {
			this.speed.x += this.acceleration;
			movingx = true;
		}

		//check that max speed is not exceeded
		this.limitMaxSpeed(this.maxSpeed);

		//check that player stays within the world
		this.stayWithinWorld();

		//stop player if not moving
		this.stopIfNotMovin(movingy, movingx);

		const surroundingMinerals = this.getSurroundingMinerals(this.pos, this.size);

		// check if gravity should be applied
		this.applyGravity(movingy, surroundingMinerals.bottomMineral);

		//check if player should start drilling
		this.mineralCollissionDetection(surroundingMinerals);

		//check for building collision
		if (this.pos.y < this.worldGroundLevel) {
			if (this.onBuilding !== 'graveyard') {
				this.onBuilding = this.checkForBuildingCollision();
			}
		}

		if (this.speed.y < 0) {
			this.grounded = false;
			this.gravityAffect = false;
			if (!this.moving.up) {
				this.gravityAffect = true;
			}
		}

		this.pos.x += this.speed.x;
		this.pos.y += this.speed.y;
	}

	useFuel() {
		if (this.onBuilding === '') {
			this.fuel.current -= this.fuel.consumption;
			if (this.fuel.current < 0) {
				this.isDead = true;
				this.onBuilding = 'graveyard';
			}
		}
	}

	applyGravity(movingy: boolean, bottomMineral: Mineral) {
		if (this.onBuilding === '') {
			if (!movingy || ((this.moving.down || this.gravityAffect) && !this.grounded)) {
				const bottomy = bottomMineral !== undefined ? bottomMineral.pos.y : this.worldSize.height;
				if (this.pos.y + this.size.height + this.speed.y <= bottomy) {
					this.speed.y += 1;
					this.grounded = false;
				} else {
					this.speed.y = 0;
					this.grounded = true;
				}
			}
		}
	}

	//check if player collides with surrounding minerals
	//if so check if they are grounded and if so start drilling
	//if not stop moving in that direction
	mineralCollissionDetection(surroundingMinerals: surroundingMinerals) {
		if (this.speed.y > 0 && this.pos.y + this.size.height + this.speed.y >= surroundingMinerals.bottomMineral.pos.y) {
			if (this.moving.down && this.grounded && surroundingMinerals.bottomMineral.isDrillable) {
				this.drill(surroundingMinerals.bottomMineral, 'down');
			} else if (!surroundingMinerals.bottomMineral.isDrillable) {
				this.speed.y = 0;
				this.grounded = true;
			}
			// the not drilling collision is handled in the applygravity function
		}
		if (this.speed.x > 0 && surroundingMinerals.rightMineral !== undefined && this.pos.x + this.size.width + this.speed.x >= surroundingMinerals.rightMineral.pos.x) {
			if (this.moving.right && this.grounded && surroundingMinerals.rightMineral.isDrillable) {
				this.drill(surroundingMinerals.rightMineral, 'right');
			} else {
				this.speed.x = -this.acceleration / 10;
			}
		}
		if (this.speed.x < 0 && surroundingMinerals.leftMineral !== undefined && this.pos.x + this.speed.x <= surroundingMinerals.leftMineral.pos.x + surroundingMinerals.leftMineral.size.width) {
			if (this.moving.left && this.grounded && surroundingMinerals.leftMineral.isDrillable) {
				this.drill(surroundingMinerals.leftMineral, 'left');
			} else {
				this.speed.x = this.acceleration / 10;
			}
		}
		if (this.speed.y < 0 && surroundingMinerals.topMineral !== undefined && this.pos.y + this.speed.y <= surroundingMinerals.topMineral.pos.y + surroundingMinerals.topMineral.size.height) {
			this.speed.y = +this.acceleration / 10;
		}
	}

	checkForBuildingCollision() {
		for (const building of this.worldBuildings) {
			if (
				this.pos.x + this.size.width > building.pos.x &&
				this.pos.x < building.pos.x + building.size.width &&
				this.pos.y + this.size.height > building.pos.y &&
				this.pos.y < building.pos.y + building.size.height
			) {
				if (this.onBuilding === '') {
					this.speed = { x: 0, y: 0 };
				}
				return building.title;
			}
		}
		return '';
	}

	stayWithinWorld() {
		if (this.pos.x + this.speed.x < 0) {
			this.pos.x = 0;
			this.speed.x = 0;
		}
		if (this.pos.x + this.size.width + this.speed.x > this.worldSize.width) {
			this.pos.x = this.worldSize.width - this.size.width;
			this.speed.x = 0;
		}
		if (this.pos.y + this.speed.y < 0) {
			this.pos.y = 0;
			this.speed.y = 0;
		}
		if (this.pos.y + this.size.height + this.speed.y > this.worldSize.height) {
			this.pos.y = this.worldSize.height - this.size.height;
			this.speed.y = 0;
		}
	}

	limitMaxSpeed(maxSpeed: number) {
		if (this.speed.x > 0) {
			this.speed.x = Math.min(this.speed.x, maxSpeed);
		} else if (this.speed.x < 0) {
			this.speed.x = Math.max(this.speed.x, -maxSpeed);
		}

		if (this.speed.y > 0) {
			this.speed.y = Math.min(this.speed.y, maxSpeed);
		} else if (this.speed.y < 0) {
			this.speed.y = Math.max(this.speed.y, -maxSpeed);
		}
	}

	stopIfNotMovin(movingy: boolean, movingx: boolean) {
		if (!movingy && this.grounded) {
			if (this.speed.y > 0) {
				this.speed.y = this.speed.y > 0.5 ? this.speed.y * this.brakes : 0;
			} else if (this.speed.y < 0) {
				this.speed.y = this.speed.y < -0.5 ? this.speed.y * this.brakes : 0;
			}
		}
		if (!movingx) {
			if (this.speed.x > 0) {
				this.speed.x = this.speed.x > 0.5 ? this.speed.x * this.brakes : 0;
			} else if (this.speed.x < 0) {
				this.speed.x = this.speed.x < -0.5 ? this.speed.x * this.brakes : 0;
			}
		}
	}

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

				const pointsFromMineral = this.drillingMineral.destroy();

				if (this.basket.amount < this.basket.maxItems) {
					this.points += pointsFromMineral;
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

	// move towards final drill position if one axis is on position move a little random for effect
	moveTowardsVector(vector: { x?: number; y?: number }) {
		if (vector.x !== undefined && vector.y !== undefined && this.drillingMineral !== undefined) {
			const drillFriction = mineralFriction[this.drillingMineral.type];

			if (this.pos.x < vector.x) {
				this.speed.x += this.acceleration * drillFriction;
			} else if (this.pos.x > vector.x) {
				this.speed.x -= this.acceleration * drillFriction;
			} else {
				this.speed.x = Math.random() > 0.5 ? this.acceleration * drillFriction : -this.acceleration * drillFriction;
			}

			if (this.pos.y < vector.y) {
				this.speed.y += this.acceleration * drillFriction;
			} else if (this.pos.y > vector.y) {
				this.speed.y -= this.acceleration * drillFriction;
			} else {
				this.speed.y = Math.random() > 0.5 ? this.acceleration * drillFriction : -this.acceleration * drillFriction;
			}
		}
	}

	doneDrilling() {
		let done = false;
		if (this.finalDrillPosition.x !== undefined && this.finalDrillPosition.y !== undefined) {
			if (this.drillingStartDirection === 'down') {
				if (this.speed.y + this.pos.y >= this.finalDrillPosition.y) {
					done = true;
				}
			} else if (this.drillingStartDirection === 'right') {
				if (this.speed.x + this.pos.x >= this.finalDrillPosition.x) {
					done = true;
				}
			} else if (this.drillingStartDirection === 'left') {
				if (this.speed.x + this.pos.x <= this.finalDrillPosition.x) {
					done = true;
				}
			}
		}
		return done;
	}

	calculateFinalDrillPosition(mineral: Mineral, startDirection: string) {
		if (startDirection === 'down') {
			return { x: mineral.pos.x + (mineral.size.width - this.size.width) / 2, y: mineral.pos.y + (mineral.size.height - this.size.width) / 2 };
		} else if (startDirection === 'right') {
			return { x: mineral.pos.x + (mineral.size.width - this.size.width), y: mineral.pos.y + (mineral.size.height - this.size.height) - 2 };
		} else if (startDirection === 'left') {
			return { x: mineral.pos.x, y: mineral.pos.y + (mineral.size.height - this.size.height) - 2 };
		}
		return { x: mineral.pos.x + mineral.size.width, y: mineral.pos.y };
	}

	addMineralToBasket(mineral: Mineral) {
		if (this.basket.amount < this.basket.maxItems) {
			this.basket.items[mineral.type] = this.basket.items[mineral.type] + 1 || 1;
			this.basket.amount++;
		}
	}
}
