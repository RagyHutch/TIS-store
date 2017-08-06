const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const Product = require('../models/product.js');
const Comment = require('../models/comment.js');
const Friend = require('../models/friends.js');
const Post = require('../models/posts.js');
const Like = require('../models/likes.js');
const Review = require('../models/reviews.js');
const Option = require('../models/options.js')
const ObjectID = require('mongodb').ObjectID;
const json_formatter = require('../methods/json_formatter.js');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));
router.use(express.static(path.join(__dirname, 'public')));

//GET for products/likes/comments/friends/options/posts/ reviews/ and users.
router.get('/products', function(req, res){
  Product.getProducts(function(err, product){
    if(err){
      res.send(err);
    }
    res.send({results: product});
  })
})

//get reviews
router.get('/reviews', function(req, res) {
  Review.find(function(err, review) {
    if(err) {
      res.send(err);
    }
    res.json({results: review});
  })
})

//get options for dropDown list
router.get('/options', function(req, res) {
  Option.find(function(err, option) {
    if(err) res.send(err);
    res.json({results: option});
  })
})

//get likes options
router.get('/likes', function(req, res) {
  Like.find(function(err, like) {
    if(err) res.send(err);
    res.json({results: like});
  })
})

//get posts options
router.get('/posts', function(req, res) {
  Post.find(function(err, post) {
    if(err) res.send(err);
    res.json({results: post});
  })
})

//get friends options
router.get('/friends', function(req, res) {
  Friend.find(function(err, friend) {
    if(err) res.send(err);
    res.json({results: friend});
  })
})


//Michaels custom endpoint!
var json={};

router.get("/options-labels",function(req, res) {
  Option.find(function(err, options){
    Like.find(function(err, like) {
      Post.find(function(err, post) {
        Comment.find(function(err, comment) {
          Friend.find(function(err, friend) {
            json.questions = options;
            json.Likes = like;
            json.Posts = post;
            json.Comments = comment;
            json.Friends = friend;
            console.log(json);

            json_formatter.buildOptionLayout(json, res, function(res, response) {
              res.json({results: response});
            })
          })
        })
      })
    })
  })
})

//Zoes custom endpoint!
var zson = {}
router.get ('/product-reviews',function(req, res) {
  Review.find(function(err, review) {
    Product.find(function(err, product){
      zson.Reviews = review;
      zson.Products = product;
      json_formatter.buildReviewLayout(zson, res, function(res, response) {
        res.json({results: response});
      })
    })
  })
})


//POST routes below for api
router.post('/reviews', function(req, res) {
  let review = req.body;
  console.log(review);
  res.send({review});
})


router.post('/products', function(req, res){
  let product = new Product();
  product.title = req.body.title;
  product.description = req.body.description;
  product.package_contents
   = req.body.package_contents;
  product.image_url = req.body.image_url;
  product.price = req.body.price;
  product.likes = req.body.likes;
  product.posts = req.body.posts;
  product.friends = req.body.friends;
  console.log(product);
  product.save(function(err) {
    res.send({product});
  });
});

//Update Product Information
router.put('/products/:productId', function(req, res){
  Product.findById(req.params.productId, function(err, product) {
    if(err){
      res.send(err);
    }
    product.title = req.body.title;
    product.description = req.body.description;
    product.package_contents = req.body.package_contents;
    product.image_url = req.body.image_url;
    product.price = req.body.price;
    product.likes = req.body.likes;
    product.posts = req.body.posts;
    product.friends = req.body.friends;

    product.save(function(err) {
      if(err) res.send(err);
      res.json({product});
    })
  });
})

//delete function for products
router.delete('/products/:productId', function(req, res){
  Product.remove({_id: req.params.productId}, function(err, product) {
    if(err){
      res.send(err);
    }
    res.json({message: "you just deleted the product with this id: " + req.params.productId});
  });
})





module.exports = router;





//comments practice to understand pull and pushing infor to a remote repo
// router.get('/comments', function(req, res){
//   Comment.getComments(function(err, comment){
//     if(err){
//       res.send(err);
//     }
//     res.json(comment);
//   })
// })
//
// router.post('/comments', function(req, res){
//   var comment = new Comment();
//   comment.author = req.body.author;
//   comment.text = req.body.text;
//
//   comment.save(function(err) {
//     if(err){
//     res.send(err);
//     }
//     res.json({message: 'Comment successfully Added!'});
//   })
// })
//
// router.put('/comments/:commentId', function(req, res){
//   Comment.findById(req.params.commentId, function(err, comment) {
//     if(err){
//       res.send(err);
//     }
//     (req.body.author) ? comment.author = req.body.author : null;
//     (req.body.text) ? comment.text = req.body.text : null;
//     comment.save(function(err) {
//       if(err) res.send(err);
//       res.json({message: 'Comment has been updated'});
//     })
//   });
// })
//
// router.delete('/comments/:commentId', function(req, res) {
//   Comment.remove({_id: req.params.commentId}, function(err, comment) {
//     if(err){
//       res.send(err);
//     }
//     res.json({message: 'Comment has been deleted'})
//   });
// })
//This is the end of the comment practice section.
