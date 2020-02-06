const express = require('express');
const router = express.Router();

const auth = require('./auth/main.js');
const accountRouter = require('./account/main.js');
const unitsRouter = require('./units/main.js');
const imgRouter = require('./img/main.js');

const generalRouter = require('./general/main.js');
const nounsRouter = require('./nouns/main.js');
const exploreRouter = require('./explore/main.js');
const feedRouter = require('./feed/main.js');
const optionsRouter = require('./options/main.js');
const visitRouter = require('./visit/main.js');
const shareRouter = require('./share/main.js');
const inspireRouter = require('./inspire/main.js');
const broadRouter = require('./broad/main.js');
const windowRouter = require('./window/main.js');
const notificationsRouter = require('./notifications/main.js');
const uProfileRouter = require('./user/profile/main.js');
const uRecordsRouter = require('./user/records/main.js');

//routes do not protect by token, to fix this, we would have to tranmit img totally by axios api
router.use('/img', imgRouter)

//veirfy user status
router.use('/', auth)

//only approach after verified

// shift to "units"
router.use('/units', unitsRouter)
//all above are path since begining, with old deisgn
//from here, beneath are path redesign after publish,
//much more fit to current structure
router.use('/profile', uProfileRouter)
router.use('/records', uRecordsRouter)

router.use('/account', accountRouter)
router.use('/notifications', notificationsRouter)

router.use('/nouns', nounsRouter)
router.use('/share', shareRouter)
router.use('/inspire', inspireRouter)
router.use('/broad', broadRouter)
router.use('/window', windowRouter)
router.use('/options', optionsRouter)

router.use('/feed', feedRouter)
router.use('/explore', exploreRouter)
router.use('/visit', visitRouter)

router.use('/general', generalRouter)

module.exports = router;
