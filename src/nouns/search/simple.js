const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {_res_success} = require('../../utils/resHandler.js');
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_nouns = require('../../../db/models/index').nouns;
const {
  _handle_ErrCatched,
  validationError,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_nouns_search(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;
    const aquired = req.query.aquired;
    const category = !!req.query.category ? req.query.category : 'location_admin'
    if(!aquired){throw new validationError('please input a valid string.',3)}//prevent the server crushing due to invalid query .

    return _DB_nouns.findAll({
      where: {
        name: {
          [Op.or]: [
            {[Op.like]: aquired+'%'},
            {[Op.like]: '%' + aquired}
          ]
        },
        language: ['en', 'tw'],
        category: category
      },
      attributes: ['id', 'name', 'prefix']
    }).then(function(rows){
      let sendingData ={
        nounsList: [],
        temp: {} //keep it as a default pair due to process in  _res_success()
      };
      rows.forEach((row, index)=>{
        sendingData.nounsList.push({"name": row.name, "id": row.id, "prefix": row.prefix})
      })
      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "searching, nouns list, complete");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
};

module.exports = _handle_nouns_search
