const express = require('express');
const main = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  validationError
} = require('../utils/reserrHandler.js');

const editExecutive = require('./editing.js');
const eraseExecutive = require('./erase.js');
const staticsExecutive = require('./statics/execute.js');
const createExecutive = require('./create/plain.js');
const accumulatedExecutive = require('./accumulated.js');
const nodesExecutive = require('./nodes.js');

main.use('/accumulated', accumulatedExecutive)

main.use('/nodes', nodesExecutive)

main.use('/create', createExecutive)

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

// only author could edit/erase/get his own shared, examine here for all secondary api
main.use('/:id', function(req, res, next){
  const userId = req.extra.tokenUserId;
  const exposedId = req.reqUnitId;

  async function validation(){
    try{
      // first, select & check the Unit by exposedId
      let unitOrigin = await _DB_units.findOne({
        where: {exposedId: exposedId}
      });
      if( !unitOrigin ){ // if unitOrigin = null
        throw new validationError(" from middleware in /share, invalid exposedId from user's req.", 325);
        return;
      };
      // check if the user is author
      let authorId = unitOrigin.id_author;
      if(authorId != userId){ // user are not author
        throw new forbbidenError(" from middleware /share, user: "+ userId+ ", trying approach unit not belong to him/her: "+unitOrigin.id+".", 39);
        return;
      };
      // if everuthing were fine
      next();
    }
    catch(error){
      _handle_ErrCatched(error, req, res);
      return;
    }
  };

  validation();
})

main.use('/:id/editing', editExecutive)

main.use('/:id/erase', eraseExecutive)

main.use('/:id/statics', staticsExecutive)

module.exports = main;
