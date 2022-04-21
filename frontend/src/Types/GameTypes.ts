export default interface MineralData {
	id: string;
	size: { width: number; height: number };
	pos: { x: number; y: number };
	type: string;
}

interface PlayerData {
	id: string;
	pos: { x: number; y: number };
	size: { width: number; height: number };
}

interface BuildingData {
	pos: { x: number; y: number };
	size: { width: number; height: number };
	title: string;
}

export default interface UpdateGameData {
	size: { width: number; height: number };
	groundStart: number;
	players: { [id: string]: PlayerData };
	minerals: Array<MineralData>;
	buildings: Array<BuildingData>;
}
