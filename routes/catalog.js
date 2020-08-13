var express = require('express');
var router = express.Router();

// Require controller modules.
var product_controller = require('../controllers/productController');
var catalog_controller = require('../controllers/categoryController');

//catalog/....

// GET catalog home page.
router.get('/', product_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/boardgames/create', product_controller.product_create_get);

// POST request for creating Book.
router.post('/boardgames/create', product_controller.product_create_post);

// GET request to delete Book.
router.get('/boardgames/:id/delete', product_controller.product_delete_get);

// POST request to delete Book.
router.post('/boardgames/:id/delete', product_controller.product_delete_post);

// GET request to update Book.
router.get('/boardgames/:id/update', product_controller.product_update_get);

// POST request to update Book.
router.post('/boardgames/:id/update', product_controller.product_update_post);

// GET request for one Book.
router.get('/boardgames/:id', product_controller.product_detail);

// GET request for list of all Book items.
router.get('/boardgames', product_controller.product_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/category/create', catalog_controller.category_create_get);

//POST request for creating Genre.
router.post('/category/create', catalog_controller.category_create_post);

// GET request to delete Genre.
router.get('/category/:id/delete', catalog_controller.category_delete_get);

// POST request to delete Genre.
router.post('/category/:id/delete', catalog_controller.category_delete_post);

// GET request to update Genre.
router.get('/category/:id/update', catalog_controller.category_update_get);

// POST request to update Genre.
router.post('/category/:id/update', catalog_controller.category_update_post);

// GET request for one Genre.
router.get('/category/:id', catalog_controller.category_detail);

// GET request for list of all Genre.
router.get('/category', catalog_controller.category_list);

module.exports = router;