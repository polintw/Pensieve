const fs = require('fs');
const path = require("path");
const {
  userImg
} = require('../../config/path.js');
const projectRootPath = require("../../projectRootPath");

function _handle_img_requisition(req, res){
  const folder = req.params.user;
  const file = req.params.ofWhich;
  switch(req.query.type){
    case 'thumb':
      /*
      For historical reason, units created before 31 JUL. 2020, or by user id less than 70,
      do not have thumb_ img, set a check for this condition before the file were all prepared
      */
      let thumbImgPath = '';
      if (fs.existsSync(path.join(projectRootPath, userImg+folder+'/'+'thumb_'+ file))) {
        thumbImgPath = path.join(projectRootPath, userImg+folder+'/'+'thumb_'+ file);
      }
      else {
        thumbImgPath = path.join(projectRootPath, userImg+folder+'/'+ file);
      };
      res.sendFile(thumbImgPath, { headers: { 'Content-Type': 'image/jpeg'}}, function (err) {
        if (err) {
          console.log('error occured: img sending fail:'+err);
          res.status(404).end();
        }
      });
      break;
    case  'unitSingle':
      fs.readFile(path.join(projectRootPath, userImg+folder+'/'+file), function(err, imgBuffer){
        if(err) {console.log('err in Read_imgFile:'+err);res.status(500);return;};
        let imgBase64 = new Buffer.from(imgBuffer, 'binary').toString('base64');
        imgBase64 = 'data:image/jpeg;base64,' + imgBase64;
        res.status(200).send(imgBase64);
      });
      break;
    default:
      let imgPath = path.join(projectRootPath, userImg + folder + '/' + file);
      res.sendFile(imgPath, { headers: { 'Content-Type': 'image/jpeg' } }, function (err) {
        if (err) {
          console.log('error occured: img sending fail:' + err);
          res.status(404).end();
        }
      });
  }
}

module.exports = _handle_img_requisition;
