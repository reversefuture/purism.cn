const express = require('express');
const router = express.Router();
const blog = require('../middlewares/blog')
const auth = require('../middlewares/authenticate')

router.get('/:id', blog.getById)

router.post('/', auth.validate,function(req, res, next){
    console.dir(res.locals)
    if (!res.locals.decoded.aud) {
        req.session.err = "请登录";
        return res.redirect('/login');
    }
    next()
    },blog.create)

router.delete('/:id', blog.delete)

module.exports = router;
