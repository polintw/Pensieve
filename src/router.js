const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const update = require('immutability-helper');

const auth = require('./auth/authorization.js');
const userRouter = require('./user/main.js');

//just for temp usage!
const {
  _promise_unitSingle
} = require('./user/unitsList/getManage.js');

//veirfy user status
//router.use('/', auth)

router.use('/user', userRouter)

router.get('/public/noun', function(req, res){
  console.log('get public: noun search');
  let prefix = req.query.prefix;
  res.status(200).json({'results': [prefix]});
})

router.get('/img/:type', function(req, res){
  console.log('get img request: '+req.params.type+' for '+req.query.name);
  const reqImg = req.query.name;
  const type = req.params.type;
  if(type=='thumb'){
    res.sendFile(path.join(__dirname, '/..', '/dev/statics_units/images/'+reqImg), {headers: {'Content-Type': 'image'}}, function (err) {
      if (err) {
        throw err
      }
    });
  }else if(type=='unitSingle'){
    fs.readFile(path.join(__dirname, '/..', '/dev/statics_units/images/'+reqImg), function(err, imgBuffer){
      if(err) {console.log('err in Read_imgFile');reject(err);};
      let imgBase64 = new Buffer(imgBuffer, 'binary').toString('base64');
      imgBase64 = 'data:image/jpeg;base64,' + imgBase64;
      res.send(imgBase64);
    });
  }
})


router.get('/unit/single/:purpose', function(req, res){
  console.log('get unit request: '+ req.query.unitName);
  _promise_unitSingle(req, res);
})

module.exports = router;
