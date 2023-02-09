import express, { Request, Response } from 'express';
import Mineral from './Classes/Mineral';
import PlayerDto from './Classes/PlayerDto';
import Building from './Classes/Building';

const app = express();
const http = require('http').Server(app);

const allowedOrigins = ['http://localhost:3000', 'https://www.multiminer.click', 'https://lauritsbonde.github.io/MultiMiner/'];

const io = require('socket.io')(http, {
	cors: {
		origin: (origin: string, callback: any) => {
			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		methods: ['GET', 'POST', 'OPTIONS'],
		allowedHeaders: ['my-custom-header', 'Access-Control-Allow-Origin', 'Content-Type', 'Authorization'],
		credentials: true,
		path: process.env.NODE_ENV === 'production' ? '/api/socket.io' : '/socket.io',
	},
});

require('dotenv').config();

import World from './Classes/World';
const world = new World();

io.on('connection', function (socket: any) {
	socket.on(
		'join',
		(
			data: { canvasSize: { width: number; height: number }; name: string },
			callback: (response: { id: string; size: { width: number; height: number }; groundStart: number; players: { [id: string]: PlayerDto }; minerals: Mineral[]; buildings: Building[] }) => void
		) => {
			if (data.name === 'ai') {
				world.createAiSpectator(socket.id);
				callback({
					id: 'aiSpectator',
					size: world.size,
					groundStart: world.groundStart,
					players: world.playersDto,
					minerals: world.minerals,
					buildings: world.shopManager.buildings,
				});
			} else {
				world
					.addPlayer(data.name, socket.id)
					.then((id: string) => {
						if (id !== 'err') {
							world.players[id].setCanvasSize(data.canvasSize);
							console.log('a user connected');

							callback({
								id: id,
								size: world.size,
								groundStart: world.groundStart,
								players: world.playersDto,
								minerals: world.minerals,
								buildings: world.shopManager.buildings,
							});
						} else {
							//TODO: handle error
							// callback({ err: 'err' });
						}
					})
					.catch((err) => {
						console.log('adderr', err);
					});
			}
		}
	);

	// PLAYER MOVEMONT

	socket.on('move', (data: { dir: string; id: string }) => {
		world.players[data.id].moving[data.dir] = true;
	});

	socket.on('stop', (data: { dir: string; id: string }) => {
		world.players[data.id].moving[data.dir] = false;
	});

	// FUEL STATION

	socket.on('enterFuelStation', (data: { id: string }, callback: (response: {}) => void) => {
		if (data.id.includes('ai')) {
			callback(world.shopManager.getFuelPrice(world.aiController.ais[data.id]));
		} else {
			callback(world.shopManager.getFuelPrice(world.players[data.id]));
		}
	});

	socket.on('purchaseFuel', (data: { fuel: { amount: number; price: number }; id: string }) => {
		if (data.id.includes('ai')) {
			world.shopManager.purchaseFuel(world.aiController.ais[data.id], data.fuel);
		} else {
			world.shopManager.purchaseFuel(world.players[data.id], data.fuel);
		}
	});

	// MINERAL SHOP
	socket.on('enterMineralShop', (data: { id: string }, callback: (response: { [type: string]: { price: number; amount: number; totalPrice: number } }) => void) => {
		if (data.id.includes('ai')) {
			callback(world.shopManager.getBasketPrices(world.aiController.ais[data.id]));
		} else {
			callback(world.shopManager.getBasketPrices(world.players[data.id]));
		}
	});

	socket.on('sellMineral', (data: { id: string; mineral: string; amount: number }) => {
		if (data.id.includes('ai')) {
			world.shopManager.sellMineral(world.aiController.ais[data.id], data.mineral, data.amount);
		} else {
			world.shopManager.sellMineral(world.players[data.id], data.mineral, data.amount);
		}
	});

	// CHAT
	socket.on('chat', (data: { message: string; id: string }) => {
		world.addChat(data.message, data.id);
		// TODO: check the message for bad words
		io.emit('newchat', { message: data.message, senderName: world.players[data.id].name, senderId: data.id });
	});

	// AI
	socket.on('newAis', (data: {}, callback: (id: string) => void) => {
		world.newAiGeneration();
		callback(world.aiController.getAiSpectator().id);
	});

	socket.on('disconnect', () => {
		//TODO: save the player in the db
		world.removePlayer(socket.id);
		console.log('user disconnected');
	});
});

setInterval(() => {
	world.update();
	if (world.aiController.aiSpectator && world.aiController.changeAiId()) {
		io.emit('changeBestAi', { newId: world.aiController.getFollowAiId() });
	}
	io.emit('update', world.toDto());
}, 1000 / 30);

app.get('/', function (req: any, res: Response) {
	// res.send(req.oidc.isAuthenticated() ? 'Logged in -> ' + req.oidc.user : 'Not logged in');
	res.setHeader('Content-Type', 'application/json');
	res.status(200).json({ message: 'hooray! welcome to our api!' });
	res.end();
});

const port = process.env.PORT || 3333;

http.listen(port, function () {
	console.log(`listening on *:${port}`);
});
