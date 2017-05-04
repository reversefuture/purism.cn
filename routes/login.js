var express = require('express'); //调用express模块
var router = express.Router();  //调用模块的Router方法
var User = require('../models/user');   // 调用刚才封装好的user类
var crypto = require("crypto"); // 这个是加密用，nodejs本身提供
var jwt = require('jsonwebtoken');
const fs = require('fs');
var key = fs.readFileSync('./pem/key.pem', 'utf8');

const user = require('../middlewares/user')
const utils = require('../helpers/util')


router.get('/', function (req, res, next) {
    res.render('login');
});

router.post('/', function (req, res, next) {
    let name = req.body.name
    let password = utils.parseBase64(String(req.body.password))
    let user = new User(name,password);

    user.findOne()
        .then((result) => {
            if (!result) {
                // res.json({success: false, errorName: res.locals.message.errorName});
                res.json({success: false, message: "error name", errorType: 'errorName'});
                next();
            }
            console.log(result.password+ '- ' +  password)
            if (result.password != password) {``
                // res.json({success: false, errorPW: res.locals.message.errorPW });
                res.json({success: false, message: "error password", errorType:'errorPW' });

            } else {
                let payload = {
                    iss: 'purism.cn',
                    sub: 'All users',
                    aud: name,
                    role: result.role,
                    exp: expiresIn(1),
                    language: 'eng'
                }
                jwt.sign(payload, req.app.settings.secret, function (err, token) {
                    res.cookie('token', token, { maxAge: 3600 * 1000 * 24}); //how to set domain, path, secure?
                    req.session.user = user;                    // return the information including token as JSON
                    res.json({
                        success: true,
                        location:'/',
                        token: token
                    });
                });
            }
        })
        .catch((err) => {
            res.json({success: false, message: err });
        })
})

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = router;

