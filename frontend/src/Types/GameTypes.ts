export interface MineralData {
	id: string;
	size: { width: number; height: number };
	pos: { x: number; y: number };
	type: string;
}

interface PlayerData {
	id: string;
	pos: { x: number; y: number };
	size: { width: number; height: number };
	onBuilding: string;
	fuel: { max: number; current: number };
	money: number;
	isDead: boolean;
	basket: { items: { [type: string]: number }; amount: number };
}

interface BuildingData {
	pos: { x: number; y: number };
	size: { width: number; height: number };
	title: string;
}

export interface UpdateGameData {
	changedMinerals: Array<{ index: number; toType: string }>;
	players: { [id: string]: PlayerData };
	selfPlayer: PlayerData;
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
