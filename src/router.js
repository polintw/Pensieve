const express = require('express');
const router = express.Router();

const auth = require('./auth/main.js');
const accountRouter = require('./account/main.js');
const cosmicRouter = require('./cosmic/main.js');
const userRouter = require('./user/main.js');
const actionsRouter = require('./user/actions/main.js');
const embeddedRouter = require('./user/embedded/main.js');
const collateralsRouter = require('./user/collaterals/main.js');
const scapeRouter = require('./user/scape/main.js');
const profileRouter = require('./user/profile/main.js');
const unitRouter = require('./unit/main.js');// shift to "units"
const unitsRouter = require('./units/main.js');
const imgRouter = require('./img/main.js');

const shareRouter = require('./share/main.js');
const inspireRouter = require('./inspire/main.js');
const nounsRouter = require('./nouns/main.js');
const exploreRouter = require('./explore/main.js');
const notificationsRouter = require('./notifications/main.js');
const generalRouter = require('./general/main.js');

//routes do not protect by token, to fix this, we would have to tranmit img totally by axios api
router.use('/img', imgRouter)

//veirfy user status
router.use('/', auth)

//only approach after verified
router.use('/cosmic', cosmicRouter)

router.use('/user', userRouter)
router.use('/actions', actionsRouter) //prepare to replace part of the "/user"
router.use('/embedded', embeddedRouter) //prepare to replace part of the "/user"
router.use('/collaterals', collateralsRouter) //prepare to replace part of the "/user"
router.use('/profile', profileRouter) //prepare to replace part of the "/user"
router.use('/scape', scapeRouter) //prepare to replace part of the "/user"


router.use('/unit', unitRouter)
// shift to "units"
router.use('/units', unitsRouter)

router.use('/account', accountRouter)

router.use('/nouns', nounsRouter)
router.use('/share', shareRouter)
router.use('/explore', exploreRouter)
router.use('/inspire', inspireRouter)
router.use('/notifications', notificationsRouter)

router.use('/general', generalRouter)

module.exports = router;
