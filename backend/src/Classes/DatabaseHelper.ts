import mongoose, { Model } from 'mongoose';
const URI = process.env.NODE_ENV === 'development' ? 'mongodb://root:rootpassword@localhost/' : 'mongodb://root:rootpassword@mongo/';
// const URI = `mongodb+srv://lauritsbonde:${process.env.MONGODB_PASSWORD}@multiminer.pn1fzrq.mongodb.net/?retryWrites=true&w=majority`;
import UserModel, { IUser } from '../Models/UserModel';
import Player from './Player';
import ChatMessageModel from '../Models/ChatMessageModel';
import { auth0User } from '../Models/UserModel';

const user = mongoose.model<IUser>('User', UserModel);
const chatMessage = mongoose.model('ChatMessage', ChatMessageModel);

export default class DatabaseHelper {
	constructor() {}

	connectToDatabase() {
		return new Promise((resolve, reject) => {
			mongoose
				.connect(URI)
				.then((res) => {
					console.log('DB: ' + res.connection.name);
				})
				.catch((err) => {
					console.log(err);
				});
			mongoose.connection.on('connected', () => {
				console.log('Connected to database');
				resolve('connected');
			});
			mongoose.connection.on('error', (err) => {
				console.log('DB con err: ' + err);
				reject(err);
			});
		});
	}

	checkAllTablesExists() {
		return new Promise((resolve, reject) => {
			mongoose.connection.db.listCollections().toArray((err, names) => {
				if (err) {
					reject(err);
				} else {
					resolve(names);
				}
			});
		});
	}

	getUser(id: string) {
		return new Promise((resolve, reject) => {
			const data = user.findById(id).catch((err) => {
				resolve({ success: false, data: undefined, errmsg: `${err}` });
			});
			reject({ success: true, data, errmsg: '' });
		});
	}

	saveUser(user: Player) {
		return new Promise((resolve) => {
			const toSave = this.turnPlayerToUser(user);
			toSave
				.save()
				.then((res) => {
					resolve({ success: true, data: res, errmsg: undefined });
				})
				.catch((err) => {
					resolve({ success: false, data: undefined, errmsg: `${err}` });
				});
		});
	}

	turnPlayerToUser(player: Player) {
		const newPlayer = new user({
			name: player.name,
			imageSpriteIndex: player.imageSpriteIndex,

			auth0Id: player.auth0id,

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

	saveChatMessage(message: string, sender: string, timestamp: number) {
		return new Promise((resolve, reject) => {
			const newMessage = new chatMessage({
				message,
				sender,
				timestamp,
			});

			newMessage
				.save()
				.then((res) => {
					resolve({ success: true, data: res, errmsg: '' });
				})
				.catch((err) => {
					resolve({ success: false, data: undefined, errmsg: `${err}` });
				});
		});
	}

	checkIfUserExistsInDB(auth0User: auth0User) {
		return new Promise((resolve, reject) => {
			user.findOne({ name: auth0User.nickname, auth0Id: auth0User.sub })
				.then((res) => {
					if (res) {
						resolve({ success: true, data: res, errmsg: '' });
					} else {
						resolve({ success: true, data: undefined, errmsg: '' });
					}
				})
				.catch((err) => {
					resolve({ success: false, data: undefined, errmsg: `${err}` });
				});
		});
	}

	updatePlayer(player: Player) {
		return new Promise((resolve, reject) => {
			const model = this.turnPlayerToUser(player);
			user.findOneAndUpdate({ auth0Id: player.auth0id }, { points: player.points }, { new: true })
				.then((res) => {
					resolve({ success: true, data: res, errmsg: '' });
				})
				.catch((err) => {
					resolve({ success: false, data: undefined, errmsg: `${err}` });
				});
		});
	}
}
