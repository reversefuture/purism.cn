const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require("crypto");
const utils = require('../helpers/util')

function authenticate(req, res, next) {
    let name = req.body.name
    let password = utils.parseBase64(String(req.body.password))
    let user = new User(name,password);

    user.findOne()
        .then((result) => {
            if (!result) {
                res.json({success: false, message: 'Authentication failed. User not found.'});
                next();
            }
            if (result.password !== password) {
                res.json({success: false, message: 'Authentication failed. Wrong password.'});
            } else {
                let payload = {
                    iss: 'purism.cn',
                    sub: 'All users',
                    aud: name,
                    role: result.role,
                    exp: expiresIn(1)
                }
               jwt.sign(payload, req.app.settings.secret, function (err, token) {
                   console.log(token);
                   res.json({
                       success: true,
                       message: 'Enjoy your token!',
                       token: token +''
                   })
                });
            }
        })
        .catch((err) => {
            res.json({success: false, message: err });
        })

}

function validate(req, res, next) {
    let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-csrf-token'];    //in font end it's: X-Csrf-Token

    if (token) {
        let decoded = jwt.verify(token, req.app.settings.secret);

        //check exp of token
        if (decoded.exp <= Date.now()) {
            res.status(400);
            res.json({
                "status": 400,
                "message": "Token Expired"
            });
            return;
        }

        // Authorize the user to see if he can access our resources
        var user = new User(decoded.aud);

        user.findOne()
            .then((result) => {
                if (!result) {
                    // return res.status(401).send({success: false, msg: ''});
                    res.status(401);
                    res.json({
                        success: false,
                        message: "Authentication failed. User not found."
                    });
                    return;
                }else{
                    //if url with 'admin' and user's role is amdin--> grant
                    //if url without 'admin' and with '/api/v1' --> grant
                    //if url without 'admin' and '/api/v1' --> grant
                    console.dir(result)
                    if ((req.url.indexOf('admin') >= 0 && result.role == 'Admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/v1/') >= 0) ){
                        next();
                    }else if(req.url.indexOf('/api/v1/') < 0){
                        // res.json({success: true, message: 'Welcome in the member area ' + user.name + '!'});
                        res.locals.decoded = decoded;
                        next();
                    } else {
                        res.status(403);
                        res.json({
                            success: false,
                            message: "Not Authorized"
                        });
                        return;
                    }
                }
            })
            .catch ((err) => {
                // throw err;
                res.status(500);
                res.json({
                    "status": 500,
                    "message": "Oops something went wrong",
                    "error": err
                });
            })
    } else {
        return res.status(403).send({success: false, message: 'No token provided.'});
    }
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports.authenticate = authenticate;
module.exports.validate = validate;