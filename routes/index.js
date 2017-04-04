var express = require('express'); //调用express
var router = express.Router();  //生成express的Router方法的一个实例

//处理函数
router.get('/', function (req, res, next) {  //捕获根url
    console.log('index sess: ');
    console.dir(req.session);
    res.render('index', {
        user: function () { //user将读取session的属性，然后给予不同的返回值
            if (req.session.user)
                return req.session.user;
            else
                return null;
        }
    });
    //res.render方法渲染一个引擎模板，
    //第二个参数是一个对象，对象里的变量可以在引擎中使用，
    //第三个参数是回调函数，提供两个参数，分别是err和html，err是错误，html是渲染后的页面。如果使用这个回调函数，那么将不会自动响应，即要用户自己写返回html的命令
});

module.exports = router;