const _ = require('lodash');

const { Cart } = require('../models/cart');
const { Item } = require('../models/item');

const cartInfo = async (req, res) => {
	try {
		const carts = await Cart.find({user: req.user._id})
			.select('-user -_id -createdAt -updatedAt');

		res.status(200).send({
			status: "success",
	    data: carts.length > 0 ? carts : 'Your cart is empty',
		});

	} catch (error) {
    const errorMessage = error ? error.message : "Oops! Error fetching cart from database";
    res.status(400).send({
      status: "error",
      data: errorMessage
    });
	}
};

const addToCart = async (req, res) => {
	try {
		const cartAvailability = await Cart.find({user: req.user._id});
		let newItem;
		if( req.body.item ) {
		  const body = _.pick(req.body, ['item', 'quantity']);
		  const quantity = parseInt(body.quantity);
			const item = await Item.findById(body.item);
			if (item === null) {
				throw new Error("Oops! Invalid product ID");
			}
			const totalPrice = item.price * quantity;
			newItem = {
	    	item: {
	    		item_id: body.item,
	        name: item.name,
	        price: item.price,
	        vendor: item.vendor
	    	},
	    	quantity,
	    	total_price: totalPrice
	    }
		} else {
			newItem = [];
			for (let i = 0; i < req.body.length; i++ ) {
			  const quantity = parseInt(req.body[i].quantity);
				const item = await Item.findById(req.body[i].item);
				if (item === null) {
					throw new Error("Oops! Invalid product ID");
				}
				const totalPrice = item.price * quantity;
				newItem.push({
		    	item: {
		    		item_id: req.body[i].item,
		        name: item.name,
		        price: item.price,
		        vendor: item.vendor
		    	},
		    	quantity,
		    	total_price: totalPrice
				});
			};
		}

		if(cartAvailability.length > 0) {
 				await Cart.findByIdAndUpdate(
 					cartAvailability[0]._id,
	 				{$push: { items: newItem }},
          {useFindAndModify: false, new: true}
	 			).then((cart) => {
			    	res.status(201).send({
							status: "success",
					    data: cart,
						});
        })
		} else {	
	    const cart = new Cart({
	    	user: req.user._id,
	    	items: newItem
	    });
	    await cart.save().then(result => {
	    	res.status(201).send({
					status: "success",
			    data: result,
				});
	    });
		}

	} catch (error) {
    const errorMessage = error ? error.message : "Oops! Error adding item to cart";
    res.status(400).send({
      status: "error",
      data: errorMessage
    });
	}
};

const removeFromCart = async (req, res) => {
	try {
		const item = req.body.item;
		const cartAvailability = await Cart.find({user: req.user._id});
		if(cartAvailability.length > 0) {
			const itemAvailableInCart = await Cart.find( { "items.item.item_id": item } );
			if(itemAvailableInCart.length  === 0) {
				throw new Error("Oops! Item not found in the cart");
			}
			await Cart.findByIdAndUpdate(
				cartAvailability[0]._id,
 				{ $pull: { items: { "item.item_id": item } } },
        { useFindAndModify: false, new: true }
 			).then((cart) => {
		    	res.status(200).send({
						status: "success",
				    data: cart,
					});
      })
		}
	} catch (error) {
    const errorMessage = error ? error.message : "Oops! Error removing item from cart";
    res.status(400).send({
      status: "error",
      data: errorMessage
    });
	}

};

module.exports = { cartInfo, addToCart, removeFromCart }