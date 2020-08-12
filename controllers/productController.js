var Product = require('../models/product');
var Category = require('../models/category');

var async = require('async');

exports.index = function(req, res) {
    async.parallel({
        product_count: function(callback) {
            Product.countDocuments({}, callback);
        },
        category_count: function(callback) {
            Category.countDocuments({}, callback);
        }
    }, function (err, results) {
        res.render('index', {error: err, data: results});
    });
};

// Display list of all books.
exports.product_list = function(req, res, next) {
    Product.find({}, "name description")
      .exec(function (err, list_products) {
        if (err) { return next(err); }
        //Successful, so render
        console.log(list_products);
        res.render('product_list', { title: 'Board Games List', product_list: list_products, });
      });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};