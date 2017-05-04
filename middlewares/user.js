const User = require('../models/user')
const utils = require('../helpers/util')

let user = {

    getAll: function(req, res) {
        let user = new User()
        user.findAll(req.query.count)
            .then((result) => {
                console.dir(result);
                if(!result){
                    res.status(501).send({error: 'There is no more data on server!'})
                }else{
                    res.send({data: result, offset: result.offset})
                }
            })
            .catch((err) => {
                res.status(500).send({error: err})
            })
    },

    getOne: function(req, res) {
        let user = new User(req.params.name || res.locals.decoded.aud);
        user.findOne()
            .then((result) => {
                console.dir(result);
                if(!result){
                    res.send({error: 'No user found!'})
                }else{
                    res.send(result)
                }
            })
            .catch((err) => {
                res.send({error: err})
            })
    },

    create: function(req, res) {
        let name = req.body.name || res.locals.decoded.aud
        let password = utils.parseBase64(String(req.body.password))
        // console.dir(req.body)
        if(!name || !password){
            res.send({error: 'Name or password missing!'})
            return
        }
        let user = new User(name,password);
        user.save()
            .then((result) => {
                // console.dir(result);
                if(!result){
                    res.status(501).send({error: 'Failed to create the user!'})
                }else{
                    res.send({message: 'User has been created successfully!'})
                }
            })
            .catch((err) => {
                res.status(500).send({error: err})
            })
    },
    update:function (req, res, next) {
        let name = req.body.name || res.locals.decoded.aud
        let password = utils.parseBase64(String(req.body.password))
        // console.dir(req.body)
        if(!name || !password){
            res.send({error: 'Name or password missing!'})
            return
        }
        let user = new User(name,password);

        let newField = ''
        if(req.body.newName){
            newField = req.body.newName
            user.updateName(newField)
                .then((result) => {
                    console.dir(result);
                    if(!result){
                        res.send({error: 'Update failed!'})
                    }else{
                        // res.send({success: 'User name has been updated'})
                        res.locals.update = {message: 'User name has been updated'}
                        next()
                    }
                })
                .catch((err) => {
                    res.send({error: err})
                })
        }else if(req.body.newPassword){
            newField = utils.parseBase64(req.body.newPassword)
            user.updatePassword(newField)
                .then((result) => {
                    console.dir(result);
                    if(!result){
                        res.send({error: 'Update failed!'})
                    }else{
                        // res.send({success: 'User password has been updated'})
                        res.locals.update = {message: 'User password has been updated'}
                        next()
                    }
                })
                .catch((err) => {
                    res.send({error: err})
                })
        }else if(req.body.newRole){
            newField = req.body.newRole
            user.updateRole(newField)
                .then((result) => {
                    console.dir(result);
                    if(!result){
                        res.send({error: 'Update failed!'})
                    }else{
                        // res.send({success: 'User role has been updated'})
                        res.locals.update = {message: 'User role has been updated'}
                        next()
                    }
                })
                .catch((err) => {
                    res.send({error: err})
                })
        }else{
            res.send({error: 'New value missing'})
        }
    },

    delete: function(req, res) {
        let name = req.body.name|| res.locals.decoded.aud
        let password = utils.parseBase64(String(req.body.password))
        // console.dir(req.body)
        if(!name || !password){
            res.send({error: 'Name or password missing!'})
            return
        }
        let user = new User(name,password);
        user.remove()
            .then((result) => {
                console.dir(result)
                res.send({message: 'User has been deleted!'})
            })
            .catch((err)=>{
                res.send({error: err})
            })
    }
};

module.exports = user;