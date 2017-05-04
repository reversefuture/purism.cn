const crypto =require('crypto');

let utils = {
    parseBase64: (string) => {
        let md5 = crypto.createHash('md5');
        return String(md5.update(string, 'utf-8').digest('base64'));
    }
}

Date.prototype.Format = function (fmt) { 
    var obj = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3), //season
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var key in obj)
        if (new RegExp("(" + key + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (obj[key]) : (("00" + obj[key]).substr(("" + obj[key]).length)));
    // console.log(fmt);
    return fmt;
}

module.exports = utils;
