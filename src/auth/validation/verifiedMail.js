const nodemailer = require("nodemailer");
const {deliverAccount} = require('../../../config/services.js');

const _render_HtmlBody = (token)=>{
  return (
    '<html>'+
      '<body>'+
      '<div>'+
        '<p>"Welcome to Corner as your new horizon."</p>'+
        '<p>"Please click "</p>'+
        '<a href="http://teamcorner.nctu.me/router/register/confirm?token="'+token+'>"here"</a>'+
        '<p>" to complete email verification!"</p>'+
        '<p>"then, enjoy your adventure."</p>'+
      '</div>'+
      '</body>'+
    '</html>'
  )
}

function deliverVerifiedMail(userInfo, token){
  return new Promise((resolve, rejec)=>{
    let transporter = nodemailer.createTransport({
      service: "Mailjet",
      auth: {
        user: deliverAccount.user,
        pass: deliverAccount.password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Coner team" <noreply@teamcorner.com>', // sender address
      to: userInfo.email, // list of receivers
      subject: userInfo.first_name+", please confirm your account", // Subject line
      html: _render_HtmlBody(token)
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {throw {status: 500, err: 'There was an error'+error};}
      console.log('Message %s sent: %s', info.messageId, info.response);
      resolve();
    });
  })
}

module.exports = deliverVerifiedMail;
