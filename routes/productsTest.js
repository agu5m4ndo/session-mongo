const express = require('express');
const productosTest = express.Router();
const testView = express.Router();
const { testAPI, showView } = require('../controllers/productTest');

productosTest.route('/').get(testAPI);
testView.route('/').get(showView);


module.exports = {
    productosTest,
    testView
};