var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 100},
    description: {type: String, required: true},
    category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true}
  }
);

// Virtual for author's URL
ProductSchema
.virtual('url')
.get(function () {
  return '/catalog/product/' + this._id;
});

//Export model
module.exports = mongoose.model('Product', ProductSchema);