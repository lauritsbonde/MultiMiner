import Mineral from './Mineral';
import PosClass from './PosClass';

export default class PlayerDto extends PosClass {
	id: string;
	name: string;
	imageIndex: { head: string; body: string; bottom: string; wheels: string };

	onBuilding: string;
	fuel: { max: number; current: number };
	money: number;
	isDead: boolean;
	basket: { items: { [type: string]: number }; amount: number };

	points: number;

	constructor(
		id: string,
		name: string,
		imageIndex: { head: string; body: string; bottom: string; wheels: string },

		pos: { x: number; y: number },
		size: { width: number; height: number },
		onBuilding: string,
		fuel: { max: number; current: number },
		money: number,
		isDead: boolean,
		basket: { items: { [type: string]: number }; amount: number },
		points: number
	) {
		super(size, pos);

		this.id = id;
		this.name = name;

		this.imageIndex = imageIndex;

		this.onBuilding = onBuilding;
		this.fuel = fuel;
		this.money = money;
		this.isDead = isDead;
		this.basket = basket;
		this.points = points;
	}
}
