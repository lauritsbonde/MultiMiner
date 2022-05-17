import PosClass from './PosClass';

interface boundingBoxType {
	minx: number;
	maxx: number;
	miny: number;
	maxy: number;
}

export default class kdTree {
	root: any;

	constructor(elements: Array<PosClass>, maxElementsInLeafs: number = 10) {
		const copiedElements = [...elements];
		this.root = createNode(copiedElements, true, maxElementsInLeafs);
	}

	rangeSearch(bb: boundingBoxType) {
		let result = [] as Array<PosClass>;
		this.root.rangeSearch(bb, result);
		return result;
	}
}

class KDAbstract {
	boundingBox: boundingBoxType;

	constructor() {
		if (this.constructor === KDAbstract) {
			throw new TypeError("Can't instantiate abstract class!");
		}
		this.boundingBox = { minx: Infinity, miny: Infinity, maxx: -Infinity, maxy: -Infinity };
	}

	intersect(searchbox: boundingBoxType) {
		//check that that some of the searchbox corners are inside the bounding box
		if (searchbox.maxx < this.boundingBox.minx) {
			return false;
		}
		//Search is east
		if (searchbox.minx > this.boundingBox.maxx) {
			return false;
		}
		//Search is south
		if (searchbox.miny > this.boundingBox.maxy) {
			return false;
		}
		//Search is north
		return !(searchbox.maxy < this.boundingBox.miny);
	}

	rangeSearch(searchbox: boundingBoxType, result: Array<PosClass>) {
		console.log('Override');
	}
}

class KDNode extends KDAbstract {
	left: KDAbstract;
	right: KDAbstract;

	constructor(elements: Array<PosClass>, splitX: boolean, maxElementsInLeafs: number) {
		super();
		const elementsSorted = this.sort(elements, splitX);
		this.left = createNode(elementsSorted.slice(0, elementsSorted.length / 2), !splitX, maxElementsInLeafs);
		this.right = createNode(elementsSorted.slice(elementsSorted.length / 2), !splitX, maxElementsInLeafs);
		this.boundingBox = this.createBoundingBoxFromChildren();
	}

	createBoundingBoxFromChildren() {
		const bb = { minx: Infinity, miny: Infinity, maxx: -Infinity, maxy: -Infinity };
		bb.minx = this.left.boundingBox.minx;
		bb.miny = this.left.boundingBox.miny;
		bb.maxx = this.right.boundingBox.maxx;
		bb.maxy = this.right.boundingBox.maxy;
		return bb;
	}

	sort(elements: Array<PosClass>, splitX: boolean) {
		if (splitX) {
			elements.sort((a, b) => {
				return a.pos.x - b.pos.x;
			});
		} else {
			elements.sort((a, b) => {
				return a.pos.y - b.pos.y;
			});
		}
		return elements;
	}

	rangeSearch(searchbox: boundingBoxType, resultList: Array<PosClass>) {
		if (this.intersect(searchbox)) {
			this.left.rangeSearch(searchbox, resultList);
			this.right.rangeSearch(searchbox, resultList);
		}
		return resultList;
	}
}

class KDLeaf extends KDAbstract {
	elements: Array<PosClass>;

	constructor(elements: Array<PosClass>) {
		super();
		this.elements = elements;
		this.boundingBox = this.createBoundingBoxFromElements();
	}

	createBoundingBoxFromElements() {
		const bb = { minx: Infinity, miny: Infinity, maxx: -Infinity, maxy: -Infinity };
		for (let i = 0; i < this.elements.length; i++) {
			bb.minx = Math.min(bb.minx, this.elements[i].pos.x);
			bb.miny = Math.min(bb.miny, this.elements[i].pos.y);
			bb.maxx = Math.max(bb.maxx, this.elements[i].pos.x);
			bb.maxy = Math.max(bb.maxy, this.elements[i].pos.y);
		}
		return bb;
	}

	rangeSearch(searchbox: boundingBoxType, resultList: Array<PosClass>) {
		if (this.intersect(searchbox)) {
			for (let i = 0; i < this.elements.length; i++) {
				resultList.push(this.elements[i]);
			}
		}
		return resultList;
	}
}

function createNode(elements: Array<PosClass>, splitDimension: boolean, maxElementsInLeafs: number): KDAbstract {
	if (elements.length <= maxElementsInLeafs) {
		return new KDLeaf(elements);
	} else {
		return new KDNode(elements, splitDimension, maxElementsInLeafs);
	}
}
