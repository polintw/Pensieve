const nodemailer = require("nodemailer");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const winston = require('../../config/winston.js');
const {
  domain,
  smtpAccount,
} = require('../../config/services.js');
const {_render_HtmlBody} = require('./MktEmail.js');
const _DB_users = require('../../db/models/index').users;
const _DB_units = require('../../db/models/index').units;
const _DB_nouns = require('../../db/models/index').nouns;
const _DB_attribution = require('../../db/models/index').attribution;
const _DB_responds = require('../../db/models/index').responds;
const _DB_lastVisitIndex = require('../../db/models/index').lastvisit_index;
const _DB_listMails = require('../../db/models/index').list_mails;
const _DB_usersNodesHome = require('../../db/models/index').users_nodes_homeland;
const _DB_usersNodesResi = require('../../db/models/index').users_nodes_residence;

async function mailListGenerator(){
  const interval = 60*60*24*1000; // 24hr by milisecond
  const d = new Date();
  const now = d.getTime(); // milisecond
  const respondPoint = now-interval; // past 24hr
  const lastMailPoint = now-(interval* 9)-7200000; // 9 days & 2 hr, combine to interval in server.js

  try{
    //start from checking latest responds
    const latestResponds = await _DB_responds.findAll({
      where: {createdAt: {[Op.gt]: respondPoint} }
    });
    let respondsAuthorsUnsure = latestResponds.map((row, index) => { return row.primer_author; }); // it's possible same author have several responds
    let respondsAuthors = respondsAuthorsUnsure.filter((authorId, index)=>{ return index == respondsAuthorsUnsure.indexOf(authorId)});
    const respondsAuthorVisit = await _DB_lastVisitIndex.findAll({
      where: {id_user: respondsAuthors}
    });
    const respondsAuthorsLastMail = await _DB_listMails.findAll({
      where: {id_user: respondsAuthors}
    });
    // make both selection results to an obj which could be index by author id
    let authorsLastVisit ={}, authorsLastMail ={};
    respondsAuthorVisit.forEach((rowAuthorsVisit, index) => {
      if(!(rowAuthorsVisit.id_user in authorsLastVisit)){
        authorsLastVisit[rowAuthorsVisit.id_user] = rowAuthorsVisit.updatedAt;
      }
    });
    respondsAuthorsLastMail.forEach((rowAuthorsLastMail, index) => {
      if(!(rowAuthorsLastMail.id_user in authorsLastMail)){
        authorsLastMail[rowAuthorsLastMail.id_user] = rowAuthorsLastMail.last_deliver;
      }
    });

    let candidateList = []; // used to save the users going to mail
    let respondsNotify = {}; // used to save users and units going to set as type:respond
    let respondsUnitsList = []; // used to save the units due to responds going to mail to author
    latestResponds.forEach((row, index) => { //check each responds and it's author, any necessary need to mail--- if no visit after the responds
      if( row.createdAt> authorsLastVisit[row.primer_author] &&
        row.createdAt> authorsLastMail[row.primer_author] &&
        !(row.primer_author in respondsNotify) // first one of an author encounter by loop
      ){
        respondsNotify[row.primer_author] = row.id_unit;
        respondsUnitsList.push(row.id_unit);
        candidateList.push(row.primer_author);
      };
    });
    //then start checking if any new submit to belong
    const longPeriodUsers = await _DB_listMails.findAll({
      where: {
        [Op.or]: [
          { last_deliver: { [Op.lt]: lastMailPoint } }, // more than 9 days & 2 hr(9.5 days in result) not recieving mail
          {id_user: {[Op.in]: candidateList}} // 'include' those users already on the list due to author to responds
        ],
        setting: 'full' // to accelerate the process, we exclude ant users unsubscribed, but to exclude those from responds, we would still do this again later
      }
    });
    candidateList = longPeriodUsers.map((rowLongUsers, index)=>{ return rowLongUsers.id_user;});
    let usersMailStatus = {}; // used to save user's current mail status
    longPeriodUsers.forEach((rowLongUsers, index) => {
      usersMailStatus[rowLongUsers.id_user] = rowLongUsers.last_deliver;
    });
    // and pick user's belonged homeland, residenc, and lastvisit_index
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
      order: [ //make sure the order of arr are from earliest
        Sequelize.literal('`createdAt` ASC') //and here, using 'literal' is due to some wierd behavior of sequelize,
        //it would make an Error if we provide col name by 'arr'
      ],
      // no Group by, select all and keep them all
    });
    let attriByNodes = {}, attriUnitsList= [];
    latestAttri.forEach((rowLatestAttri, i) => {
      // consider there were a small chance several unit would be created at 'exact' the same time, selected from attributes together,
      // it's important here to keep every node related to only one unit.
      //And the "latest" would be left due to the latestAttri was from the earliest to latest
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
        model: _DB_nouns, // default alias for this table was 'noun'
        where: {
          id: Sequelize.col("attribution.id_noun")
        },
        required:false // to let it become a LEFT JOIN
      }
    });
    let unitsUsedBasic = {};
    unitsBasic.forEach((rowUnitsBasic, i) => {
      unitsUsedBasic[rowUnitsBasic.id] = {
        id: rowUnitsBasic.id,
        author: rowUnitsBasic.id_author,
        exposedId: rowUnitsBasic.exposedId,
        coverImg: rowUnitsBasic.url_pic_layer0,
        createdAt: rowUnitsBasic.createdAt
      };
    });
    unitsAttribution.forEach((rowUnitsAttribution, i) => {
      "nodesList" in unitsUsedBasic[rowUnitsAttribution.id_unit] ?
      unitsUsedBasic[rowUnitsAttribution.id_unit].nodesList.push(rowUnitsAttribution.noun.name) :
      unitsUsedBasic[rowUnitsAttribution.id_unit] = Object.assign({}, unitsUsedBasic[rowUnitsAttribution.id_unit], {nodesList: [rowUnitsAttribution.noun.name]})
    });
    //now, finally start checking if the users should recieve a mail
    let mailList = [];
    let mailInfo = {};
    candidateList.forEach((userId, index) => {
      // have to examined:
      //  does the user has respond,
      //  does the belong of user had new,
      //  does the new to user's belong are upload by user self
      //  or does the new one had had on user's mail list
      let belongedHome = "nodeBelongHome" in usersNotified[userId] ? usersNotified[userId]["nodeBelongHome"] : null;
      let belongedResi = "nodeBelongResi" in usersNotified[userId] ? usersNotified[userId]["nodeBelongResi"] : null;
      let newHomeify = (belongedHome in attriByNodes) ? true : false;
      let newResiify = (belongedResi in attriByNodes) ? true : false;
      let respondify = (userId in respondsNotify) ? true : false;
      if(respondify || newResiify || newHomeify){
        mailInfo[userId] = []; // notice, not yet sure the user could be put on the list
        // for convinient at html render, keep the type 'responds' at the first
        if(respondify) mailInfo[userId].push({
          unitExposed: unitsUsedBasic[respondsNotify[userId]].exposedId,
          type: "responds",
          imgUrl: unitsUsedBasic[respondsNotify[userId]].coverImg,
          nodes: unitsUsedBasic[respondsNotify[userId]].nodesList // ["name of node"]
        });
        if(newResiify){// has new to user beloned residence
          if(
            unitsUsedBasic[attriByNodes[belongedResi]].author != userId && // the new one not upload by user self
            unitsUsedBasic[attriByNodes[belongedResi]].createdAt > usersMailStatus[userId] // the new one was created 'after' the last mail
          ) mailInfo[userId].push({
            unitExposed: unitsUsedBasic[attriByNodes[belongedResi]].exposedId,
            type: "newResi",
            imgUrl: unitsUsedBasic[attriByNodes[belongedResi]].coverImg,
            nodes: unitsUsedBasic[attriByNodes[belongedResi]].nodesList // ["name of node"]
          });
        };
        // and, we have an additional check for homeland to see if the unit by homeland was same as the residence,
        // to avoid duplicate content to an user.
        // That's mean we choose 'residence' as the prior remind
        if(newHomeify){
          if(
            unitsUsedBasic[attriByNodes[belongedHome]].author != userId &&
            unitsUsedBasic[attriByNodes[belongedHome]].createdAt > usersMailStatus[userId] &&
            unitsUsedBasic[attriByNodes[belongedHome]].id != (newResiify ? unitsUsedBasic[attriByNodes[belongedResi]].id: null)
          ) mailInfo[userId].push({
            unitExposed: unitsUsedBasic[attriByNodes[belongedHome]].exposedId,
            type: "newHome",
            imgUrl: unitsUsedBasic[attriByNodes[belongedHome]].coverImg,
            nodes: unitsUsedBasic[attriByNodes[belongedHome]].nodesList // ["name of node"]
          });
        };
        // now chekc if the user qualified put on the list
        if(mailInfo[userId].length > 0 ) mailList.push(userId);
      };
    });
    // now we have parpared a list of users going to mail
    // everything completed, return the list & info to mailer
    return {
      mailList: mailList,
      mailInfo: mailInfo
    };
  }
  catch(error){
    winston.error(error+ '. From timer: list generator of marketing mail.<<<');
    return false; // to stop the mailing process
  }

}

async function mailTimer(){
  // get the list and info of users we are going to mail first
  let mailsData = await mailListGenerator();
  if( !mailsData) return; // error in generator, stop process
  /*
  Notice, 'mailList' & 'mailInfo' in mailsData do not always match.
  Always use the mailList.
  */
  winston.info('>>> from timer: marketing mail. mailsData get, start sending.<<<');
  try{
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
      let mailUnitArr = mailsData.mailInfo[userId];
      return {
        from: '"Cornerth." <noreply.marketing@' +domain.name + '>', // sender address
        to: mailsData["address"][userId], // list of receivers
        subject: (mailUnitArr[0].type == "responds" ) ? "New Responds to Your Contributions" : "Update to you", // Subject line
        html: _render_HtmlBody(mailUnitArr)
      };
    });
    let wrappedMailSend = (sentOptions)=>{ // use a wrapper to create a promise could return to a 'await' f()
      return new Promise((resolve, reject)=>{
        // shift() would return the first item but also rm it
        transporter.sendMail(sentOptions, (error, resStatus) => {
          if (error){ winston.error('from mailTimer when delivering: '+error); reject(error);}
          else{
            winston.info('Marketing mails %s sent: %s', resStatus.messageId, resStatus.response);
            resolve();
          }
        });
      })
    }

    transporter.on("idle", async function () { // Emitted by the transporter object if connection pool has free connection slots
      // send next message from the pending queue
      while (transporter.isIdle() && sentMails.length) {
        //  move while loop only 'after' the .sendMail() fin. by await --- otherwise the while would go on 'before' the sendMail really return
        await wrappedMailSend(sentMails[0]);
        sentMails.shift();
      };
      // transporter uses pooling then connections are kept open even if there is nothing to be sent,
      // close it if while end(no mail going to send)
      transporter.close();
      // update last_deliver in _DB_listMails for those who was sent mail
      if(mailsData.mailList.length > 0) await _DB_listMails.update(
        {last_deliver: Sequelize.literal('CURRENT_TIMESTAMP')},
        {where: {id_user: mailsData.mailList}}
      );
    });
  }
  catch(error){
    winston.error(error+ ' from timer: marketing mail.<<<');
    return; // to stop the mailing process
  }
}

module.exports = mailTimer;
