import Perceptron from './Perceptron';
import Matrix from './Matrix';

export interface savedWeights {
	weightsIH: Matrix;
	weightsHidden: Array<Matrix>;
	weightsHO: Matrix;
	biasIH: number;
	biasHO: number;
}

export default class Brain {
	inputNodes: Array<Perceptron>;
	hiddenNodes: Array<Array<Perceptron>>;
	outputNodes: Array<Perceptron>;

	weightsIH: Matrix;
	weightsHidden: Array<Matrix>;
	weightsHO: Matrix;

	biasHidden: number;
	biasOutput: number;

	learningRate: number;

	constructor(inputs: number, hidden: { nodes: number; layers: number }, outputs: number, oldWeights?: savedWeights, learningRate = 0.4) {
		this.inputNodes = [];
		for (let i = 0; i < inputs; i++) {
			this.inputNodes.push(new Perceptron(1));
		}

		this.hiddenNodes = [];
		for (let i = 0; i < hidden.layers; i++) {
			this.hiddenNodes.push([]);
			for (let j = 0; j < hidden.nodes; j++) {
				this.hiddenNodes[i].push(new Perceptron(inputs));
			}
		}

		this.outputNodes = [];
		for (let i = 0; i < outputs; i++) {
			this.outputNodes.push(new Perceptron(hidden.nodes));
		}

		if (oldWeights) {
			this.loadWeights(oldWeights, learningRate);
		} else {
			this.generateWeights(inputs, hidden, outputs);
		}
	}

	setLearningRate(learningRate: number) {
		this.learningRate = learningRate;
	}

	loadWeights(weights: savedWeights, learningRate: number) {
		this.weightsIH = Matrix.multiply(weights.weightsIH, Math.random() > 0.5 ? learningRate : -learningRate);
		this.weightsHO = Matrix.multiply(weights.weightsHO, Math.random() > 0.5 ? learningRate : -learningRate);

		this.biasHidden = weights.biasIH;
		this.biasOutput = weights.biasHO;

		this.weightsHidden = [];
		for (let i = 0; i < weights.weightsHidden.length; i++) {
			this.weightsHidden[i] = Matrix.multiply(weights.weightsHidden[i], Math.random() > 0.5 ? learningRate : -learningRate);
		}

		this.learningRate = learningRate;
	}

	generateWeights(inputs: number, hidden: { nodes: number; layers: number }, outputs: number) {
		this.weightsIH = new Matrix(hidden.nodes, inputs);
		this.weightsHO = new Matrix(outputs, hidden.nodes);

		this.weightsIH.randomize();
		this.weightsHO.randomize();

		this.weightsHidden = [];
		for (let i = 0; i < hidden.layers; i++) {
			this.weightsHidden.push(new Matrix(hidden.nodes, hidden.nodes));
			this.weightsHidden[i].randomize();
		}

		this.biasHidden = 1;
		this.biasOutput = 1;
	}

	guess(input_array: Array<number>): Array<number> {
		const input = Matrix.fromArray(input_array);

		let ff = undefined as Matrix;

		// Generate hidden outputs
		ff = Matrix.multiply(this.weightsIH, input);
		ff.add(this.biasHidden);
		ff.map(this.sigmoid);

		// Generate output outputs
		for (let i = 0; i < this.weightsHidden.length; i++) {
			ff = Matrix.multiply(this.weightsHidden[i], ff);
			ff.add(this.biasHidden);
			ff.map(this.sigmoid);
		}

		// Generate output outputs
		const output = Matrix.multiply(this.weightsHO, ff);
		output.add(this.biasOutput);
		output.map(this.sigmoid);

		return output.toArray();
	}

	sigmoid(x: number): number {
		return 1 / (1 + Math.exp(-x));
	}

	exportWeights(): savedWeights {
		return { weightsIH: this.weightsIH, weightsHO: this.weightsHO, weightsHidden: this.weightsHidden, biasIH: this.biasHidden, biasHO: this.biasOutput };
	}
}
