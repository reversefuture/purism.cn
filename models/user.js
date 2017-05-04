const db = require('./db');
const Base = require('./base');

class User extends Base{
    constructor(name, password, role = 'client'){
        super();
        this._name = name || '';
        this._password = password || '';
        this._role = role || '';
    }
    get name(){
        return this._name;
    }
    set name(val){
        this._name = val
    }

    get password(){
        return this._password;
    }
    set password(val){
        this._password = val
    }
    get role(){
        return this._role;
    }
    set role(val){
        this._role = val
    }

    save(){
        return new Promise((resolve, reject) => {
            db.con((connect) => {
                connect.query("select * from user where name=?", [this._name], (err, result) => {
                    console.dir(result)
                    if(result.length){
                        reject('This name has been used');
                    }else{
                        connect.query("INSERT INTO user(name,password,role) VALUES (?,?,?)", [this._name, this._password, this._role]
                            ,(err, result)=>{
                                if(err){
                                    reject(err);
                                }
                                resolve(result);
                            })
                    }
                });
            })
        })
    }

    findOne(){
        return new Promise((resolve, reject) => {
            let selectResult =[];
            db.con((connect) => {
                connect.query('SELECT * FROM user WHERE name=?', [this._name], (err, result) => {
                    if (err){
                        reject(err);
                    }
                    selectResult = result;
                    console.dir(selectResult);
                    if (selectResult.length) {
                        resolve( selectResult[0]);
                    } else {
                        resolve(null);
                    }
                })
            })
        })
    }
/*

    findOne(callback){
        var self = this;
        if (this._name.length == 0) {    //如果在没账号/密码的情况下就调用插入方法，则提示错误并返回
            // console.log("You can't select user information without NAME!");
            return callback("You can't select user information without NAME!");
        }
        var selectResult;
        db.con(function (connect) {
            connect.query('SELECT * FROM user WHERE name = ?', [self._name], function (err, result) {
                if (err) {  //报错
                    // console.log("select name:" + self.name + " error, the err information is " + err);
                    return callback(err);
                }
                // console.log('db result: ')
                // //console.dir(result);
                //注意，这里返回的是带账号和密码的，另外，理论上是有可能有多个元素的，但由于在注册时，用户名限制了重复，因此只会返回一个
                selectResult = result;  //这里的result是一个数组，只包含一个元素（或者是空）
                if (selectResult.length) {  //查询到的话，数组是有元素的（即length > 0）
                    return callback(null, selectResult[0]) //这里的selectResult就是user对象，包含name和password属性
                } else {
                    return callback(null, null);    //如果查询不到，两个参数都为空
                }
            })
        })
    }
*/

    findAll(count=0){
        return new Promise((resolve, reject) => {
            let selectResult =[];
            db.con(connect => {
                connect.query('SELECT COUNT(*) FROM user', null,(err, result) => {
                    if(err){
                        console.log(err)
                    }
                    let rows = JSON.stringify(result);
                    rows = JSON.parse(rows);
                    console.dir(rows[0]['COUNT(*)']);

                    if(Number(count) < rows[0]['COUNT(*)']){
                        connect.query('SELECT * FROM user LIMIT ?,9', [Number(count)],(err, result) => {
                            if (err){
                                reject(err);
                            }
                            result.offset = Number(count) + result.length;
                            selectResult = result;
                            resolve(result);
                        })
                    }else{
                        reject(null)
                    }
                });
            })
        })
    }

    updatePassword(password){
        return new Promise((resolve, reject) => {
            db.con(connect => {
                connect.query("UPDATE user SET password=? WHERE name=? and password=?", [password, this._name, this._password], (err, result) => {
                    if (err){
                        reject(callback(err));
                    }
                    resolve(result);
                });
            })
        })
    }
    updateName(name){
        return new Promise((resolve, reject) => {
            db.con(connect => {
                connect.query("select * from user where name=?", [name], (err,result) => {
                    if(result.name === name){
                        reject('This name has been used')
                    }else{
                        connect.query("update user set name=? where name=? and password=?", [name, this._name, this._password], (err, result) => {
                            if (err){
                                reject(err);
                            }
                            resolve(result);
                        });
                    }
                });
            })
        })
    }
    updateRole(role){
        return new Promise((resolve, reject) => {
            console.dir(this);
            db.con(connect => {
                connect.query("update user set role=? where name=? and password=?", [role, this._name, this._password], (err, result) => {
                    if (err){
                        reject(err);
                    }
                    resolve(result);
                });
            })
        })
    }

    remove(){
        return new Promise((resolve, reject) => {
            db.con(connect => {
                connect.query(" DELETE FROM user WHERE name=? and password=?", [this._name,this._password], (err, result) => {
                    if (err){
                        reject(err);
                    }
                    resolve(result);
                });
            })
        })
    }
}

module.exports = User;