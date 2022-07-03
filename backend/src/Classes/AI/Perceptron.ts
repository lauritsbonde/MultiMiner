import { guessInput } from './types';

export default class Perceptron {
	weights: Array<number>;

	constructor(weights: number) {
		this.weights = [];
		for (let i = 0; i < weights; i++) {
			this.weights.push(Math.random() * 2 - 1);
		}
	}

	guess(input: Array<number>): number {
		let sum = 0;
		for (let i = 0; i < this.weights.length; i++) {
			sum += input[i] * this.weights[i];
		}
		return this.sign(sum);
	}

	sign(num: number): number {
		return this.sigmoid(num);
	}

	sigmoid(num: number): number {
		return 1 / (1 + Math.exp(-num));
	}
}
