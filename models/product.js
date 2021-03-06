// models/recipe.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {type: String, default: null},
  description: {type: String, default: null},
  package_contents: {type: String, default: null},
  image_url: {type: String, default: null},
  price: {type: String, default: null},
  likes: {type: String, default: null},
  posts: {type: String, default: null},
  friends: {type: String, default: null}
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

//Get all products
module.exports.getProducts = function(callback, limit){
  Product.find(callback).limit(limit);
}

//finds Activity by the Id
module.exports.getProductById = function(id, callback){
  Product.findById(id, callback);
}

//Creates a new activity
module.exports.createProduct = function(product, callback){
  Product.create(product, callback);
}

module.exports.updateProduct = function(id, product, options, callback) {
  let query = {_id: id};
  let update = {
    title: req.body.title,
    description: req.body.description,
    package_contents: req.body.package_contents,
    image_url: req.body.image_url,
    price: req.body.price,
    likes: req.body.likes,
    posts: req.body.posts,
    friends: req.body.friends
  }
  Product.findOneAndUpdate(query, update, options, callback);
}


//updates activity.
module.exports.updateProductReviews = function(id, product, options, callback){
  var query = {_id: id};
  var update = {
    reviews: {
      name: product.reviews.name,
      rating: product.reviews.rating,
      review: product.reviews.review
    }
  }
  Product.findOneAndUpdate(query, update, options, callback);
}

module.exports.deleteProduct = function(id, callback){
  var query = {_id: id}
  Product.remove(query, callback);
}
