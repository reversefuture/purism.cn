const express = require('express');
const router = express.Router();
const user = require('../middlewares/user')
const auth = require('../middlewares/authenticate')

router.get('/:name', user.getOne)

router.post('/', user.create)

router.delete('/:name',  auth.validate,function(req, res, next){
    if (!res.locals.decoded.aud) {
        req.session.err = "请登录";
        return res.redirect('/login');
    }
    next()
}, user.delete)



module.exports = router;
