const nodemailer = require("nodemailer");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const winston = require('../config/winston.js');
const {
  smtpAccount,
  domain
} = require('../config/services.js');
const _DB_users = require('../db/models/index').unsers;
const _DB_units = require('../db/models/index').units;
const _DB_nouns = require('../db/models/index').nouns;
const _DB_attribution = require('../db/models/index').attribution;
const _DB_responds = require('../db/models/index').responds;
const _DB_lastVisitIndex = require('../db/models/index').lastvisit_index;
const _DB_listMails = require('../db/models/index').list_mails;
const _DB_usersNodesHome = require('../db/models/index').users_nodes_homeland;
const _DB_usersNodesResi = require('../db/models/index').users_nodes_residence;

async function mailListGenerator(){
  const interval = 60*60*24*1000; // 24hr by milisecond
  const d = new Date();
  const now = d.getTime(); // milisecond
  const respondPoint = now-interval; // past 24hr
  const lastMailPoint = now-(interval*5); // 5 days

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
    respondsAuthorVisit.forEach((rowAuthorsVisit, index) => {
      if(!(rowAuthorsVisit.id_user in authorsLastVisit)){
        authorsLastVisit[rowAuthorsVisit.id_user] = rowAuthorsVisit.updatedAt;
      }
    });

    let candidateList = []; // used to save the users going to mail
    let respondsNotify = {}; // used to save users and units going to set as type:respond
    let respondsUnitsList = []; // used to save the units due to responds going to mail to author
    latestResponds.forEach((row, index) => { //check each responds and it's author, any necessary need to mail--- if no visit after the responds
      if( row.createdAt> authorsLastVisit[row.id_author] && !(row.id_author in respondsNotify)){
        respondsNotify[row.id_author] = row.id_unit;
        respondsUnitsList.push(row.id_unit);
        candidateList.push(row.id_author);
      };
    });
    //then start checking if any new submit to belong
    const longPeriodUsers = await _DB_listMails.findAll({
      where: {
        last_deliver: {[Op.lt]: lastMailPoint}, // more than 5 days not recieving mail
        id_user: {[Op.notIn]: candidateList}, // exclude those users already on the list due to author to responds
        setting: 'full' // to accelerate the process, we exclude ant users unsubscribed, but to exclude those from responds, we would still do this again later
      }
    });
    let longPeriodList = longPeriodUsers.map((rowLongUsers, index)=>{ return rowLongUsers.id_user;});
    candidateList = candidateList.concat(longPeriodList); // combine users list from responds & long period
    const usersBelongHome = await _DB_usersNodesHome.findAll({
      where: {id_user: candidateList}
    });
    const usersBelongResi = await _DB_usersNodesResi.findAll({
      where: {id_user: candidateList}
    });
    const longPeriodLastVisit = await _DB_lastVisitIndex.findAll({
      where: {id_user: candidateList}
    });
    // now we combined above 3 to create a users info
    let usersNotified = {};
    let nodesList = []; // used to saved nodes belong to users on candidateList
    let earliestVisit = now; //used to save the earliest time on the visit list, compare by from now
    candidateList.forEach((userId, index) => {
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
    // select from attribution by nodes belong to candidateList & earliest visit time
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
    const unitsAttribution = await _DB_attribution.findAll({ // here, although a little weired, we selected the attribution again to include all attribution all units have
      where: {id_unit: unitsList},
      include: { // left join 'nouns' to get the basic info about the node
        model: "nouns", as: "nouns",
        where: {
          id: Sequelize.col("attribution.id_noun")
        }
      }
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
      unitsUsedBasic[rowUnitsAttribution.id_unit].nodesList.push(rowUnitsAttribution.nouns[0].name) :
      unitsUsedBasic[rowUnitsAttribution.id_unit] = Object.assign({}, unitsUsedBasic[rowUnitsAttribution.id_unit], {nodesList: [rowUnitsAttribution.nouns[0].name]})
    });
    //now, this is finally the start to check if the users should recieve a mail
    let mailList = [];
    let mailInfo = {};
    candidateList.forEach((userId, index) => {
      // 2 things need to be examined: does the user has respond, which belong the user had had new,
      let belongedHome = "nodeBelongHome" in usersNotified[userId] ? usersNotified[userId]["nodeBelongHome"] : null;
      let belongedResi = "nodeBelongResi" in usersNotified[userId] ? usersNotified[userId]["nodeBelongResi"] : null;
      let newHomeify = (belongedHome in attriByNodes) ? true : false;
      let newResiify = (belongedResi in attriByNodes) ? true : false;
      let respondify = (userId in respondsNotify) ? true : false;
      if(respondify || newResiify || newHomeify){
        mailList.push(userId);
        mailInfo[userId] = [];
        if(respondify) mailInfo[userId].push({
          unitExposed: unitsUsedBasic[respondsNotify[userId]].exposedId,
          type: "responds",
          nodes: unitsUsedBasic[respondsNotify[userId]].nodesList // ["name of node"]
        });
        if(newHomeify) mailInfo[userId].puah({
          unitExposed: unitsUsedBasic[attriByNodes[belongedHome]].exposedId,
          type: "newHome",
          nodes: unitsUsedBasic[attriByNodes[belongedHome]].nodesList // ["name of node"]
        });
        if(newResiify) mailInfo[userId].puah({
          unitExposed: unitsUsedBasic[attriByNodes[belongedResi]].exposedId,
          type: "newResi",
          nodes: unitsUsedBasic[attriByNodes[belongedResi]].nodesList // ["name of node"]
        });
      };
    });
    // now we have parpared a list of users going to mail
    //last, there must some users don'y have unsubscribed, remove them
    const fullUsers = await _DB_listMails.findAll({
      where: {
        id_user: mailList,
        setting: 'full'
      }
    });
    mailList = fullUsers.map((row, index)=>{
      return row.id_user;
    });
    //so now the mailList would be shorter to or same length as mailInfo
    // everything completed, return the list & info to mailer
    return {
      mailList: mailList,
      mailInfo: mailInfo
    };
  }
  catch(error){
    winston.error(error+ 'from timer: marketing mail.<<<');
  }

}

async function mailTimer(){
  // get the list and info of users we are going to mail first
  let mailsData = await mailListGenerator();
  mailsData["address"] = {}; // new pair to save the mail address for each user
  const mailUsersInfo = await _DB_users.findAll({ // to build email address
    where: {id: mailsData.mailList}
  });
  mailUsersInfo.forEach((rowUsers, index) => {
    mailsData['address'][rowUsers.id] = rowUsers.email;
  });

  let transporter = nodemailer.createTransport({
    service: "Mailjet",
    auth: {
      user: smtpAccount.user,
      pass: smtpAccount.password
    },
    pool: true, // to use pooled connections (defaults to false) instead of creating a new connection for every email
    maxConnections: 5, // is the count of maximum simultaneous connections to make against the SMTP server (defaults to 5)
    maxMessages: 1000 //limits the message count to be sent using a single connection (defaults to 100). After maxMessages is reached the connection is dropped and a new one is created for the following messages
  });
  let sentMails = mailsData.mailList.map((userId, index)=>{
    let infoObj = mailsData.mailInfo[userId];
    return {
      from: '"Cornerth." <noreply@cornerth.com>', // sender address
      to: mailsData["address"][userId], // list of receivers
      subject: (infoObj.type == "responds") ? "New Responds" : "New Contributions", // Subject line
      html: _render_HtmlBody(infoObj);
    };
  });

  transporter.on("idle", function () { // Emitted by the transporter object if connection pool has free connection slots
    // send next message from the pending queue
    while (transporter.isIdle() && sentMails.length) {
      // shift() would return the first item but also rm it
      transporter.sendMail(sentMails.shift(), (error, resStatus) => {
        if (error) winston.error('from mailTimer when dilivering: '+error);
        else{
          winston.info('Marketing mails %s sent: %s', resStatus.messageId, resStatus.response);
        }
      );
    };
    // transporter uses pooling then connections are kept open even if there is nothing to be sent,
    // close it if while end(no mail going to send)
    transporter.close();
  });

}

const _render_HtmlBody = (mailInfoObj)=>{
  return ();
}
module.exports = mailTimer;
