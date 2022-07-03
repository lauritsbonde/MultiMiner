import { mineralSpawn } from '../Lookups/minerals';
import DatabaseHelper from './DatabaseHelper';
import Mineral from './Mineral';
import Player from './Player';
import PlayerDto from './PlayerDto';
import ShopManager from './ShopManager';
import AIplayer from './AI/AIplayer';
import { savedWeights } from './AI/Brain';
import AiController from './AI/AiController';

export default class World {
	size: { width: number; height: number };
	groundStart: number;

	players: { [id: string]: Player };
	playersDto: { [id: string]: PlayerDto };
	aiController: AiController;
	// playersKdTree: kdTree;

	minerals = Array<Mineral>();
	mineralSize: number;
	// mineralKdTree: kdTree
	changedMineralsSinceLastUpdate: Array<{ id: number; toType: string; boundingBox: { maxx: number; minx: number; maxy: number; miny: number } }> = [];

	shopManager: ShopManager;

	chatMessages: Array<{ id: string; message: string }>;

	leaderBoard: Array<{ id: string; name: string; points: number }>;

	dataBase: DatabaseHelper;

	constructor() {
		this.size = { width: 4000, height: 4000 }; //there is a concrete level after the height
		this.groundStart = 500;

		this.players = {};
		this.playersDto = {};
		// this.playersKdTree = new kdTree(Object.values(this.playersDto), 10);

		this.minerals = [];
		this.mineralSize = 50;
		this.setupMinerals();
		// this.mineralKdTree = new kdTree(this.minerals, 50);
		this.changedMineralsSinceLastUpdate = [];

		this.shopManager = new ShopManager();
		this.shopManager.setupBuildings(this.mineralSize, this.size, this.groundStart, (index: number) => this.makeMineralConcrete(index));

		this.chatMessages = [];

		this.leaderBoard = [];

		this.dataBase = new DatabaseHelper();

		this.aiController = new AiController(this.size, this.groundStart, this.shopManager, this.mineralSize, this.getSurroundingMinerals.bind(this));
	}

	toDto() {
		const mineralChanges = this.changedMineralsSinceLastUpdate;
		this.changedMineralsSinceLastUpdate = [];

		return {
			players: this.playersDto,
			changedMinerals: mineralChanges,
			leaderBoard: this.leaderBoard,
		};
	}

	setupMinerals() {
		let counter = 0;
		for (let i = this.groundStart; i < this.size.height; i += this.mineralSize) {
			for (let j = 0; j < this.size.width; j += this.mineralSize) {
				this.minerals.push(this.getMineralToSpawn(i, counter, { x: j, y: i }));
				counter++;
			}
		}
		//create a concrete bottom
		for (let i = 0; i < this.size.width; i += this.mineralSize) {
			this.minerals.push(new Mineral(counter, this.mineralSize, i, this.size.height, 'Concrete'));
			counter++;
		}
	}

	getMineralToSpawn(depth: number, id: number, pos: { x: number; y: number }) {
		let type = mineralSpawn(depth, this.groundStart);

		return new Mineral(id, this.mineralSize, pos.x, pos.y, type);
	}

	makeMineralConcrete(index: number) {
		this.minerals[index].type = 'Concrete';
		this.minerals[index].isDrillable = false;
	}

	addPlayer(name: string, socketId: string) {
		return new Promise((resolve, reject) => {
			const randx = Math.floor((Math.random() * this.size.width) / 10);
			const randy = Math.floor(Math.random() * (this.groundStart - 50 - 300 + 1) + 300);
			const newPlayer = new Player(
				socketId,
				{ x: randx, y: randy },
				{ width: this.size.width, height: this.size.height },
				this.groundStart,
				this.shopManager.buildings,
				name,
				this.getSurroundingMinerals.bind(this)
			);

			this.dataBase
				.saveUser(newPlayer)
				.then((res: { success: boolean; data: any; errmsg: string }) => {
					if (res.success) {
						const id = res.data._id.toString();
						newPlayer.id = id;
						this.players[id] = newPlayer;
						this.playersDto[id] = newPlayer.toDto();
						resolve(id);
					} else {
						reject(res.errmsg);
					}
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	removePlayer(socketId: string) {
		Object.values(this.players).find((player) => {
			if (player.socketId === socketId) {
				if (player.id === 'aiSpectator') {
					this.aiController.removeSpectator();
					this.players = this.aiController.removeAis(this.players);
				}
				delete this.players[player.id];
				delete this.playersDto[player.id];
				return true;
				// this.playersKdTree.remove(player.toDto());
			}
		});
		Object.values(this.aiController.getAis()).find((ai) => {
			if (ai.socketId === socketId) {
				this.aiController.removeAi(ai.id);
				delete this.playersDto[ai.id];
				return true;
				// this.playersKdTree.remove(player.toDto());
			}
		});

		if (this.aiController.aiSpectator !== undefined && this.aiController.aiSpectator.socketId === socketId) {
			this.aiController.removeSpectator();
		}
	}

	update() {
		this.updatePlayers();
		this.aiController.updateAis(this.minerals, this.mineralSize, this.size, this.groundStart, this.turnDrilledMineralToIndexAndType.bind(this));

		if (this.aiController.aiSpectator !== undefined) {
			this.playersDto[this.aiController.aiSpectator.id] = this.aiController.aiSpectator.toDto();
		}
		this.createLeaderBoard();
		//this.buildKdTrees();
	}

	buildKdTrees() {
		// this.playersKdTree = new kdTree(Object.values(this.playersDto), 10);
		// this.mineralKdTree = new kdTree(this.minerals, 50);
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

	turnDrilledMineralToIndexAndType(mineral: Mineral, _mineralSize?: number) {
		const mineralSize = _mineralSize || this.mineralSize;
		const padding = 50;
		const boundingBox = { maxx: mineral.pos.x + mineralSize + padding, maxy: mineral.pos.y + mineralSize + padding, minx: mineral.pos.x - padding, miny: mineral.pos.y - padding };
		this.changedMineralsSinceLastUpdate.push({ id: mineral.id, toType: 'Empty', boundingBox });
	}

	updatePlayers() {
		for (let id in this.players) {
			if (this.players[id].isDead) {
				this.removePlayer(id);
			} else {
				this.players[id].move((mineral) => this.turnDrilledMineralToIndexAndType(mineral), this.getSurroundingMinerals.bind(this));
				this.playersDto[id] = this.players[id].toDto();
			}
		}
	}

	addChat(message: string, id: string) {
		this.chatMessages.push({ message, id });
	}

	createLeaderBoard() {
		this.leaderBoard = [];
		for (let id in this.players) {
			if (this.players[id].isDead) continue;
			this.leaderBoard.push({ id, name: this.players[id].name, points: this.players[id].points });
		}
		for (let id in this.aiController.ais) {
			if (this.aiController.ais[id].isDead) continue;
			this.leaderBoard.push({ id, name: this.aiController.ais[id].name, points: this.aiController.ais[id].points });
		}
		this.leaderBoard.sort((a, b) => b.points - a.points);
	}

	createAiSpectator(socketId: string) {
		const spectator = this.aiController.createAiSpectator(socketId);
		this.playersDto[spectator.id] = spectator.toDto();
	}

	newAiGeneration() {
		for (let id in this.aiController.ais) {
			delete this.playersDto[id];
		}
		this.playersDto = { ...this.playersDto, ...this.aiController.newAiGeneration() };
	}
}
