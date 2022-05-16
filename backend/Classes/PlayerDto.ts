import Mineral from './Mineral';

export default class PlayerDto {
	id: string;
	pos: { x: number; y: number };
	size: { width: number; height: number };
	onBuilding: string;
	fuel: { max: number; current: number };
	money: number;
	isDead: boolean;
	basket: { items: { [type: string]: number }; amount: number };

	constructor(
		id: string,
		pos: { x: number; y: number },
		size: { width: number; height: number },
		onBuilding: string,
		fuel: { max: number; current: number },
		money: number,
		isDead: boolean,
		basket: { items: { [type: string]: number }; amount: number }
	) {
		this.id = id;
		this.pos = pos;
		this.size = size;
		this.onBuilding = onBuilding;
		this.fuel = fuel;
		this.money = money;
		this.isDead = isDead;
		this.basket = basket;
	}
}
