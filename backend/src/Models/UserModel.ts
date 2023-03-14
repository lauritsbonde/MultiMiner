import mongoose from 'mongoose';

const UserModel = new mongoose.Schema({
	name: String,
	imageSpriteIndex: { head: String, body: String, bottom: String, wheels: String },

	auth0Id: String,

	acceleration: Number,
	maxSpeed: Number,

	brakes: Number, // lower is faster

	fuel: { current: Number, max: Number, consumption: Number },
	money: Number,

	basket: { maxItems: Number, items: {}, amount: Number },

	points: Number,
});

export default UserModel;

export interface IUser {
	name: string;
	imageSpriteIndex: { head: string; body: string; bottom: string; wheels: string };

	auth0Id: string;

	acceleration: number;
	maxSpeed: number;

	brakes: number; // lower is faster

	fuel: { current: number; max: number; consumption: number };
	money: number;

	basket: { maxItems: number; items: {}; amount: number };

	points: number;
}

export interface auth0User {
	email: string;
	email_verified: boolean;
	name: string;
	nickname: string;
	picture: string;
	sub: string;
	updated_at: string;
	points: number;
}
