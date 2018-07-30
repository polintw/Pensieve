const express = require('express');
const router = express.Router();
const path = require("path");

const auth = require('./auth/main.js');
const userRouter = require('./user/main.js');
const unitRouter = require('./unit/main.js');
const imgRouter = require('./img/main.js');

//here but concerned
router.get('/public/noun', function(req, res){
  console.log('get public: noun search');
  let prefix = req.query.prefix;
  res.status(200).json({'results': [prefix]});
})

//routes do not require token
router.use('/img', imgRouter)

//veirfy user status
router.use('/', auth)

router.use('/user', userRouter)

router.use('/unit', unitRouter)



module.exports = router;
