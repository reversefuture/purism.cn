$(document).ready(function () {
    //根据url，设置高亮
    if (window.location.pathname === '/') {
        $(".nav-collapse .nav li:first-child").addClass("active");
    }
    else if (window.location.pathname === '/login') {
        $(".nav-collapse .nav li:nth-child(2)").addClass("active");
    }
    else if (window.location.pathname === '/reg') {
        $(".nav-collapse .nav li:nth-child(3)").addClass("active");
    }
})