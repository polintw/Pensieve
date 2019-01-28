const nodemailer = require("nodemailer");
const {
  smtpAccount,
  domain
} = require('../../../config/services.js');

const _render_HtmlBody = (token)=>{
  return (
    '<html>'+
      '<body>'+
      '<div>'+
        '<p>Welcome to Corner as your new horizon.</p>'+
        '<p>Please click </p>'+
        '<a href="http://'+domain.name+'/router/register/mail/confirm?token='+token+'">Verify!</a>'+
        '<p> to complete email verification!</p>'+
        '<p>then, enjoy your adventure.</p>'+
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
      from: '"Coner team" <noreply@teamcorner.nctu.me>', // sender address
      to: userInfo.email, // list of receivers
      subject: userInfo.first_name+", please confirm your account", // Subject line
      html: _render_HtmlBody(token)
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) reject({status: 500, err: 'There was an error '+error});
      else{
        console.log('Address verification %s sent: %s', info.messageId, info.response);
        resolve();
      }
    });
  })
}

module.exports = deliverVerifiedMail;
