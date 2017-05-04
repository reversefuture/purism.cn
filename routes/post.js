const express = require('express'); //调用express模块
const router = express.Router();  //调用模块的Router方法
const Blog =require('../models/blog')
const auth = require('../middlewares/authenticate')

/*function BlogSubmit(user) {
    this.user = user.name;
    this.text = user.text;
    this.time = new Date().Format("yyyy-MM-dd HH:mm:ss");
}*/

router.post('/', auth.validate, function (req, res, next) {
    if (!req.decoded.aud) {
        req.session.err = "请登录";
        return res.redirect('/login');
    }

    let blog = new Blog(req.body.user, req.body.text)
    if(!blog.user){
        return res.send({
            code: 400,
            data: "User name is null!"
        })
    }
    if(!blog.text){
        return res.send({
            code: 400,
            data: "Blog content is null!"
        })
    }

    blog.save()
        .then((result) => {
            return res.send({
                code: 200,
                data: "Blog post succeed!"
            })
        })
        .catch((err) => {
            return res.send({
                code: 500,
                data: err
            })
        })
})

module.exports = router;