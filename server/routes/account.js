const router = require('express').Router();
const checkJWT = require('../middleware/check-jwt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');

router.route('/signup')
    .post((req, res, next) =>{
        let user  = new User();

        user.email = req.body.email;
        user.name = req.body.name;
        user.password = req.body.password;
        user.picture = user.gravatar();
        user.isSeller = req.body.isSeller;
        User.findOne({ email: req.body.email }, (err, existingUser) =>{
            if(existingUser){
                res.json({
                    success: false,
                    message: 'email is already exist account'
                });
            }else{
                user.save();
                let token = jwt.sign({ user: user }, config.secret, { expiresIn: '7d'});
                res.json({
                    success: true,
                    message: 'Register successfull!!',
                    token: token
                });
            }
        });
    });

    router.route('/login')
        .post( (req, res, next) =>{
            User.findOne({ email: req.body.email }, (err, user) =>{ 
                if(err) throw err;
                if(!user){
                    res.json({
                        success: false,
                        message: 'Email does not exist!!'
                    });
                }else if(user){
                    let validPassword = user.comparePassword(req.body.password);
                    if(!validPassword){
                        res.json({
                            success: false,
                            message: 'Wrong Password!!'
                        });
                    }else{
                        const token  = jwt.sign({ user: user }, config.secret, { expiresIn: '7d'});
                        res.json({
                            success: true,
                            message: 'Successfully login!!',
                            token: token
                        });
                    }
                }
            });
        });

        router.route('/profile')
        .get( checkJWT, (req, res, next) =>{
            User.findOne({ _id: req.decoded.user._id}, (err, user) =>{
                if(err) next(err);
                if(user){
                    res.json({
                        success: true,
                        message: 'Successfully get profile!!',
                        user: user
                    });
                }
            });
        })
        .post(checkJWT, (req, res, next) =>{
            User.findOne({ _id: req.decoded.user._id }, (err, user) =>{
                if(err) next(err);
                if(user){
                    if(req.body.name) user.name = req.body.name;
                    if(req.body.email) user.email = req.body.email;
                    if(req.body.password) user.password = req.body.password;
                    user.isSeller = req.body.isSeller;
                    user.save();
                    res.send({
                        success: true,
                        message: 'Update Successfull!!'
                    });
                }
            });
        });

        router.route('/address')
            .get(checkJWT, (req, res, next) =>{
                User.findOne({ _id: req.decoded.user._id}, (err, user) =>{
                    if(err) next(err);
                    if(user.address){
                        res.send({
                            success: true,
                            message: 'Success retrieve address!!!',
                            address: user.address
                        });
                    }else{
                        res.send({
                            success: false,
                            message: 'Empty Address!!!'
                        });
                    }
                });
            })
            .post(checkJWT, (req, res, next) =>{
                User.findOne({ _id: req.decoded.user._id}, (err, user)=>{
                    if(err) next(err);
                    if(user){
                        if(req.body.add1) user.address.add1 = req.body.add1;
                        if(req.body.add2) user.address.add2 = req.body.add2;
                        if(req.body.city) user.address.city = req.body.city;
                        if(req.body.state) user.address.state = req.body.state;
                        if(req.body.country) user.address.country = req.body.country;
                        if(req.body.postalCode) user.address.postalCode = req.body.postalCode;

                        user.save();
                        res.send({
                            success: true,
                            message: 'Successfully Update Address!!',
                        });
                    }
                });
            });

module.exports = router;