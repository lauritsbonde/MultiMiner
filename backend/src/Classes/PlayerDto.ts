import Mineral from './Mineral';
import PosClass from './PosClass';

export default class PlayerDto extends PosClass {
	id: string;
	name: string;
	imageIndex: number;

	onBuilding: string;
	fuel: { max: number; current: number };
	money: number;
	isDead: boolean;
	basket: { items: { [type: string]: number }; amount: number };

	constructor(
		id: string,
		name: string,
		imageIndex: number,

		pos: { x: number; y: number },
		size: { width: number; height: number },
		onBuilding: string,
		fuel: { max: number; current: number },
		money: number,
		isDead: boolean,
		basket: { items: { [type: string]: number }; amount: number }
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
	}
}
