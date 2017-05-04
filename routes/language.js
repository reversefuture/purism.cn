var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {  //捕获根url

    if (!('language' in req.session) || req.session.language === 'zh_cn')
        req.session.language = 'eng';
    else
        req.session.language = 'zh_cn';

    res.redirect(req.headers.referer);
});

module.exports = router;
