import express, { Request, Response } from 'express';
import Mineral from './Classes/Mineral';
import PlayerDto from './Classes/PlayerDto';
import Building from './Classes/Building';

const app = express();
const http = require('http').Server(app);
const { auth } = require('express-openid-connect');

const allowedOrigins = ['http://localhost:3000', 'https://multiminer.herokuapp.com', 'https://lauritsbonde.github.io'];

const io = require('socket.io')(http, {
	cors: {
		origin: (origin: string, callback: any) => {
			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		methods: ['GET', 'POST'],
	},
});
require('dotenv').config();

// const authConfig = {
// 	authRequired: false,
// 	auth0Logout: true,
// 	secret: process.env.AUTH0_SECRET,
// 	baseURL: 'http://localhost:3333',
// 	clientID: 'h7086nRe5Ew6otpzhBDxxG9kubS99QDq',
// 	issuerBaseURL: 'https://dev-m7wdzvfk.eu.auth0.com',
// };

// app.use(auth(authConfig));

import World from './Classes/World';
const world = new World();

io.on('connection', function (socket: any) {
	console.log('a user connected');
	world.addPlayer(socket.id);

	socket.on(
		'join',
		(
			data: { canvasSize: { width: number; height: number } },
			callback: (response: {
				size: { width: number; height: number };
				groundStart: number;
				players: { [id: string]: PlayerDto };
				minerals: Mineral[];
				buildings: Building[];
				selfPlayer: PlayerDto;
			}) => void
		) => {
			world.players[socket.id].setCanvasSize(data.canvasSize);
			callback({
				size: world.size,
				groundStart: world.groundStart,
				players: world.playersDto,
				minerals: world.minerals,
				buildings: world.shopManager.buildings,
				selfPlayer: world.playersDto[socket.id],
			});
		}
	);

	// PLAYER MOVEMONT

	socket.on('move', (data: string) => {
		world.players[socket.id].moving[data] = true;
	});

	socket.on('stop', (data: string) => {
		world.players[socket.id].moving[data] = false;
	});

	// FUEL STATION

	socket.on('enterFuelStation', (data: {}, callback: (response: {}) => void) => {
		callback(world.shopManager.getFuelPrice(world.players[socket.id]));
	});

	socket.on('purchaseFuel', (data: { amount: number; price: number }) => {
		world.shopManager.purchaseFuel(world.players[socket.id], data);
	});

	// MINERAL SHOP
	socket.on('enterMineralShop', (data: {}, callback: (response: { [type: string]: { price: number; amount: number; totalPrice: number } }) => void) => {
		callback(world.shopManager.getBasketPrices(world.players[socket.id]));
	});

	socket.on('sellMineral', (data: { mineral: string; amount: number }) => {
		world.shopManager.sellMineral(world.players[socket.id], data.mineral, data.amount);
	});

	socket.on('disconnect', () => {
		world.removePlayer(socket.id);
		console.log('user disconnected');
	});
});

setInterval(() => {
	world.update();
	io.emit('update', world.toDto());
}, 1000 / 30);

app.get('/', function (req: any, res: Response) {
	// res.send(req.oidc.isAuthenticated() ? 'Logged in -> ' + req.oidc.user : 'Not logged in');
	res.send('Hello World!');
});

const port = process.env.PORT || 3333;

http.listen(port, function () {
	console.log(`listening on *:${port}`);
});
