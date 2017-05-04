const Blog = require('../models/blog')
const utils = require('../helpers/util')

var blog = {
    getAll: function(req, res) {
        let blog = new Blog();
        blog.findAll(req.query.count)
            .then((result) => {
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

    getById: function(req, res) {
        let blog = new Blog();
        blog.findById(req.params.id)
            .then((result) => {
                console.dir(result);
                if(!result){
                    res.send({error: 'No blog found!'})
                }else{
                    res.send(result)
                }
            })
            .catch((err) => {
                res.send({error: err})
            })
    },
    getByName: function(req, res) {
        let blog = new Blog();
        console.dir(req.query.user)
        blog.findByName(req.query.user)
            .then((result) => {
                console.dir(result);
                if(!result){
                    res.send({error: 'No blog found!'})
                }else{
                    res.send(result)
                }
            })
            .catch((err) => {
                res.send({error: err})
            })
    },

    create: function(req, res) {
        let user = req.body.user || res.locals.decoded.aud
        let text = req.body.text
        if(!user || !text){
            res.send({error: 'user or text missing!'})
            return
        }

        let blog = new Blog(user, text)
        blog.save()
            .then((result) => {
                // console.dir(result);
                if(!result){
                    res.send({error: 'Failed to save the blog!'})
                }else{
                    res.send(result)
                }
            })
            .catch((err) => {
                res.send({error: err})
            })
    },
    update:function (req, res) {
        let user = req.body.user || res.locals.decoded.aud
        let text = req.body.text
        if(!user || !text){
            res.send({error: 'user or text missing!'})
            return
        }

        let blogId = req.body.id
        let blog = new Blog(user, text)
        blog.findById(blogId)
            .then((result)=> {
                if(!result){
                    res.send({error: 'This blog does not exist'})
                }else{
                    blog.update(blogId)
                        .then((result) => {
                            res.send(result)
                        })
                        .catch((err) => {
                            throw err;
                        })
                }
            })
            .catch((err) => {
                res.send({error: err})
            })
    },

    delete: function(req, res) {
        let user = req.body.user || res.locals.decoded.aud
        let text = req.body.text
        if(!user || !text){
            res.send({error: 'user or text missing!'})
            return
        }

        let blogId = req.params.id
        let blog = new Blog(user, text)
        blog.findById(blogId)
            .then((result)=> {
                if(!result){
                    res.send({error: 'This blog does not exist'})
                }else{
                    blog.delete(blogId)
                        .then((result) => {
                            res.send(result)
                        })
                        .catch((err) => {
                            throw err;
                        })
                }
            })
            .catch((err) => {
                res.send({error: err})
            })
    }
};

module.exports = blog;