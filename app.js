const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const swig = require('swig');
const helmet = require('helmet');
const config = require('./config');
const session = require('express-session');

const app = express();
const auth = require('./middlewares/authenticate')
const login = require('./routes/login')
const index = require('./routes/index')
const language = require('./middlewares/language')
const lan = require('./routes/language')
const reg = require('./routes/reg')
const blogs = require('./routes/blogs')
const blog = require('./routes/blog')
const users = require('./routes/users')
const user = require('./routes/user')
const changePwd = require('./routes/changePwd')
const logout = require('./routes/logout')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.settings.secret = "This website rocks!"
app.use(helmet());  //safe http header

app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

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

app.post('/authenticate', auth.authenticate)
app.use('/login', login)
app.use('/', index)
app.use('/language', lan)
app.use('/reg', reg);
app.use('/blogs', blogs);
app.use('/blog', blog);
app.use('/users', users)
app.use('/user', user)
app.use('/changePwd', changePwd)
app.use('/logout', logout);

// app.all('/api/v1/*', [require('./middlewares/validateRequest')]);

app.use('/api', require('./routes/api'));

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
