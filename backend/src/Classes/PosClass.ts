export default class PosClass {
	size: { width: number; height: number };
	pos: { x: number; y: number };

	constructor(size: { width: number; height: number }, pos: { x: number; y: number }) {
		this.size = size;
		this.pos = pos;
	}
}
