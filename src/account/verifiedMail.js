const nodemailer = require("nodemailer");
const winston = require('../../config/winston.js');
const {
  smtpAccount,
  domain
} = require('../../config/services.js');

const _render_HtmlBody = (token)=>{
  return (
    '<html>'+
      '<body>'+
      '<section>'+
        '<h2>Cornerth.</h2>'+
        "<p>You've asking reset your password."+
      '</section>'+
      '<div>'+
        '<p>Please clicking link below to reset your password.</p>'+
        '<a href="https://'+domain.name+'/s/resend/pwreset?token='+token+'">Reset.</a>'+
      '</div>'+
      '</body>'+
    '</html>'
  )
}

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
      from: '"Cornerth team" <noreply@cornerth.com>', // sender address
      to: userInfo.email, // list of receivers
      subject: userInfo.first_name+", password resetting.", // Subject line
      html: _render_HtmlBody(token)
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

module.exports = deliverVerifiedMail;
