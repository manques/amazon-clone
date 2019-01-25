const router = require('express').Router();
const async = require('async');
const stripe = require('stripe')('sk_test_VOMKD4wRvY6K2gUo2ia06dyx');

const checkJWT = require('../middleware/check-jwt');
const Category = require('../models/category');
const Product = require('../models/product');
const Review = require('../models/review');
const Order = require('../models/order');

router.route('/categories')
    .get((req, res, next) =>{
        Category.find({}, (err, categories) =>{
            if(err) next(err);
            if((categories.length > 0)){
                res.send({
                    success: true,
                    message: 'Successfully retrieve all categories!!',
                    categories: categories
                });
            }else{
                res.send({
                    success: false,
                    message: 'Empty Categories!!!'
                });
            }
        });
    })
    .post(checkJWT, (req, res, next) =>{
        let category = new Category();
        
        if(req.body.name){
            Category.find({}, (err, existingCategory) =>{
                
                if(err) next(err);
                if(existingCategory.length > 0){
                    
                    if(existingCategory.find( cate => req.body.name === cate.name)){
                        
                        res.json({
                            success: false,
                            message: 'Category already exist!!!'
                        });
                    }else{
                        category.name = req.body.name;
                        category.save();
                        res.json({
                            success: true,
                            message: 'Successfully add Category!!'
                        });
                    }
                }else{
                    category.name = req.body.name;
                    category.save();
                    res.json({
                        success: true,
                        message: 'Successfully add Category!!'
                    });
                }
            });
        }else{
            res.json({
                success: false,
                message: 'Empty Name String!!'
            });
        }
    });

// products by category
    router.route('/categories/:id')
        .get( (req, res, next) =>{
            const perPage = 1;
            let page = req.query.page || 0;
            async.parallel([
                function(callback){
                    Product.countDocuments({ category: req.params.id}, (err, totalProducts)=>{
                        callback(err, totalProducts);
                    });
                },
                function(callback){
                    Product.find({ category: req.params.id })
                        .skip(perPage*page)
                        .limit(perPage)
                        .populate('category')
                        .populate('owner')
                        .populate('reviews.owner')
                        .exec( (err, products) =>{
                            callback(err, products);
                        });
                },
                function(callback){
                    Category.findOne( { _id: req.params.id }, (err, category) =>{
                        callback(err, category);
                    });
                }
            ],function(err, results){
                let totalProducts = results[0];
                let products = results[1];
                let category = results[2];
                res.json({
                    success: true,
                    message: 'Successfully retrieve products!!!',
                    totalProducts: totalProducts,
                    categoryName: category.name,
                    products: products,
                    pages: Math.ceil(totalProducts / perPage)
                });
            });

        });


        router.route('/products')
            .get( (req, res, next) =>{
                let perPage = 8;
                let page = req.query.page;
                async.parallel([
                    function(callback){
                        Product.find({})
                        .skip(perPage * page)
                        .limit(perPage)
                        .populate('category')
                        .populate('owner')
                        .deepPopulate('reviews.owner')
                        .exec( (err, products) =>{
                            callback(err, products);
                        });
                    },
                    function(callback){
                        Product.countDocuments({}, (err, totalProducts) =>{
                            callback(err, totalProducts);
                        });
                    }
                ], function(err, results){
                    let products = results[0];
                    let totalProducts  = results[1];
                    res.json({
                        success: true,
                        message: 'Retrieve Products!!!',
                        products: products,
                        totalProducts: totalProducts,
                        pages: Math.ceil( totalProducts / perPage )
                    });
                });
            });

            router.route('/product/:id')
                .get( (req, res, next) =>{
                    Product.findOne({ _id: req.params.id})
                    .populate('category')
                    .populate('owner')
                    .deepPopulate('reviews.owner')
                    .exec( (err, product) =>{
                        res.json({
                            success: true,
                            message: 'info retrieve!!!',
                            product: product
                        });
                    });
                });
    //  Review 

    router.route('/review')
        .post( checkJWT, (req, res, next) =>{
            async.waterfall([ 
            function(callback) {
                Product.findOne({_id: req.body.productId}, (err, product) =>{
                    if(err) next(err);
                    callback(err, product);
                });
            }, function(product){
                let review = new Review();
                review.owner = req.decoded.user._id;

               if(req.body.title) review.title = req.body.title;
               if(req.body.comment) review.comment = req.body.comment;
               review.rating = req.body.rating;
               product.reviews.push(review._id);
                
                product.save();

                review.save();
                
                res.send({
                    success: true,
                    message:  'successfully added review for this product!!!'
                });
            }]);
        });

       

        router.route('/payment')
            .post(checkJWT, (req, res, next) =>{
                const currentCharges = Math.round(req.body.totalPrice * 100);
                const stripeToken = req.body.stripeToken; 
                stripe.customers.create({
                    source: stripeToken.id
                }).then( function(customer){
                    return stripe.charges.create({
                        amount: currentCharges,
                        currency: 'inr',
                        customer: customer.id
                    });
                }).then( function(charge){
                    let order = new Order();

                    order.owner = req.decoded.user._id;
                    order.totalPrice = currentCharges;
                    let  products = req.body.products;
                    products.map( (item) =>{
                        order.products.push({
                            product: item.productId,
                            quanttity: item.quantity
                        });
                    });
                    order.save();
                    res.json({
                        success: true,
                        message: 'Successfully!!!'
                    });
                });
            });
module.exports = router;