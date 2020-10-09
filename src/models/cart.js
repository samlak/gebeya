const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		unique: true
	},
	items: [{
		item: {
			item_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Item'
			},
			name: {
				type: String,
				required: true
			},
      price: {
				type: Number,
				required: true
      },
      vendor: {
				type: String,
				required: true
      }
		},
		quantity: {
			type: Number,
			required: true
		},
		total_price: {
			type: Number,
			required: true
		}
	}]
}, {
	timestamps: true
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = {Cart};