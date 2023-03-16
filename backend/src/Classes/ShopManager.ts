import Bulding from './Building';
import Player from './Player';

import { mineralPrices } from '../Lookups/minerals';

export default class ShopManager {
	buildings: Array<Bulding>;
	buildingSize: { width: number; height: number };

	constructor() {
		this.buildings = [];
		this.buildingSize = { width: 100, height: 100 };
	}

	setupBuildings(mineralSize: number, worldSize: { width: number; height: number }, groundStart: number, changeMineral: (index: number) => void) {
		const buildingsNeeded = ['Fuelstation', 'Mineral Shop', 'Upgrade Shop', 'Research Lab', 'Saver'];
		const buildingSize = this.buildingSize;
		const xDistanceBetweenBuildings = worldSize.width / (buildingsNeeded.length + 1);

		for (let i = 0; i < buildingsNeeded.length; i++) {
			if (buildingsNeeded[i] === 'Saver') {
				const x = 450;
				const y = groundStart - buildingSize.height - 250;
				this.buildings.push(new Bulding({ x, y }, buildingSize, buildingsNeeded[i]));
			} else {
				const x = xDistanceBetweenBuildings * (i + 1);
				const y = groundStart - buildingSize.height;
				this.buildings.push(new Bulding({ x, y }, buildingSize, buildingsNeeded[i]));

				// make the minerals under the buildings concrete
				for (let j = x - mineralSize; j < x + buildingSize.width + mineralSize; j += mineralSize) {
					const mineralIndex = Math.floor(j / mineralSize);
					changeMineral(mineralIndex);
				}
			}
		}
	}

	getFuelPrice(player: Player) {
		const literPrice = 2;
		const literForFull = player.fuel.max - player.fuel.current;
		const differentAmounts = [0.25, 0.5, 0.75, 1];
		const literForDifferentAmounts = differentAmounts.map((amount) => ((amount * Math.ceil(literForFull * 10)) / 10).toFixed(2));
		const fuels = {
			'1/4': { liters: +literForDifferentAmounts[0], price: literPrice * +literForDifferentAmounts[0] },
			'2/4': { liters: +literForDifferentAmounts[1], price: literPrice * +literForDifferentAmounts[1] },
			'3/4': { liters: +literForDifferentAmounts[2], price: literPrice * +literForDifferentAmounts[2] },
			Full: { liters: +literForDifferentAmounts[3], price: literPrice * +literForDifferentAmounts[3] },
		};
		return fuels;
	}

	purchaseFuel(player: Player, data: { amount: number; price: number }) {
		if (player.money >= data.price) {
			player.money -= data.price;
			const newFuel = player.fuel.current + data.amount;
			player.fuel.current = newFuel < player.fuel.max ? newFuel : player.fuel.max;
		}
	}

	getBasketPrices(player: Player) {
		const basket = player.basket;
		const selling = {} as { [type: string]: { price: number; amount: number; totalPrice: number } };
		for (const type in basket.items) {
			if (basket.items.hasOwnProperty(type)) {
				const price = mineralPrices[type];
				const amount = basket.items[type];
				const totalPrice = price * amount;
				selling[type] = { price, amount, totalPrice };
			}
		}
		return selling;
	}

	sellMineral(player: Player, type: string, amount: number) {
		let moneyEarned = 0;
		if (type === 'all') {
			for (const mineralType in player.basket.items) {
				if (player.basket.items.hasOwnProperty(mineralType)) {
					const price = mineralPrices[mineralType];
					const amount = player.basket.items[mineralType];
					moneyEarned += price * amount;
				}
			}
			player.basket.items = {};
			player.basket.amount = 0;
		} else {
			const price = mineralPrices[type];
			moneyEarned = price * amount;
			player.basket.items[type] -= amount;
			if (player.basket.items[type] <= 0) {
				delete player.basket.items[type];
			}
			player.basket.amount -= amount;
		}
		player.money += moneyEarned;
	}
}
