var Product = require('../models/product');
var Category = require('../models/category');
const expressValidator = require("express-validator");

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
        res.render('product_list', { title: 'Board Games List', product_list: list_products});
      });
};

// Display detail page for a specific book.
exports.product_detail = function(req, res, next) {
    async.parallel({
        boardgame: function(callback) {
            Product.findById(req.params.id)
              .populate('category')
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.boardgame === null) { 
            var err = new Error('boardgame not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('product_detail', { 
            name: results.boardgame.name, 
            description: results.boardgame.description, 
            category: results.boardgame.category, 
            price: results.boardgame.price, 
            stock:results.boardgame.stock,
            url: results.boardgame.url } );
    });
};

// Display book create form on GET.
exports.product_create_get = function(req, res) {
    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        categories: function(callback) {
            Category.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('product_form', { title: 'Create Board Games ', 
        categories: results.categories });
    });
};

// Handle book create on POST.
exports.product_create_post = [
    // Convert the category to an array.
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category==='undefined')
            req.body.genre=[];
            else
            req.body.category=new Array(req.body.category);
        }
        next();
    },

    // Validate fields.
    expressValidator.body('name', 'Name must not be empty.').trim().isLength({ min: 1 }),
    expressValidator.body('description', 'Description must not be empty.').trim().isLength({ min: 1 }),
    expressValidator.body('price', 'Price should be a whole number and cannot be negative').trim().isInt({ min: 0 }),
    expressValidator.body('stock', 'Stock should be a whole number and cannot be negative').trim().isInt({ min: 0 }),
  
    // Sanitize fields (using wildcard).
    expressValidator.sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = expressValidator.validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var boardgame = new Product(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                categories: function(callback) {
                    Category.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.categories.length; i++) {
                    if (boardgame.category.indexOf(results.categories[i]._id) > -1) {
                        results.categories[i].checked='true';
                    }
                }
                res.render('product_form', { 
                    title: 'Create Book',
                    categories: results.categories, 
                    boardgame: boardgame, 
                    errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            boardgame.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(boardgame.url);
                });
        }
    }
];

// Display book delete form on GET.
exports.product_delete_get = function(req, res) {
    async.parallel({
        boardgame: function(callback) {
            Product.findById(req.params.id).exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.boardgame==null) { // No results.
            res.redirect('/catalog/boardgames');
        }
        // Successful, so render.
        res.render('product_delete', { 
        title: 'Delete BoardGame', 
        boardgame: results.boardgame } );
    });
};

// Handle book delete on POST.
exports.product_delete_post = function(req, res) {
    async.parallel({
        boardgame: function(callback) {
            Product.findById(req.body.id).exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        
        console.log(req.body.id);
        Product.findByIdAndRemove(req.body.id, function deleteBoardGame(err) {
            if (err) { return next(err); }
            // Success - got to boardgame list.
            res.redirect('/catalog/boardgames');
        });

    });
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};