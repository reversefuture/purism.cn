const db = require('./db');
const Base = require('./base');

class Blog extends Base{
    constructor(user, text){
        super();
            this.user = user || '';
            this.text = text || '';
            this.ctime = (new Date()).toISOString();
    }
    save(){
        return new Promise((resolve, reject) => {
            db.con((connect) => {
                connect.query("INSERT INTO text(user,text,ctime) VALUES (?,?,?)", [this.user, this.text, this.ctime] ,(err, result)=>{
                        if(err){
                            reject(err);
                        }
                        resolve(result);
                })
            })
        })
    }

    findAll(count=0){
        return new Promise((resolve, reject) => {
            db.con(connect => {
                connect.query('SELECT COUNT(*) FROM text', null, (err,result) => {
                    if(err){
                        reject(err);
                    }
                    let selectResult =[];
                    result = JSON.parse(JSON.stringify(result)); //convert to JS object
                    if(Number(count) < result[0]['COUNT(*)']){
                        db.con(connect => {
                            connect.query('SELECT * from text limit ?,9', [Number(count)], (err, result) => {
                                if (err){
                                    reject(err);
                                }
                                result.offset = Number(count) + result.length;
                                resolve(result);
                            })
                        })
                    }else{
                        resolve(null, null);
                    }
                })
            })
        })
    }
    findById(id){
        return new Promise((resolve, reject) => {
            db.con(connect => {
                        connect.query('SELECT * FROM text WHERE id=?', [id], (err,result) => {
                            if(err){
                                reject(err);
                            }
                            resolve(result);
                        })
                })
            })
    }

    findByName(name){
        return new Promise((resolve, reject) => {
            db.con(connect => {
                connect.query('SELECT * FROM user WHERE name=?', [name], (err,result) => {
                    if(err){
                        reject('No user with this name!');
                    }else{
                        connect.query('SELECT * FROM text WHERE user=?', [name], (err,result) => {
                            if(err){
                                reject(err);
                            }
                            resolve(result);
                        })
                    }
                })
            })
        })
    }

    update(id){
        return new Promise((resolve, reject) => {
            db.con(connect => {
                connect.query("UPDATE text SET text=? WHERE user=? AND id=?", [this.text, this.user, id], (err, result) => {
                    if (err){
                        reject(err);
                    }
                    resolve(result);
                });
            })
        })
    }

    delete(id){
        return new Promise((resolve, reject) => {
            db.con(connect => {
                connect.query("DELETE FROM text WHERE user=? AND id=?", [this.user, id], (err, result) => {
                    if (err){
                        reject(err);
                    }
                    resolve(result);
                });
            })
        })
    }
}

module.exports = Blog;