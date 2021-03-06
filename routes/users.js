const express = require('express');
const router = express.Router();
const user = require('../middlewares/user')
const auth = require('../middlewares/authenticate')

router.get('/', user.getAll);

module.exports = router;
