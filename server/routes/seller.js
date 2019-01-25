const router = require('express').Router();
const Product = require('../models/product');
const checkJWT = require('../middleware/check-jwt');
const faker = require('faker');

router.route('/products')
    .get(checkJWT, (req, res, next) =>{
        Product.find({owner: req.decoded.user._id})
            .populate('owner')
            .populate('category')
            .deepPopulate('reviews.owner')
            .exec((err, products) =>{
                if(err) next(err);
                if(products.length > 0){
                    res.json({
                        success: true,
                        message: 'Successfully retrieve products!!!',
                        products: products
                    });
                }else{
                    res.send({
                        success: false,
                        message: 'Empty Product!!!',
                    });
                }
            });
    })
    .post( checkJWT, (req, res, next) =>{
        let product = new Product();

        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title  = req.body.title;
        product.price = req.body.price;
        product.image = faker.image.image();
        product.description = req.body.description;

        Product.find({}, (err, products) =>{
            if(products.length > 0){
                if(products.find( p => p.title == req.body.title)){
                    res.json({
                        success: false,
                        message: 'product of this title already exist!!'
                    });
                }else{
                    product.save();
                    res.json({
                        success: true,
                        message: 'Successfully added product!!'
                    });
                }
            }else{
                product.save();
                res.json({
                    success: true,
                    message: 'Successfully added product!!'
                });
            }
        });
        
    });

    module.exports = router;