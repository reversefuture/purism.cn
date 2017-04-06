var express = require('express'); //调用express模块
var router = express.Router();  //调用模块的Router方法

//登出只需要清空session的user属性即可
router.get('/', function (req, res, next) {
    // req.session.user = null;
/*    var cookie = req.cookies;
    //console.log('logout cookie: ');
    //console.dir(cookie);
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, '', {expires: new Date(0)});
    }*/

    req.session.destroy(function (err) {
        res.redirect('/login'); //Inside a callback… bulletproof!
    });

})
module.exports = router;