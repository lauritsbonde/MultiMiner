import express, { Request, Response } from 'express';
const app = express();
const http = require('http').Server(app);
const { auth } = require('express-openid-connect');
const io = require('socket.io')(http, {
	cors: {
		origin: (origin: string, callback: any) => {
			if (origin === 'http://localhost:3000') {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		methods: ['GET', 'POST'],
	},
});
require('dotenv').config();

const authConfig = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.AUTH0_SECRET,
	baseURL: 'http://localhost:3333',
	clientID: 'h7086nRe5Ew6otpzhBDxxG9kubS99QDq',
	issuerBaseURL: 'https://dev-m7wdzvfk.eu.auth0.com',
};

app.use(auth(authConfig));

import World from './Classes/World';
const world = new World();

io.on('connection', function (socket: any) {
	console.log('a user connected');
	world.addPlayer(socket.id);

	socket.on('move', (data: string) => {
		world.players[socket.id].moving[data] = true;
	});

	socket.on('stop', (data: string) => {
		world.players[socket.id].moving[data] = false;
	});

	socket.on('disconnect', () => {
		world.removePlayer(socket.id);
		console.log('user disconnected');
	});
});

setInterval(() => {
	world.update();
	io.sockets.emit('update', world.toDto());
}, 1000 / 45);

app.get('/', function (req: any, res: Response) {
	res.send(req.oidc.isAuthenticated() ? 'Logged in -> ' + req.oidc.user : 'Not logged in');
});

http.listen(3333, function () {
	console.log('listening on *:3333');
});
