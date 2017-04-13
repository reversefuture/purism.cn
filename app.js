var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var swig = require('swig');
var helmet = require('helmet');
var config = require('./config');

var index = require('./routes/index');
var users = require('./routes/users');
var reg = require('./routes/reg');
var login = require('./routes/login');
var lan = require('./routes/language');
var logout = require('./routes/logout');
var postBlog = require('./routes/post');
var changePwd = require('./routes/changePwd');
// var authentiate = require('./middlewares/authenticate');
var language = require('./models/language');    //多语言
var verifyToken = require('./middlewares/verifyToken');
var app = express();

/*// middle ware test
app.use(function( req, res, next) {
    res.locals.testUser = testUser(req, res);
    //console.log('!!!!!! middle ware test');
    next();
});

function testUser(req, res) {
    return res.locals.testUser = {name: 'eirc', age: 22};
}*/

app.use(helmet());  //safe http header
// app.disable('x-powered-by');    //禁用 X-Powered-By 头,helmet已经禁用

app.settings.secret = config.secret;

app.use(session({
    secret: 'recommend 128 bytes random string',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600 * 1000,
        // secure: true
    }
}))

var internation = new language();
internation.set(app);

//路由的处理
app.use('/login', checkNotLogin);
app.use('/reg', checkNotLogin);
//必须在已登录情况下才能访问
app.use('/logout', checkLogin);
//未登录检测（已登录情况下执行）
function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.session.err = "已登录，请不要重复登录";
        return res.redirect('/');
    }
    next();
}
//已登录检测（未登录情况下执行）
function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.session.err = "你还没有登录，请登录";
        return res.redirect('/login');
    }
    next();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
swig = require('swig'),
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
// app.use('/authentiate', authentiate);
app.use('/login', login);  //登录的，login来处理
// route middleware to verify a token
verifyToken(app);

app.use('/users', users);
app.use('/reg', reg);    //注册的，reg.js来处理
app.use('/language', lan);  //切换语言的
app.use('/logout', logout);  //登出
app.use('/post', postBlog);  //提交博客
app.use('/loadblog', users);  //用户主页，users来处理
app.use('/changePwd', changePwd);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
