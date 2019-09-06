const express = require('express');
const router = express.Router();

const auth = require('./auth/main.js');
const accountRouter = require('./account/main.js');
const profileRouter = require('./user/profile/main.js');
const unitsRouter = require('./units/main.js');
const imgRouter = require('./img/main.js');

const feedRouter = require('./feed/main.js');
const visitRouter = require('./visit/main.js');
const shareRouter = require('./share/main.js');
const inspireRouter = require('./inspire/main.js');
const nounsRouter = require('./nouns/main.js');
const windowRouter = require('./window/main.js');
const exploreRouter = require('./explore/main.js');
const notificationsRouter = require('./notifications/main.js');
const generalRouter = require('./general/main.js');

//routes do not protect by token, to fix this, we would have to tranmit img totally by axios api
router.use('/img', imgRouter)

//veirfy user status
router.use('/', auth)

//only approach after verified
router.use('/profile', profileRouter) //prepare to replace part of the "/user"


// shift to "units"
router.use('/units', unitsRouter)

router.use('/account', accountRouter)
router.use('/notifications', notificationsRouter)

router.use('/nouns', nounsRouter)
router.use('/share', shareRouter)
router.use('/inspire', inspireRouter)
router.use('/window', windowRouter)

router.use('/feed', feedRouter)
router.use('/explore', exploreRouter)
router.use('/visit', visitRouter)

router.use('/general', generalRouter)

module.exports = router;
