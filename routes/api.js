const express = require('express');
const router = express.Router()
const auth = require('../middlewares/authenticate');
const user = require('./../middlewares/user');
const blog = require('./../middlewares/blog');

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.authenticate);

router.all('/v1/*', auth.validate);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/v1/blogs', blog.getAll);
router.get('/v1/blog/:id', blog.getById);
router.get('/v1/blog', blog.getByName); //add name to query
router.post('/v1/blog/', blog.create);
router.put('/v1/blog/:id', blog.update);
router.delete('/v1/blog/:id', blog.delete);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/v1/users',  user.getAll);
router.get('/v1/user/:name', user.getOne);
router.post('/v1/user', user.create);
router.put('/v1/user/:name', user.update);
router.delete('/v1/admin/user/:name', user.delete);


//route that apply to all matched url

//or app.use('/api/v1', auth, router);
//app.all('/api/v1/*',  auth, router);

module.exports = router;