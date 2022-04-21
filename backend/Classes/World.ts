import Mineral from './Mineral';
import Player from './Player';
import PlayerDto from './PlayerDto';
import Bulding from './Building';

export default class World {
	size: { width: number; height: number };
	groundStart: number;

	players: { [id: string]: Player };
	playersDto: { [id: string]: PlayerDto };

	minerals = Array<Mineral>();
	mineralSize: number;

	buildings: Array<Bulding>;

	constructor() {
		this.size = { width: 2000, height: 1000 }; //there is a concrete level after the height
		this.groundStart = 500;

		this.players = {};
		this.playersDto = {};

		this.minerals = [];
		this.mineralSize = 50;
		this.setupMinerals();

		this.buildings = [];
		this.setupBuildings();
	}

	toDto() {
		return {
			size: this.size,
			groundStart: this.groundStart,
			players: this.playersDto,
			minerals: this.minerals,
			buildings: this.buildings,
		};
	}

	setupMinerals() {
		let counter = 0;
		for (let i = this.groundStart; i < this.size.height; i += this.mineralSize) {
			for (let j = 0; j < this.size.width; j += this.mineralSize) {
				this.minerals.push(new Mineral(counter, this.mineralSize, j, i, 'Mud'));
				counter++;
			}
		}
		//create a concrete bottom
		for (let i = 0; i < this.size.width; i += this.mineralSize) {
			this.minerals.push(new Mineral(counter, this.mineralSize, i, this.size.height, 'Concrete'));
			counter++;
		}
	}

	setupBuildings() {
		const buildingsNeeded = ['Fuelstation', 'Mineral Shop', 'Upgrade Shop', 'Research Lab'];
		const buildingSize = { width: 100, height: 100 };
		const xDistanceBetweenBuildings = this.size.width / (buildingsNeeded.length + 1);

		for (let i = 0; i < buildingsNeeded.length; i++) {
			const x = xDistanceBetweenBuildings * (i + 1);
			const y = this.groundStart - buildingSize.height;
			this.buildings.push(new Bulding({ x, y }, buildingSize, buildingsNeeded[i]));

			// make the minerals under the buildings concrete
			for (let j = x - this.mineralSize; j < x + buildingSize.width + this.mineralSize; j += this.mineralSize) {
				const mineralIndex = Math.floor(j / this.mineralSize);
				this.minerals[mineralIndex].type = 'Concrete';
				this.minerals[mineralIndex].isDrillable = false;
			}
		}
	}

	addPlayer(id: string) {
		const randx = Math.floor((Math.random() * this.size.width) / 10);
		const randy = Math.floor(Math.random() * (this.groundStart - 50 - 300 + 1) + 300);
		const newPlayer = new Player(id, { x: randx, y: randy }, { width: this.size.width, height: this.size.height });
		this.players[id] = newPlayer;
		this.playersDto[id] = newPlayer.toDto();
	}

	removePlayer(id: string) {
		delete this.players[id];
		delete this.playersDto[id];
	}

	update() {
		this.updatePlayers();
	}

	updatePlayers() {
		for (let id in this.players) {
			const surroundingMinerals = this.getSurroundingMinerals(this.players[id]);
			this.players[id].move(surroundingMinerals);
			this.playersDto[id] = this.players[id].toDto();
		}
	}

	getSurroundingMinerals(player: Player) {
		let column = Math.floor((player.pos.x + player.size.width / 2) / this.mineralSize);
		let row = -1;
		let index = -1;
		const surroundingMinerals = { top: -1, bottom: -1, left: -1, right: -1 };
		for (let i = player.pos.y; i < this.size.height + this.mineralSize; i += this.mineralSize) {
			row = Math.floor((i + player.size.height / 2 - this.groundStart) / this.mineralSize);
			index = row * Math.floor(this.size.width / this.mineralSize) + column;
			if (index >= 0 && this.minerals[index].type !== 'Empty') {
				surroundingMinerals.bottom = index;
				break;
			}
		}

		for (let i = player.pos.y; i >= this.groundStart; i -= this.mineralSize) {
			row = Math.floor((i + player.size.height / 2 - this.groundStart) / this.mineralSize);
			index = row * Math.floor(this.size.width / this.mineralSize) + column;
			if (index >= 0 && this.minerals[index].type !== 'Empty') {
				surroundingMinerals.top = index;
				break;
			}
			if (index < 0) break;
		}

		row = Math.floor((player.pos.y + player.size.height / 2 - this.groundStart) / this.mineralSize);
		index = row * Math.floor(this.size.width / this.mineralSize) + column;

		if (index - 1 >= 0 && this.minerals[index - 1].type !== 'Empty') {
			if (index % Math.floor(this.size.width / this.mineralSize) !== 0) {
				surroundingMinerals.left = index - 1;
			}
		}

		if (index > 0 && index + 1 < this.minerals.length && this.minerals[index + 1].type !== 'Empty') {
			if (index % Math.floor(this.size.width / this.mineralSize) !== Math.floor(this.size.width / this.mineralSize) - 1) {
				surroundingMinerals.right = index + 1;
			}
		}

		return {
			topMineral: this.minerals[surroundingMinerals.top],
			bottomMineral: this.minerals[surroundingMinerals.bottom],
			leftMineral: this.minerals[surroundingMinerals.left],
			rightMineral: this.minerals[surroundingMinerals.right],
		};
	}
}
