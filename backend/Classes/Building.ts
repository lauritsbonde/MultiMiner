export default class Bulding {
	pos: { x: number; y: number };
	size: { width: number; height: number };
	title: string;

	constructor(pos: { x: number; y: number }, size: { width: number; height: number }, title: string) {
		this.pos = pos;
		this.size = size;
		this.title = title;
	}
}
