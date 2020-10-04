const {
  envServiceGeneral,
  envServiceSmtp
} = require('./.env.json');

exports.domain = {
  name: envServiceGeneral.appDomain
}

exports.smtpAccount = {
  user: envServiceSmtp.user,
  password: envServiceSmtp.password
};

exports.email = {
  userContact: envServiceGeneral.emailUserContact
}
