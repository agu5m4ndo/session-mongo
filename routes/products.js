const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getOneProduct,
    postProduct,
    deleteProduct
} = require('../controllers/products')

router.route('/').get(getAllProducts).post(postProduct);
router.route('/:id').get(getOneProduct).delete(deleteProduct);

module.exports = router;