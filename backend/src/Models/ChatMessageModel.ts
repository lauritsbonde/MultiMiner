import mongoose from 'mongoose';

const ChatMessageModel = new mongoose.Schema({
	message: String,
	sender: String,
	timestamp: Number,
});

export default ChatMessageModel;
