const express = require('express');
const router = express.Router();

const auth = require('./auth/main.js');
const accountRouter = require('./account/main.js');
const generalRouter = require('./general/main.js');
const nounsRouter = require('./nouns/main.js');
const visitRouter = require('./visit/main.js');
const uProfileRouter = require('./user/profile/main.js');

//routes do not protect by token

//veirfy user status
router.use('/', auth)

//approach only after verified

router.use('/account', accountRouter)
router.use('/profile', uProfileRouter)
router.use('/visit', visitRouter)

router.use('/general', generalRouter)

router.use('/nouns', nounsRouter)


module.exports = router;
