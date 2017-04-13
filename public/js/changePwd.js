$(document).ready(function () {
    var time = 0;   //用于计时
    $("#submit-button").click(function () {
        //获取账号密码
        var name = $("#username").val();
        var oldPwd = $("#password").val();
        var newPwd = $("#password-new").val();
        var repeatPwd = $("#password-repeat").val();

        //未输入账号名
        if (name.length === 0) {
            $("#username").parent().parent().addClass("error");
            $("#usrname-error").removeClass("displayNONE");
            $("#tips").addClass("displayNONE");
            setTimeout(function () {
                $("#username").parent().parent().removeClass("error");
                $("#usrname-error").addClass("displayNONE");
                $("#tips").removeClass("displayNONE");
            }, 2000);
            return;
        }

        //密码为空
        if (oldPwd.length === 0) {
            $("#password").parent().parent().addClass("error");
            $("#pw-error").removeClass("displayNONE");
            setTimeout(function () {
                $("#password").parent().parent().removeClass("error");
                $("#pw-error").addClass("displayNONE");
            }, 2000);
            return;
        }
        //新密码不能和旧密码重复
        if (oldPwd === newPwd) {
            $("#password-new").parent().parent().addClass("error");
            $("#pw-new-error").removeClass("displayNONE");
            setTimeout(function () {
                $("#password-new").parent().parent().removeClass("error");
                $("#pw-new-error").addClass("displayNONE");
            }, 2000);
            return;
        }

        //密码不相同
        if (newPwd !== repeatPwd) {
            $("#pw-rp-error").parent().parent().addClass("error");
            $("#pw-rp-error").removeClass("displayNONE");
            setTimeout(function () {
                $("#pw-rp-error").parent().parent().removeClass("error");
                $("#pw-rp-error").addClass("displayNONE");
            }, 2000);
            return;
        }

        var obj = {
            name: name,
            password: oldPwd,
            newPwd: newPwd
        };
        console.dir(obj);

        //防止连续点击，先禁用提交按钮，防止重复提交
        if (new Date() - time < 3000) {
            return;
        }
        //发起请求前，更新提交时间，
        time = new Date();
        //发起请求，回调内容是一个对象，修改成功会有success，失败会有error属性
        $.post("/changePwd", obj, function (data) {
            if ("error" in data) {
                $("#error-alert").removeClass("displayNONE")
                $("#error-alert").text(data.error);
                $("#error-alert").parent().parent().addClass("error");
                setTimeout(function () {
                    $("#error-alert").addClass("displayNONE");
                    $("#error-alert").parent().parent().removeClass("error");
                }, 2000)
                time = 0;       //修改失败，清空time计时，允许再次提交
            } else if ("success" in data) {
                location.href = data.success;    //注册成功则重定向
            }
        })
    })
})