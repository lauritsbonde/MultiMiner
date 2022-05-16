export default class Mineral {
	id: number;

	size: { width: number; height: number };
	pos: { x: number; y: number };

	type: string;
	isDrillable: boolean;
	drillFriction: number; //lower is more friction

	constructor(id: number, size: number, x: number, y: number, type: string) {
		this.id = id;

		this.size = { width: size, height: size };
		this.pos = { x: x, y: y };

		this.type = type;

		this.isDrillable = nonDrillableMineralTypes[type] === undefined;

		this.drillFriction = 0.15;
	}

	destroy() {
		this.type = 'Empty';
		this.drillFriction = 0;
	}
}

//this could be an array and we could check if the type is in array, but that would be slower lookup
const nonDrillableMineralTypes: { [key: string]: boolean } = { Empty: true, Concrete: true };
