const nodemailer = require("nodemailer");
const winston = require('../../../config/winston.js');
const {
  smtpAccount,
  domain
} = require('../../../config/services.js');

function deliverVerifiedMail(userInfo, token){
  return new Promise((resolve, reject)=>{
    let transporter = nodemailer.createTransport({
      service: "Mailjet",
      auth: {
        user: smtpAccount.user,
        pass: smtpAccount.password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Cornerth." <noreply@cornerth.com>', // sender address
      to: userInfo.email, // list of receivers
      subject: "Please confirm your email address", // Subject line
      html: _render_HtmlBody(token, userInfo)
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) reject({status: 500, err: 'There was an error '+error});
      else{
        winston.info('Address verification %s sent: %s', info.messageId, info.response);
        resolve();
      }
    });
  })
}

const _render_HtmlBody = (token)=>{
  return (
    '<html>'+
      '<body>'+
      '<div>'+
        '<p>Welcome to Cornerth. as your new horizon.</p>'+
        '<p>Please click </p>'+
        '<a href="'+domain.name+'/router/register/mail/confirm?token='+token+'">Verify!</a>'+
        '<p> to complete email verification!</p>'+
        '<p>then, enjoy your adventure.</p>'+
      '</div>'+
      '</body>'+
    '</html>'
  )
}

module.exports = deliverVerifiedMail;
