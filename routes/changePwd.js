var express = require('express'); // 调用express模块
var router = express.Router();  // 调用模块的Router方法
const user = require('../middlewares/user')
const auth = require('../middlewares/authenticate')


router.get('/', function (req, res, next) {
    res.render('changePwd')
});

router.put('/',  auth.validate
    ,function(req, res, next){
        if (!res.locals.decoded.aud) {
            req.session.err = "请登录";
            return res.redirect('/login');
        }
        next()
    }
    , user.update
    , function (req, res) {
        let response = res.locals.update
        console.log(response)
        response.success = '/login'
        console.log(response)
        res.send(response)
    }

)

module.exports = router;