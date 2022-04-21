export default class PlayerDto {
	id: string;
	pos: { x: number; y: number };
	size: { width: number; height: number };
	onBuilding: string;

	constructor(id: string, pos: { x: number; y: number }, size: { width: number; height: number }, onBuilding: string) {
		this.id = id;
		this.pos = pos;
		this.size = size;
		this.onBuilding = onBuilding;
	}
}
