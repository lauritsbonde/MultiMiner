export default class Matrix {
	rows: number;
	cols: number;
	matrix: Array<Array<number>>;

	constructor(rows: number, cols: number) {
		this.rows = rows;
		this.cols = cols;
		this.matrix = [];
		for (let i = 0; i < rows; i++) {
			this.matrix.push([]);
			for (let j = 0; j < cols; j++) {
				this.matrix[i].push(0);
			}
		}
	}

	randomize() {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				const val = Math.random() * 2 - 1;
				this.matrix[i][j] = val;
			}
		}
	}

	static fromArray(array: Array<number>) {
		let matrix = new Matrix(array.length, 1);
		for (let i = 0; i < array.length; i++) {
			matrix.matrix[i][0] = array[i];
		}
		return matrix;
	}

	toArray() {
		let array = [];
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				array.push(this.matrix[i][j]);
			}
		}
		return array;
	}

	add(input: Matrix | number) {
		if (input instanceof Matrix) {
			if (input.rows !== this.rows || input.cols !== this.cols) {
				console.log('add', input.rows, input.cols, this.rows, this.cols);
			}
			let result = new Matrix(this.rows, this.cols);
			for (let i = 0; i < result.rows; i++) {
				for (let j = 0; j < result.cols; j++) {
					result.matrix[i][j] = this.matrix[i][j] + input.matrix[i][j];
				}
			}
			return result;
		} else {
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.cols; j++) {
					this.matrix[i][j] += input;
				}
			}
		}
	}

	subtract(input: Matrix | number) {
		if (input instanceof Matrix) {
			if (input.rows !== this.rows || input.cols !== this.cols) {
				console.log('subtract', input.rows, input.cols, this.rows, this.cols);
			}
			let result = new Matrix(this.rows, this.cols);
			for (let i = 0; i < result.rows; i++) {
				for (let j = 0; j < result.cols; j++) {
					result.matrix[i][j] = this.matrix[i][j] - input.matrix[i][j];
				}
			}
			return result;
		} else {
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.cols; j++) {
					this.matrix[i][j] -= input;
				}
			}
		}
	}

	map(func: (input: number) => number) {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.matrix[i][j] = func(this.matrix[i][j]);
			}
		}
	}

	static multiply(matrix: Matrix, input: Matrix | number) {
		if (input instanceof Matrix) {
			if (matrix.cols !== input.rows) {
				console.log('multiply', matrix.cols, input.rows);
			}
			let result = new Matrix(matrix.rows, input.cols);
			for (let i = 0; i < result.rows; i++) {
				for (let j = 0; j < result.cols; j++) {
					let sum = 0;
					for (let k = 0; k < matrix.cols; k++) {
						sum += matrix.matrix[i][k] * input.matrix[k][j];
					}
					result.matrix[i][j] = sum;
				}
			}
			return result;
		} else {
			for (let i = 0; i < matrix.rows; i++) {
				for (let j = 0; j < matrix.cols; j++) {
					matrix.matrix[i][j] *= input;
				}
			}
			return matrix;
		}
	}

	static dotProduct(matrix: Matrix, input: Matrix | number) {
		if (input instanceof Matrix) {
			if (matrix.cols !== input.rows) {
				console.log('dotProduct', matrix.cols, input.rows);
			}
			let result = new Matrix(matrix.rows, input.cols);
			for (let i = 0; i < result.rows; i++) {
				for (let j = 0; j < result.cols; j++) {
					let sum = 0;
					for (let k = 0; k < matrix.cols; k++) {
						sum += matrix.matrix[i][k] * input.matrix[k][j];
					}
					result.matrix[i][j] = sum;
				}
			}
			return result;
		} else {
			for (let i = 0; i < matrix.rows; i++) {
				for (let j = 0; j < matrix.cols; j++) {
					matrix.matrix[i][j] *= input;
				}
			}
			return matrix;
		}
	}

	static matrixProduct(matrix: Matrix, input: Matrix) {
		if (matrix.cols !== input.rows) {
			console.log('matrixProduct', matrix.cols, input.rows);
		}
		let result = new Matrix(matrix.rows, input.cols);
		for (let i = 0; i < result.rows; i++) {
			for (let j = 0; j < result.cols; j++) {
				let sum = 0;
				for (let k = 0; k < matrix.cols; k++) {
					sum += matrix.matrix[i][k] * input.matrix[k][j];
				}
				result.matrix[i][j] = sum;
			}
		}
		return result;
	}
}
