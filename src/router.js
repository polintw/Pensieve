const express = require('express');
const router = express.Router();
const path = require("path");

const auth = require('./auth/main.js');
const cosmicRouter = require('./cosmic/main.js');
const userRouter = require('./user/main.js');
const actionsRouter = require('./user/actions/main.js');
const embeddedRouter = require('./user/embedded/main.js');
const collateralsRouter = require('./user/collaterals/main.js');
const unitRouter = require('./unit/main.js');// shift to "units"
const unitsRouter = require('./units/main.js');
const imgRouter = require('./img/main.js');
const listsRouter = require('./lists/main.js');

//routes do not require token
router.use('/img', imgRouter)

//veirfy user status
router.use('/', auth)

//only approach after verified
router.use('/cosmic', cosmicRouter)

router.use('/user', userRouter)
router.use('/actions', actionsRouter) //prepare to replace part of the "/user"
router.use('/embedded', embeddedRouter) //prepare to replace part of the "/user"
router.use('/collaterals', collateralsRouter) //prepare to replace part of the "/user"

router.use('/unit', unitRouter)
// shift to "units"
router.use('/units', unitsRouter)

router.use('/lists', listsRouter)

module.exports = router;
