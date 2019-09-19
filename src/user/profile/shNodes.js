const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const _DB_sheetsNode = require('../../../db/models/index').sheets_node;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_GET_profile_sheetsNodes(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId; //use userId passed from pass.js

    const selectPresent = ()=>{
      let checkItems = ['residence', 'hometown', 'stay']; //prepared to used after selection from DB

      return _DB_sheetsNode.findOne({
        where: {id_user: userId}
      }).then((row)=>{
        let sendingData={
          nodesList:[],
          nodesChart:{},
          temp: {}
        };

        //there are 2 posibilities: already record, or not.
        if(row != null){
          //then, we only select items describe present state
          for(let i = 0 ; i < checkItems.length; i++){
            if(row[checkItems[i]] != null){
              sendingData.nodesList.push(row[checkItems[i]])
              sendingData.nodesChart[row[checkItems[i]]] = checkItems[i];
            };
          }
        }

        //limit?
        //in the future, if the selecting items increase, we need to check the limit in case we send 'too many' nodes

        resolve(sendingData);
      }).catch((err)=>{
        reject(new internalError(err, 131));
      });
    };

    //check the range of req, including present and entire
    //entire hasn't established, should be done when the req come from profile page
    if('present' in req.query){
      selectPresent();
    }else{
      resolve({temp:{}});
    }

  }).then((sendingData)=>{
    _res_success(res, sendingData, "profile, GET: /sheetsNodes, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('profile, GET: /sheetsNodes ');
  _handle_GET_profile_sheetsNodes(req, res);
});

module.exports = execute;
