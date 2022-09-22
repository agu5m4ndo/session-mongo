const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getOneProduct,
    postProduct,
    deleteProduct
} = require('../controllers/products');
const { auth } = require('../middleware/auth');

router.route('/').get(auth, getAllProducts).post(auth, postProduct);
router.route('/:id').get(auth, getOneProduct).delete(auth, deleteProduct);

module.exports = router;