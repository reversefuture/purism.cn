$(document).ready(function () {
    var time = 0;
    var token = '';
    var ramdomNum = getRandomArbitrary(1000000, 9999999);
    $("#submit").click(function () {

        var user = {
            name: $("#username").val(),
            password: $("#password").val(),
            token_secret: ramdomNum
        }

        //禁止用户名、密码为空
        if (user.name.length === 0) {
            $("#name-alert").text("用户名不能为空");
            return;
        } else if (user.password.length === 0) {
            $("#pw-alert").text("密码不能为空");
            return;
        }

        if (new Date() - time < 3000)
            return
        time = new Date();

        //发起ajax请求
        $.post("login", user, function (data) {
            if (data.errorType === "errorName") {
                $("#name-alert").removeClass("displayNONE")
                $("#name-alert").text(data.errorName);
                $("#name-alert").parent().parent().addClass("error");
                setTimeout(function () {
                    $("#name-alert").addClass("displayNONE")
                    $("#name-alert").parent().parent().removeClass("error");
                }, 2000)
                time = 0;
            } else if (data.errorType === "errorPw") {
                $("#pw-alert").removeClass("displayNONE")
                $("#pw-alert").text(data.errorPW);
                $("#pw-alert").parent().parent().addClass("error");
                setTimeout(function () {
                    $("#pw-alert").addClass("displayNONE")
                    $("#pw-alert").parent().parent().removeClass("error");
                }, 2000)
                time = 0;
            } else if (data.success) {
                console.dir(data);
                token = data.token;
                window.location.href = data.location;    //注册成功则重定向
            }
        })
    })
});

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}