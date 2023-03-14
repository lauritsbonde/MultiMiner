import AIplayer from './AIplayer';
import Player, { surroundingMinerals } from '../Player';
import { savedWeights } from './Brain';
import ShopManager from '../ShopManager';
import Mineral from '../Mineral';
import PlayerDto from '../PlayerDto';

export default class AiController {
	ais: { [id: string]: AIplayer };
	aiDtos: { [id: string]: PlayerDto };
	aiSpectator: Player;
	bestAI: AIplayer;
	changeId: boolean;

	size: { width: number; height: number };
	groundStart: number;

	shopManager: ShopManager;

	mineralSize: number;

	getSurroundingMinerals: (pos: { x: number; y: number }, size: { width: number; height: number }) => { topMineral: Mineral; bottomMineral: Mineral; leftMineral: Mineral; rightMineral: Mineral };

	constructor(
		size: { width: number; height: number },
		groundStart: number,
		shopManager: ShopManager,
		mineralSize: number,
		getSurroundingMinerals: (pos: { x: number; y: number }, size: { width: number; height: number }) => { topMineral: Mineral; bottomMineral: Mineral; leftMineral: Mineral; rightMineral: Mineral }
	) {
		this.ais = {};
		this.bestAI = undefined;
		this.changeId = false;

		this.size = size;
		this.groundStart = groundStart;
		this.shopManager = shopManager;

		this.mineralSize = mineralSize;

		this.getSurroundingMinerals = getSurroundingMinerals;
	}

	createAiSpectator(socketId: string) {
		const spectator = new Player(
			'AIspectator',
			{ x: 100, y: 100 },
			{ width: this.size.width, height: this.size.height },
			this.groundStart,
			this.shopManager.buildings,
			'spectator',
			this.getSurroundingMinerals
		);
		// spectator.id = 'aiSpectator';
		spectator.fuel.consumption = 0;
		spectator.gravityAffect = false;
		spectator.onBuilding = 'spectating';

		this.aiSpectator = spectator;

		return spectator;
	}

	spawnAi(brainWeights?: savedWeights) {
		const randx = Math.floor((Math.random() * this.size.width) / 10);
		const randy = Math.floor(Math.random() * (this.groundStart - 50 - 300 + 1) + 300);
		const newPlayer = new AIplayer(
			undefined,
			{ x: randx, y: randy },
			{ width: this.size.width, height: this.size.height },
			this.groundStart,
			this.shopManager.buildings,
			'AI:' + Object.keys(this.ais).length,
			this.shopManager,
			this.getSurroundingMinerals,
			brainWeights
		);
		// newPlayer.id = 'ai' + Object.keys(this.ais).length;
		if (Object.keys(this.ais).length === 1) {
			this.bestAI = newPlayer;
			this.changeId = true;
		}
		// this.ais[newPlayer.id] = newPlayer;
		return newPlayer;
	}

	updateAis(
		minerals: Mineral[],
		mineralSize: number,
		worldSize: { width: number; height: number },
		groundStart: number,
		turnDrilledMineralToIndexAndType: (mineral: Mineral, _mineralSize: number) => void
	) {
		this.changeId = false;
		for (let id in this.ais) {
			if (this.ais[id].isDead) continue;
			this.ais[id].move((mineral) => turnDrilledMineralToIndexAndType(mineral, mineralSize));
			this.ais[id].makeDecission();
			if (this.ais[id].points > this.bestAI.points) {
				this.bestAI = this.ais[id];
				this.changeId = true;
			}
		}
		return this.ais;
	}

	newAiGeneration() {
		const brainWeights = this.findBestAi();
		this.ais = {};
		this.aiDtos = {};
		this.spawnLoadsOfAis(15, brainWeights);
		for (let id in this.ais) {
			this.aiDtos[id] = this.ais[id].toDto();
		}
		this.bestAI = this.ais[Object.keys(this.ais)[0]];
		this.changeId = true;
		return this.aiDtos;
	}

	spawnLoadsOfAis(amount: number, brainWeights?: savedWeights) {
		for (let i = 0; i < amount; i++) {
			this.spawnAi(brainWeights);
		}
	}

	getAiSpectator() {
		return this.aiSpectator;
	}

	findBestAi() {
		let bestAi = undefined as AIplayer;
		for (let id in this.ais) {
			if (this.ais[id].isDead) continue;
			if (bestAi === undefined || this.ais[id].points > bestAi.points) {
				bestAi = this.ais[id];
			}
		}
		return bestAi !== undefined ? bestAi.brain.exportWeights() : undefined;
	}

	removeAis(players: { [id: string]: Player }) {
		for (let player in players) {
			// if (players[player].id.includes('ai')) {
			// 	delete players[player];
			// }
		}
		return players;
	}

	getFollowAiId() {
		// if (Object.keys(this.ais).length === 0) return this.aiSpectator.id;
		// return this.bestAI.id;
		return 0;
	}

	changeAiId() {
		return this.changeId;
	}

	removeSpectator() {
		this.aiSpectator = undefined;
		this.ais = {};
		return this.ais;
	}

	getAis() {
		return this.ais;
	}

	removeAi(id: string) {
		delete this.ais[id];
	}
}
