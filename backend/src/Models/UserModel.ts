import mongoose from 'mongoose';

const UserModel = new mongoose.Schema({
	name: String,
	imageSpriteIndex: { head: String, body: String, bottom: String, wheels: String },

	acceleration: Number,
	maxSpeed: Number,

	brakes: Number, // lower is faster

	fuel: { current: Number, max: Number, consumption: Number },
	money: Number,

	basket: { maxItems: Number, items: {}, amount: Number },

	points: Number,
});

export default UserModel;
