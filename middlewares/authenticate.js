var express = require('express'); //调用express
var router = express.Router();  //生成express的Router方法的一个实例
var jwt = require('jsonwebtoken');
var User = require('../models/user');   // 调用刚才封装好的user类
var crypto = require("crypto");

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.use(function(req, res, next) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password, 'utf-8').digest('base64');
    var user = new User({
        name: req.body.name
    });
    // find the user
    user.get(function (err, user) {
        if (err) throw err;

        if (!user) {
            res.json({success: false, message: 'Authentication failed. User not found.'});
            next();
        } else if (user) {

            // check if password matches
            if (user.password != password) {
                res.json({success: false, message: 'Authentication failed. Wrong password.'});
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, req.app.settings.secret, {
                    expiresIn : 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });

});

module.exports = router;