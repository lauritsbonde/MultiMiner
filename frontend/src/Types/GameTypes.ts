export interface MineralData {
	id: number;
	size: { width: number; height: number };
	pos: { x: number; y: number };
	type: string;
	style: number;
}

export interface Basket {
	items: { items: { [type: string]: number } };
	amount: number;
	maxItems: number;
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
	basket: Basket;
	imageIndex: { head: string; body: string; bottom: string; wheels: string };
	points: number;
}

export interface BuildingData {
	pos: { x: number; y: number };
	size: { width: number; height: number };
	title: string;
}

export interface UpdateGameData {
	changedMinerals: Array<{ id: number; toType: string; boundingBox: { maxx: number; minx: number; maxy: number; miny: number } }>;
	players: { [id: string]: PlayerData };
	leaderBoard: Array<{ id: string; name: string; points: number }>;
	sentTime: number;
}

export interface StartData {
	id: string;
	size: { width: number; height: number };
	groundStart: number;
	buildings: Array<BuildingData>;

	minerals: Array<MineralData>;
	players: { [id: string]: PlayerData };
}

export interface DynamicData {
	players: { [id: string]: PlayerData };
}

export interface ConstantData {
	size: { width: number; height: number };
	groundStart: number;
	buildings: Array<BuildingData>;
}
