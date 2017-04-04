function internation() {

}

internation.prototype.languagePacks = {
    zh_cn: {
        index: {
            title: "我的博客",
            description: "这个是基于Nodejs作为后台，jade作为模板来，使用了Express作为框架",
            login: "登录",
            regNow: "立即注册",
            submit: "提交微博",
            emptyInput: "清空"
        },
        layout: {
            title: "MyBlog By qq20004604",
            topTitle: "MyBlog",
            indexButton: "首页",
            logout: "登出",
            login: "登入",
            reg: "注册",
            language: "切换语言",
            foot: "作者：王冬　　　QQ:20004604"
        },
        message: {
            reg_success: "注册成功！",
            reg_fail: "注册失败！",
            login_success: "登录成功！",
            login_fail: "登录失败",
            errorName: "用户名不存在",
            errorPW: "密码错误！"
        }
    },
    eng: {
        index: {
            title: "My blog",
            description: "I use NodeJS, Express, and MySQL to design this site.",
            login: "Login",
            regNow: "Reg",
            submit: "Submit",
            emptyInput: "Clear"
        },
        layout: {
            title: "MyBlog By qq20004604",
            topTitle: "MyBlog",
            indexButton: "Index",
            logout: "Logout",
            login: "Login",
            reg: "Reg",
            language: "Language",
            foot: "I'm WangDong, you can contact me with QQ:20004604"
        },
        message: {
            reg_success: "Reg Success！",
            reg_fail: "Reg Failed！",
            login_success: "Login Success！",
            login_fail: "Login Failed!",
            errorName: "The username is not exists.",
            errorPW: "Error Password!"
        }
    }
}

//如果有语言设置，则设置为对应的语言，否则，设置为中文；
internation.prototype.getPacks = function (setting) {
    if (!setting) {
        return this.languagePacks["zh_cn"]
    }
    if (setting in this.languagePacks) {
        return this.languagePacks[setting];
    } else {
        return this.languagePacks["zh_cn"]
    }
}

internation.prototype.set = function (app) {
    var self = this;
    app.use(function (req, res, next) {
        //这个是示例，定义一个动态视图助手变量

        //如果有语言设置，则设置为对应的语言，否则，设置为中文；
        //console.dir(req.session.language + '-------model lan');
        res.locals = self.getPacks(req.session.language);

        /*if(req.session.isVisit) {
            req.session.isVisit++;
            // res.send('<p>第 ' + req.session.isVisit + '次来此页面</p>');
        } else {
            req.session.isVisit = 1;
            // res.send("欢迎第一次来这里");
            // console.dir(req.session);
        }
        if(!req.session.user) {
            // req.session.user = req.cookie.user;
            console.log('in lan middle, no session.user');
        }else{
            console.dir(req.session.user);
        }*/

        //下面两个因为要调用req和res，所以特殊设置
        res.locals.user = function () {
            if ('session' in req && 'user' in req.session){
                console.dir(req.session.user);
                return req.session.user;
            }
            else{
                console.log('in lan middle, no session.user');
                return null;
            }

        };

        //这里不能用error这个变量名
        res.locals.err = function () {
            //如果session不存在，或者session中没有err属性
            if (!'session' in req || !'err' in req.session)
                return null;    //返回空
            //否则返回err，并将session中的err重置为空（因此只返回一次）
            var err = req.session.err;
            req.session.err = null;
            return err;
        };

        //注册成功的提示
        res.locals.success = function () {
            //原理同err
            if (!'session' in req || !'success' in req.session)
                return null;
            var success = req.session.success;
            req.session.success = null;
            return success;
        }
        next();
    })
}


module.exports = internation;