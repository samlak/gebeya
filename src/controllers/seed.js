const {User} = require('../models/user');
const {Item} = require('../models/item');
const {Cart} = require('../models/cart');

const itemData = require("../data/item");
const userData = require("../data/user");
const cartData = require("../data/cart");

const seedToDB = async (req, res) => {
    try {
      await User.deleteMany({}, () => {
        userData.users.forEach((user) => {
          new User(user).save();
        });
      });

      await Item.deleteMany({}, () => {
        itemData.items.forEach((item) => {
          new Item(item).save();
        });
      });

      await Cart.deleteMany({}, () => {
        cartData.carts.forEach((cart) => {
          new Cart(cart).save();
        });
      });
      
      res.status(200).send({
        status: "success",
        data: "Database seeded successfully"
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        data: "Data seeding unsuccessful"
      });
    }
};

module.exports = {seedToDB}