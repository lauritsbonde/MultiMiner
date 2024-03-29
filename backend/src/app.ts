import express, { Request, Response } from 'express';
import Mineral from './Classes/Mineral';
import PlayerDto from './Classes/PlayerDto';
import Building from './Classes/Building';

require('dotenv').config();

import World from './Classes/World';
import { auth0User } from './Models/UserModel';

const app = express();
const http = require('http').Server(app);

const allowedOrigins = ['http://localhost:3000', 'https://www.multiminer.click', 'https://lauritsbonde.github.io/MultiMiner/', 'multiminer.click', 'https://multiminer.click', 'https://localhost'];

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
		allowedHeaders: ['my-custom-header', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Content-Type', 'Authorization'],
		credentials: true,
		path: process.env.NODE_ENV === 'production' ? '/game/socket.io' : '/socket.io',
	},
});

const world = new World();

const socketIdToAuth0Id: { [socketId: string]: string } = {};

io.on('connection', function (socket: any) {
	socket.on(
		'join',
		(
			data: { canvasSize: { width: number; height: number }; user: auth0User; imageIndex: { head: string; body: string; bottom: string; wheels: string }; name?: string },
			callback: (response: {
				success: boolean;
				data: string | { id: string; size: { width: number; height: number }; groundStart: number; players: { [id: string]: PlayerDto }; minerals: Mineral[]; buildings: Building[] };
			}) => void
		) => {
			if (data.name === 'ai') {
				world.createAiSpectator(socket.id);
				callback({
					success: true,
					data: {
						id: 'aiSpectator',
						size: world.size,
						groundStart: world.groundStart,
						players: world.playersDto,
						minerals: world.minerals,
						buildings: world.shopManager.buildings,
					},
				});
			} else {
				world
					.addPlayerToWorld(data.user, socket.id, data.imageIndex)
					.then((res) => {
						if (!res.success) {
							console.log('error', res.data);
							callback({ success: false, data: res.data });
							return;
						}
						world.players[res.data].setCanvasSize(data.canvasSize);
						console.log('a user connected');

						callback({
							success: true,
							data: {
								id: res.data,
								size: world.size,
								groundStart: world.groundStart,
								players: world.playersDto,
								minerals: world.minerals,
								buildings: world.shopManager.buildings,
							},
						});
					})
					.catch((err) => {
						console.log('adderr', err);
					});
			}
		}
	);

	socket.on('ping', (callback: () => void) => {
		callback();
	});

	// PLAYER MOVEMONT
	socket.on('move', (data: { dir: 'up' | 'left' | 'right' | 'down'; id: string }) => {
		world.players[data.id].moving[data.dir] = true;
	});

	socket.on('stop', (data: { dir: 'up' | 'left' | 'right' | 'down'; id: string }) => {
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

	// SAVING
	socket.on('save', (data: { auth0Id: string }) => {
		console.log('saving', data.auth0Id);
		console.log('world', world.players);
		world.dataBase.updatePlayer(world.players[data.auth0Id]).then((res) => {
			console.log('saved', res);
		});
	});

	// CHAT
	socket.on('chat', (data: { message: string; id: string }) => {
		world.addChat(data.message, data.id);
		// TODO: check the message for bad words
		io.emit('newchat', { message: data.message, senderName: world.players[data.id].name });
	});

	// AI
	socket.on('newAis', (data: {}, callback: (id: string) => void) => {
		// world.newAiGeneration();
		// callback(world.aiController.getAiSpectator().id);
	});

	socket.on('disconnect', () => {
		world.removePlayer(socketIdToAuth0Id[socket.id]);
		console.log('user disconnected');
	});
});

//Socket io middleware
io.use((socket: any, next: any) => {
	const auth0Id = socket.handshake.auth.auth0Id;

	if (socketIdToAuth0Id[socket.id] === undefined) {
		socketIdToAuth0Id[socket.id] = auth0Id;
	} else if (socketIdToAuth0Id[socket.id] !== auth0Id) {
		delete socketIdToAuth0Id[socket.id];
		socketIdToAuth0Id[socket.id] = auth0Id;
	}

	next();
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
