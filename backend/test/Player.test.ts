import Player from '../src/Classes/Player';
import World from '../src/Classes/World';
import { test, expect } from '@jest/globals';

let world = {} as World;
let player = {} as Player;

beforeAll(() => {
	world = new World();
});

beforeEach(() => {
	player = new Player(
		'test',
		{ x: 100, y: 100 },
		{ width: world.size.width, height: world.size.width },
		world.groundStart,
		world.shopManager.buildings,
		'player',
		world.getSurroundingMinerals.bind(world)
	);
});

// SETUP
test('Player is of type player', () => {
	expect(player).toBeInstanceOf(Player);
});

test("Player's name is player", () => {
	expect(player.name).toBe('player');
});

// MOVE
test('Test player can move right', () => {
	player.moving.right = true;
	player.move(world.turnDrilledMineralToIndexAndType.bind(world));
	expect(player.pos.x).toBeGreaterThan(100);
});

test('Test player can move left', () => {
	player.moving.left = true;
	player.move(world.turnDrilledMineralToIndexAndType.bind(world));
	expect(player.pos.x).toBeLessThan(100);
});

test('Test player can move up', () => {
	player.moving.up = true;
	player.move(world.turnDrilledMineralToIndexAndType.bind(world));
	expect(player.pos.y).toBeLessThan(100);
});

test('Test player can move down', () => {
	player.moving.down = true;
	player.move(world.turnDrilledMineralToIndexAndType.bind(world));
	expect(player.pos.y).toBeGreaterThan(100);
});
