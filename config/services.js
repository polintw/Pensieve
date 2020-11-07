const {
  envServiceGeneral,
  envServiceSmtp
} = require('./.env.json');

exports.domain = {
  name: envServiceGeneral.appDomain,
  protocol: envServiceGeneral.appProtocol
}

exports.smtpAccount = {
  user: envServiceSmtp.user,
  password: envServiceSmtp.password
};

exports.email = {
  userContact: envServiceGeneral.emailUserContact
}
