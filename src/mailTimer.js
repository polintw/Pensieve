const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const _DB_attribution = require('../../db/models/index').attribution;
const _DB_responds = require('../../db/models/index').responds;
const _DB_lastVisitIndex = require('../../db/models/index').lastvisit_index;
const _DB_listMails = require('../../db/models/index').list_mails;
const _DB_usersNodesHome = require('../../db/models/index').users_nodes_homeland;
const _DB_usersNodesResi = require('../../db/models/index').users_nodes_residence;

async function mailTimer(req, res){
  const interval = 60*60*24*1000; // 24hr by milisecond
  const d = new Date();
  const now = d.getTime(); // milisecond
  const respondPoint = now-interval;
  const lastMailPoint = now-(interval*5);

  try{
    //start from checking latest responds
    const latestResponds = await _DB_responds.findAll({
      where: {createdAt: {[Op.gt]: respondPoint} }
    });
    let respondsAuthors = latestResponds.map((row, index) => { return row.id_author; });
    const respondsAuthorVisit = await _DB_lastVisitIndex.findAll({
      where: {id_user: respondsAuthors}
    });
    let authorsLastVisit ={};
    respondsAuthorVisit.forEach((authorsVisitRow, index) => {
      if(!(authorsVisitRow.id_user in authorsLastVisit)){
        authorsLastVisit[authorsVisitRow.id_user] = authorsVisitRow.updatedAt;
      }
    });

    let mailList = []; // used to save the users going to mail
    let respondsNotify = {}; // used to save users and units going to set as type:respond
    let respondsUnitsList = []; // used to save the units due to responds going to mail to author
    latestResponds.forEach((row, index) => { //check each responds and it's author, any necessary need to mail--- if no visit after the responds
      if( row.createdAt> authorsLastVisit[row.id_author] && !(row.id_author in respondsNotify)){
        respondsNotify[row.id_author] = row.id_unit;
        respondsUnitsList.push(row.id_unit);
        mailList.push(row.id_author);
      };
    });
    //then start checking if any new submit to belong
    const longPeriodUsers = await _DB_listMails.findAll({
      where: {
        last_deliver: {[Op.lt]: lastMailPoint}, // more than 5 days not recieving mail
        id_user: {[Op.notIn]: mailList} // exclude those users already on the list due to author to responds
      }
    });
    let longPeriodList = longPeriodUsers.map((rowLongUsers, index)=>{ return rowLongUsers.id_user;});
    mailList = mailList.concat(longPeriodList); // combine users list from responds & long period
    const usersBelongHome = await _DB_usersNodesHome.findAll({
      where: {id_user: mailList}
    });
    const usersBelongResi = await _DB_usersNodesResi.findAll({
      where: {id_user: mailList}
    });
    const longPeriodLastVisit = await _DB_lastVisitIndex.findAll({
      where: {id_user: mailList}
    });
    // now we combined above 3 to create a users info
    let usersNotified = {};
    let nodesList = []; // used to saved nodes belong to users on mailList
    let earliestVisit = now; //used to save the earliest time on the visit list, compare by from now
    mailList.forEach((userId, index) => {
      usersNotified[userId] = {};
    });
    usersBelongHome.forEach((rowBelongHome, i) => {
      usersNotified[rowBelongHome.id_user] = Object.assign({}, usersNotified[rowBelongHome.id_user], {nodeBelongHome: rowBelongHome.id_node});
      if(nodesList.indexOf(rowBelongHome.id_node) < 0) nodesList.push(rowBelongHome.id_node);
    });
    usersBelongResi.forEach((rowBelongResi, i) => {
      usersNotified[rowBelongResi.id_user] = Object.assign({}, usersNotified[rowBelongResi.id_user], {nodeBelongResi: rowBelongResi.id_node});
      if(nodesList.indexOf(rowBelongResi.id_node) < 0) nodesList.push(rowBelongResi.id_node);
    });
    longPeriodLastVisit.forEach((rowPeriodLastVisit, i) => {
      usersNotified[rowPeriodLastVisit.id_user] = Object.assign({}, usersNotified[rowPeriodLastVisit.id_user], {lastVisit: rowPeriodLastVisit.updatedAt});
      if(earliestVisit > rowPeriodLastVisit.updatedAt) earliestVisit = rowPeriodLastVisit.updatedAt;
    });
    // select from attribution by nodes belong to mailList & earliest visit time
    const latestAttri = await _DB_attribution.findAll({
      where: {
        id_noun: nodesList,
        createdAt: {[Op.gt]: earliestVisit}
      },
      attributes: [
        //'max' here combined with 'group' prop beneath,
        //because the GROUP by would fail when the 'createdAt' is different between each row,
        [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
        'id_unit', 'id_noun', 'id_author' //set attributes, so we also need to call every col we need
      ],
      group: 'id_noun' //Important. means we combined the rows by node, each id_node would only has one row
    });
    let attriByNodes = {}, attriUnitsList= [];
    latestAttri.forEach((rowLatestAttri, i) => {
      attriByNodes[rowLatestAttri.id_noun] = rowLatestAttri.id_unit;
      if(attriUnitsList.indexOf(rowLatestAttri.id_unit) < 0) attriUnitsList.push(rowLatestAttri.id_unit);
    });
    /*
    till now, we've finally prepared:
    respondsNotify, contain units each author would remind.
    attriByNodes, contain units users might not see yet.
    attriUnitsList, list from attriByNodes.
    respondsUnitsList, list from respondsNotify.
    usersNotified, basic info about users going to mail.
    the last one is, info about units we are going to send, and we select them by concat the units list first
    */
    let unitsList = attriUnitsList.concat(respondsUnitsList);
    const unitsBasic = await _DB_units.findAll({
      where: {id: unitsList}
    });
    const unitsAttribution = await _DB_attribution.findAll({
      where: {id_unit: unitsList}
    });
    let unitsUsedBasic = {};
    unitsBasic.forEach((rowUnitsBasic, i) => {
      unitsUsedBasic[rowUnitsBasic.id] = {
        id: rowUnitsBasic.id,
        exposedId: rowUnitsBasic.exposedId
      };
    });
    unitsAttribution.forEach((rowUnitsAttribution, i) => {
      "nodesList" in unitsUsedBasic[rowUnitsAttribution.id_unit] ?
      unitsUsedBasic[rowUnitsAttribution.id_unit].nodesList.push(rowUnitsAttribution.id_noun) :
      unitsUsedBasic[rowUnitsAttribution.id_unit] = Object.assign({}, unitsUsedBasic[rowUnitsAttribution.id_unit], {nodesList: [rowUnitsAttribution.id_noun]})
    });

    //now, this is finally the start to check if the users should recieve a mail

  }
  catch(error){
    winston.error(error+ 'from timer: marketing mail.<<<');
  }

}
