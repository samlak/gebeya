const express = require('express');

const { authenticate } = require('../middleware/authenticate');
const { seedToDB } = require('../controllers/seed');
const { allItems, individualItem, addItem, updateItem, deleteItem, uploadImage, multerFunction } = require('../controllers/item');
const { login, register } = require('../controllers/auth');
const { cartInfo, addToCart, removeFromCart } = require('../controllers/cart');

const router = express.Router();

// DATA SEED ROUTE
router.get('/seed',  async (req, res) => {
  await seedToDB(req, res);
});

// ITEMS ROUTE
router.get('/items', authenticate, async (req, res) => {
  await allItems(req, res);
});

router.get('/item/:id',  authenticate, async (req, res) => {
  await individualItem(req, res);
});

router.post('/item/add', authenticate, async (req, res) => {
  await addItem(req, res);
});

router.patch('/item/:id/update', authenticate, async (req, res) => {
  await updateItem(req, res);
});

router.patch('/item/:id/upload', authenticate, multerFunction.single('photo'), async (req, res) => {
  await uploadImage(req, res);
});

router.delete('/item/:id/delete', authenticate, async (req, res) => {
  await deleteItem(req, res);
});

// CART ROUTE
router.get('/cart', authenticate,  async (req, res) => {
  await cartInfo(req, res);
});

router.post('/cart/add', authenticate, async (req, res) => {
  await addToCart(req, res);
});

router.delete('/cart/remove', authenticate, async (req, res) => {
  await removeFromCart(req, res);
});


// AUTHENTICATION ROUTE
router.post('/login',  async (req, res) => {
  await login(req, res);
});

router.post('/register',  async (req, res) => {
  await register(req, res);
});

module.exports = router;