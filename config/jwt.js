const {envJwtSecret} = require('./.env.json');

exports.verify_key = envJwtSecret.userToken;

exports.verify_key_refresh = envJwtSecret.userRefresh;

exports.verify_email = envJwtSecret.emailVerifiedToken;

exports.verify_forget = envJwtSecret.pwforgetVerifiedToken;
