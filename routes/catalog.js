var express = require('express');
var router = express.Router();

// Require controller modules.
var product_controller = require('../controllers/productController');
var catalog_controller = require('../controllers/categoryController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', product_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/book/create', product_controller.book_create_get);

// POST request for creating Book.
router.post('/book/create', product_controller.book_create_post);

// GET request to delete Book.
router.get('/book/:id/delete', product_controller.book_delete_get);

// POST request to delete Book.
router.post('/book/:id/delete', product_controller.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', product_controller.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', product_controller.book_update_post);

// GET request for one Book.
router.get('/book/:id', product_controller.book_detail);

// GET request for list of all Book items.
router.get('/boardgames', product_controller.product_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', catalog_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', catalog_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', catalog_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', catalog_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', catalog_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', catalog_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', catalog_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', catalog_controller.genre_list);

module.exports = router;