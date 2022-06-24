export interface MineralData {
	id: number;
	size: { width: number; height: number };
	pos: { x: number; y: number };
	type: string;
	style: number;
}

interface PlayerData {
	id: string;
	name: string;
	pos: { x: number; y: number };
	size: { width: number; height: number };
	onBuilding: string;
	fuel: { max: number; current: number };
	money: number;
	isDead: boolean;
	basket: { items: { [type: string]: number }; amount: number };
	imageIndex: { head: string; body: string; bottom: string; wheels: string };
	points: number;
}

interface BuildingData {
	pos: { x: number; y: number };
	size: { width: number; height: number };
	title: string;
}

export interface UpdateGameData {
	changedMinerals: Array<{ id: number; toType: string; boundingBox: { maxx: number; minx: number; maxy: number; miny: number } }>;
	players: { [id: string]: PlayerData };
	selfPlayer: PlayerData;
	leaderBoard: Array<{ id: string; name: string; points: number }>;
}

export interface StartData {
	size: { width: number; height: number };
	groundStart: number;
	buildings: Array<BuildingData>;

	minerals: Array<MineralData>;
	players: { [id: string]: PlayerData };
	selfPlayer: PlayerData;
}

export interface DynamicData {
	players: { [id: string]: PlayerData };
	selfPlayer: PlayerData;
}

export interface ConstantData {
	size: { width: number; height: number };
	groundStart: number;
	buildings: Array<BuildingData>;
}
