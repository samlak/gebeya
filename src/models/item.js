const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	photo: {
		type: String
	},
	description: {
		type: String,
		required: true,
		trim: true
	},
	price: {
		type: Number,
		required: true
	},
	vendor: {
		type: String,
		required: true,
		trim: true
	}
}, {
	timestamps: true
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = {Item};