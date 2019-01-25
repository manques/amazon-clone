const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) =>{
    const token = req.headers['authorization'];
    if(token){
        jwt.verify( token, config.secret, (err, decoded) =>{
            if(err){
                res.json({
                    success: false,
                    message: 'Failed to authenticate token!!'
                });
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        res.status(403).json({
            success: false,
            message: 'token is not found!!'
        });
    }
}