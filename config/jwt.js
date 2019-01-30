const {envJwtSecret} = require('./.env.json');

exports.verify_key = envJwtSecret.userToken;

exports.verify_email = envJwtSecret.emailVerifiedToken;
