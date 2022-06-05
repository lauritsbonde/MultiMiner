import PosClass from './PosClass';

export default class Mineral extends PosClass {
	id: number;

	type: string;
	isDrillable: boolean;
	drillFriction: number; //lower is more friction

	style: number; // this is the number for the style to draw

	constructor(id: number, size: number, x: number, y: number, type: string) {
		super({ width: size, height: size }, { x: x, y: y });
		this.id = id;

		this.type = type;

		this.isDrillable = nonDrillableMineralTypes[type] === undefined;

		this.drillFriction = 0.15;

		const types = 2;
		this.style = Math.floor(Math.random() * types);
	}

	destroy() {
		this.type = 'Empty';
		this.drillFriction = 0;
	}
}

//this could be an array and we could check if the type is in array, but that would be slower lookup
const nonDrillableMineralTypes: { [key: string]: boolean } = { Empty: true, Concrete: true };
