const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../../config/jwt.js');
const {_res_success} = require('../../../utils/resHandler.js');
const {
  _select_Basic
} = require('../../../utils/dbSelectHandler.js');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../../../utils/reserrHandler.js');

function _handle_user_actionsShareds_GET(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      let mysqlForm = {
        accordancesList: [[userId]],
        unitsList: []
      },
      selectCondition = {
        table: "units",
        cols: ["*"],
        where: ["id_author"]
      };
      //first, selecting by accordancelist
      _select_Basic(selectCondition, mysqlForm.accordancesList).then((resultShareds)=>{
        let sendingData={
          unitsList: [],
          unitsBasic: {},
          marksBasic: {},
          nounsListMix: [],
          temp: {}
        }
        if(resultShareds.length < 1){return sendingData}; // if there is not any shareds record at all
        //if needed, selecting again by the result
        resultShareds.forEach((row, index)=>{
          mysqlForm.unitsList.push([row.id]);
        });
        resultShareds.forEach((row, index)=>{
          sendingData.unitsList.push(row.id);
          sendingData.unitsBasic[row.id] = {
            unitsId: row.id,
            authorId: userId,
            pic_layer0: row.url_pic_layer0,
            pic_layer1: row.url_pic_layer1,
            created: row.established,
            marksList: [],
            nounsList: []
          }
        });

        return sendingData;
      }).then((sendingData)=>{
        if(sendingData.unitsList.length < 1){return sendingData}; // as above, if there is not any shareds record at all
        let conditionsMarks = {
          table: 'marks',
          cols: ['id','id_unit','layer','editor_content'],
          where: ['id_unit']
        },
        conditionAttri = {
          table: 'attribution',
          cols: ['id_unit', 'id_noun'],
          where: ['id_unit']
        };
        let pMarks = Promise.resolve(_select_Basic(conditionsMarks, mysqlForm.unitsList).catch((errObj)=>{throw errObj}));
        let pAtrri = Promise.resolve(_select_Basic(conditionAttri, mysqlForm.unitsList).catch((errObj)=>{throw errObj}));

        return Promise.all([pAtrri, pMarks]).then((resultsStep2)=>{
          let resultsAttri = resultsStep2[0],
          resultsMarks = resultsStep2[1];

          resultsAttri.forEach((row, index)=> {
            sendingData.unitsBasic[row.id_unit]["nounsList"].push(row.id_noun);
            sendingData.nounsListMix.push(row.id_noun);
          });
          resultsMarks.forEach((row, index)=> {
            sendingData.unitsBasic[row.id_unit]["marksList"].push(row.id);
            sendingData.marksBasic[row.id] = {
              editorContent: JSON.parse(row.editor_content),
              layer: row.layer
            }
          });
          sendingData.nounsListMix = sendingData.nounsListMix.filter((id, index, list)=>{
            return index == list.indexOf(id);
          }); //remove duplicate from the array
          return (sendingData); //return to the 'parent' promise of current one
        })
      }).then((sendingData)=>{
        _res_success(res, sendingData, "Complete, GET: user actions/shareds.");
      }).catch((errObj)=>{
        console.log("error occured during GET: user actions/shareds promise: "+(errObj.err?errObj.err:errObj));
        switch (errObj.status) {
          case 400:
            _handler_err_BadReq(errObj.err, res);
            break;
          case 404:
            _handler_err_NotFound(errObj.err, res);
            break;
          case 500:
            _handler_err_Internal(errObj.err, res);
            break;
          default:
            _handler_err_Internal(errObj.err?errObj.err:errObj, res);
        }
      });
    }
  })
}

module.exports = _handle_user_actionsShareds_GET
