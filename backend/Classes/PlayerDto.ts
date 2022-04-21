export default class PlayerDto {
	id: string;
	pos: { x: number; y: number };
	size: { width: number; height: number };

	constructor(id: string, pos: { x: number; y: number }, size: { width: number; height: number }) {
		this.id = id;
		this.pos = pos;
		this.size = size;
	}
}
