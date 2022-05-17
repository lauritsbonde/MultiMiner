import express, { Request, Response } from 'express';
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

	socket.on('canvasSize', (data: { width: number; height: number }) => {
		world.players[socket.id].setCanvasSize(data);
	});

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

	socket.on('disconnect', () => {
		world.removePlayer(socket.id);
		console.log('user disconnected');
	});
});

setInterval(() => {
	world.update();
	for (let socketId in world.players) {
		io.to(socketId).emit('update', world.toDto(socketId));
	}
}, 1000 / 45);

app.get('/', function (req: any, res: Response) {
	// res.send(req.oidc.isAuthenticated() ? 'Logged in -> ' + req.oidc.user : 'Not logged in');
	res.send('Hello World!');
});

const port = process.env.PORT || 3333;

http.listen(port, function () {
	console.log(`listening on *:${port}`);
});
