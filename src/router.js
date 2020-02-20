const express = require('express');
const router = express.Router();

const auth = require('./auth/main.js');
const accountRouter = require('./account/main.js');
const generalRouter = require('./general/main.js');
const nounsRouter = require('./nouns/main.js');
const feedRouter = require('./feed/main.js');
const optionsRouter = require('./options/main.js');
const visitRouter = require('./visit/main.js');
const uProfileRouter = require('./user/profile/main.js');
const uRecordsRouter = require('./user/records/main.js');

//routes do not protect by token

//veirfy user status
router.use('/', auth)

//approach only after verified

router.use('/account', accountRouter)
router.use('/profile', uProfileRouter)
router.use('/records', uRecordsRouter)
router.use('/visit', visitRouter)

router.use('/general', generalRouter)

router.use('/nouns', nounsRouter)
router.use('/options', optionsRouter)
router.use('/feed', feedRouter)


module.exports = router;
