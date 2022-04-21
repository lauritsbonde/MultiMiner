import express, { Request, Response } from 'express';
const app = express();
const http = require('http').Server(app);
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

import World from './Classes/World';
const world = new World();

io.on('connection', function (socket: any) {
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

app.get('/', function (req: Request, res: Response) {
	res.send('hello world!');
});

http.listen(3333, function () {
	console.log('listening on *:3333');
});
