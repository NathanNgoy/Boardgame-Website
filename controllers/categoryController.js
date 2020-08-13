var Category = require('../models/category');
var Product = require('../models/product');
var async = require('async');
const expressValidator = require("express-validator");

// Display list of all Genre.
exports.category_list = function(req, res) {
    Category.find({}, "name")
      .exec(function (err, list_categories) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('category_list', { title: 'Categories List', category_list: list_categories});
      });
};

// Display detail page for a specific Genre.
exports.category_detail = function(req, res, next) {
    async.parallel ({
        category: function(callback) { 
            console.log(req.params.id);
            Category.findById(req.params.id)
            .exec(callback);
        }

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.category === null) {
            var err = new Error('boardgame not found');
            err.status = 404;
            return next(err);
        }
        //Successful, so render
        res.render('category_detail', {
            name: results.category.name,
            url: results.category.url
        })
    })
};

// Display Genre create form on GET.
exports.category_create_get = function(req, res) {
        res.render('category_form', { title: 'Create a new Category '});
};

// Handle Genre create on POST.
exports.category_create_post = [
    // validate body field is not empty
    expressValidator.body("name", "Category name required").trim().isLength({ min: 1 }),
  
    // sanitize (escape) fields
    expressValidator.sanitizeBody("*").escape(),
  
    // process request afetr validationa nd sanitization
    (req, res, next) => {
      // extract validation errors from request
      const errors = expressValidator.validationResult(req);
  
      // create a category object with escaped and trimmed data
      const category = new Category({
        name: req.body.name
      });
  
      if (!errors.isEmpty()) {
        // there are errors, render form again with sanitized values/ error messages
        res.render("category_form", {
          title: "Create Category",
          category: category,
          errors: errors.array(),
        });
        return;
      } else {
        // data from form is valid
        // check is Category with same name already exists
        Category.findOne({ name: req.body.name }).exec(function (
          err,
          found_category
        ) {
          if (err) {
            return next(err);
          }
          if (found_category) {
            // Category exists, redirect to its detail page
            res.redirect(found_category.url);
          } else {
            category.save(function (err) {
              if (err) {
                return next(err);
              }
              // category saved, redirect to category detail page
              res.redirect(category.url);
            });
          }
        });
      }
    },
  ];
  

// Display Genre delete form on GET.
exports.category_delete_get = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            console.log(req.params.id);
            Category.findById(req.params.id).exec(callback);
        },
        categories_boardgames: function(callback) {
            Product.find({ 'category': req.params.id }).exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.category==null) { // No results.
            res.redirect('/catalog/category');
        }
        //Success
        res.render('category_delete', { 
        title: 'Delete Category', 
        category: results.category,
        category_boardgames: results.categories_boardgames } );
    })
};

// Handle Genre delete on POST.
exports.category_delete_post = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.body.id).exec(callback);
        },
        categories_boardgames: function(callback) {
            Product.find({ category: req.body.id }).exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        
        if (results.categories_boardgames.length > 0) {
            // Category has boardgames. Render in same way as for GET route.
            res.render("category_delete", {
              title: "Delete Category",
              category: results.category,
              category_boardgames: results.categories_boardgames,
            });
            return;
          } else {
            // Category has no boardgame. Delete object and redirect to the list of categories.
            Category.findByIdAndRemove(req.body.id, function deleteCategory(err) {
              if (err) { return next(err); }
              // Success - go to category list
              res.redirect("/catalog/category");
            });
          }
    });
};

// Display Genre update form on GET.
exports.category_update_get = function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) { return next(err); }
        if (category==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('category_form', { title: 'Update Genre', category: category });
    });
};

// Handle Genre update on POST.
exports.category_update_post = [
   
    // Validate that the name field is not empty.
    expressValidator.body('name', 'Category name required').isLength({ min: 1 }).trim(),
    
    expressValidator.sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        const errors = expressValidator.validationResult(req);

        var category = new Category(
          {
          name: req.body.name,
          _id: req.params.id
          }
        );

        if (!errors.isEmpty()) {
            res.render('category_form', { 
                title: 'Update category', 
                category: category, 
                errors: errors.array()});
            return;
        } else {
            // Data from form is valid. Update the record.
            Category.findByIdAndUpdate(req.params.id, category, {}, function (err, thecategory) {
                if (err) { return next(err); }
                   // Successful - redirect to genre detail page.
                   res.redirect(thecategory.url);
                });
        }
    }
];