const express = require('express');
const router = express.Router();
const blog = require('../middlewares/blog')
const auth = require('../middlewares/authenticate')

router.get('/', blog.getAll);

module.exports = router;
