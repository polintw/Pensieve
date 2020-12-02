const nodemailer = require("nodemailer");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const winston = require('../../config/winston.js');
const _DB_users = require('../../db/models/index').users;
const _DB_listMails = require('../../db/models/index').list_mails;
const {
    domain,
    smtpAccount,
} = require('../../config/services.js');
const { _render_HtmlBody } = require('./AnnounceMail.js');

async function mailSingleTurn(){
  winston.info('>>> from /mailer: marketing mail, single turn. start sending.<<<');
  
  try{
    let mailsData = {
      address: {},
      mailList: []
    };
    const mailsSetting = await _DB_listMails.findAll({
      where: {
        setting: 'full'
      }
    });
    mailsSetting.forEach((row, index)=>{
      mailsData['mailList'].push(row.id_user);
    });
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
      return {
        from: '"Cornerth." <noreply.marketing@' +domain.name + '>', // sender address
        to: mailsData["address"][userId], // list of receivers
        subject: "Cornerth.| We are here. We got New Features!", // Subject line
        html: _render_HtmlBody()
      };
    });
    let wrappedMailSend = (sentOptions)=>{ // use a wrapper to create a promise could return to a 'await' f()
      return new Promise((resolve, reject)=>{
        // shift() would return the first item but also rm it
        transporter.sendMail(sentOptions, (error, resStatus) => {
          if (error){ winston.error('from mailSingleTurn when delivering: '+error); reject(error);}
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
    });
  }
  catch(error){
    winston.error(error + ' from mailSingleTurn: marketing mail.<<<');
    return; // to stop the mailing process
  }
}

//module.exports = mailSingleTurn;
mailSingleTurn();
