var express = require('express');
var router = express.Router();

// Require controller modules.
var product_controller = require('../controllers/productController');
var catalog_controller = require('../controllers/categoryController');
var auth_controller = require('../controllers/authenticateController');

//catalog/....

// GET catalog home page.
router.get('/', product_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display boardgames (uses id).
router.get('/boardgames/create', product_controller.product_create_get);

// POST request for creating boardgames.
router.post('/boardgames/create', product_controller.product_create_post);

// GET request to delete boardgames.
router.get('/boardgames/:id/delete', product_controller.product_delete_get);

// POST request to delete boardgames.
router.post('/boardgames/:id/delete', product_controller.product_delete_post);

// GET request to update boardgames.
router.get('/boardgames/:id/update', product_controller.product_update_get);

// POST request to update boardgames.
router.post('/boardgames/:id/update', product_controller.product_update_post);

// GET request for one boardgames.
router.get('/boardgames/:id', product_controller.product_detail);

// GET request for list of all boardgames items.
router.get('/boardgames', product_controller.product_list);

/// CATEGORY ROUTES ///

// GET request for creating a Category.
router.get('/category/create', catalog_controller.category_create_get);

//POST request for creating Category.
router.post('/category/create', catalog_controller.category_create_post);

// GET request to delete Category.
router.get('/category/:id/delete', catalog_controller.category_delete_get);

// POST request to delete Category.
router.post('/category/:id/delete', catalog_controller.category_delete_post);

// GET request to update Category.
router.get('/category/:id/update', catalog_controller.category_update_get);

// POST request to update Category.
router.post('/category/:id/update', catalog_controller.category_update_post);

// GET request for one Category.
router.get('/category/:id', catalog_controller.category_detail);

// GET request for list of all Category.
router.get('/category', catalog_controller.category_list);

/// LOGIN ROUTES ///

// GET request for Login.
router.get('/login', auth_controller.index);

//GET request for Logout.
router.get('/logout', auth_controller.logout);

/// FAQ ///
router.get('/faq', function(req, res) {
    res.render('faq');
});

module.exports = router;