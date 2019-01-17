const nodemailer = require("nodemailer");
const {deliverAccount} = require('../../config/services.js');

const _render_HtmlBody = (token)=>{
  return (
    // to string

  )
}

deliverVerifiedMail(userInfo, token)=>{
  return new Promise((resolve, rejec)=>{
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: deliverAccount.user,
        pass: deliverAccount.password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Coner team" <'+diliverAccount.user+'>', // sender address
      to: userInfo.email, // list of receivers
      subject: userInfo.first_name+", please confirm your account", // Subject line
      html: _render_HtmlBody(token)
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {throw {status: 500, err: 'There was an error'+err};}
      console.log('Message %s sent: %s', info.messageId, info.response);
      resolve();
    });
  })
}

module.exports = deliverVerifiedMail();
