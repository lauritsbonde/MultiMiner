import mongoose, { Model } from 'mongoose';
// const URI = `mongodb+srv://lauritsbonde:${process.env.MONGODB}@cluster0.3qe1rjx.mongodb.net/?retryWrites=true&w=majority`;
const URI = `mongodb+srv://lauritsbonde:${process.env.MONGODB_PASSWORD}@users.pn1fzrq.mongodb.net/?retryWrites=true&w=majority`;
import UserModel from '../Models/UserModel';
import Player from './Player';

const user = mongoose.model('User', UserModel);

export default class DatabaseHelper {
	constructor() {
		console.log(URI);
		this.connectToDatabase();
	}

	connectToDatabase() {
		mongoose.connect(URI);
		mongoose.connection.on('connected', () => {
			console.log('Connected to database');
		});
		mongoose.connection.on('error', (err) => {
			console.log('DB con err: ' + err);
		});
	}

	async getUser(id: string) {}

	async saveUser(user: Player) {
		const toSave = this.turnPlayerToUser(user);
		const data = await toSave.save().catch((err) => {
			return { success: false, data: undefined, errmsg: `${err}` };
		});
		return { success: true, data, errmsg: '' };
	}

	turnPlayerToUser(player: Player) {
		const newPlayer = new user({
			name: player.name,
			imageSpriteIndex: player.imageSpriteIndex,

			acceleration: player.acceleration,
			maxSpeed: player.maxSpeed,

			brakes: player.brakes,

			fuel: player.fuel,
			money: player.money,

			basket: player.basket,

			points: player.points,
		});

		return newPlayer;
	}
}
