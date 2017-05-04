var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const fs = require('fs');

function verifyToken(app) {
    app.use(function(req, res, next) {
        //check referer / origin
/*        var ref = req.get('referer');
        if( ref.indexOf('http://localhost:3000') < 0){
            res.end({
                success: false,
                message: 'not from allowed origin'
            });
            return;
        }*/

        // check header or url parameters or post parameters for token
        // var token = req.body.token || req.query.token || req.headers['X-Csrf-Token'] || req.cookies.token;
        var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['authorization'] || req.headers['X-Csrf-Token'];
        console.log('validate.js token: '+token);
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.secret, { algorithms: ['RS256'] }, function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    console.dir(decoded);
                    if (decoded.exp <= Date.now()) {
                        res.status(400);
                        res.json({
                            "status": 400,
                            "message": "Token Expired"
                        });
                        return;
                    }else{
                        req.decoded = decoded;
                        next();
                    }
                }
            });
        } else {    // if there is no token, return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });
}
module.exports = verifyToken;