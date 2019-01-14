const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const {verify_key} = require('../../config/jwt.js');
const {
  _select_Basic
} = require('./utils/dbSelectHandler.js');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('./utils/reserrHandler.js');

const opts = {};

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = verify_key;

module.exports = (passport)=>{
  passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
    let userId = jwt_payload.user_Id;
    let mysqlForm = {
      accordancesList: [[userId]]
    },
    conditionUser = {
      table: "users",
      cols: ["id", "account", "first_name", 'last_name'],
      where: ["id"]
    };
    _select_Basic(conditionUser, mysqlForm.accordancesList).then((results)=>{
      if(results[0]) {
          return done(null, results[0]);
      }
      return done(null, false);
    }).catch((errObj)=>{
      console.log("error occured during: passport promise: "+errObj.err)
      switch (errObj.status) {
        case 500:
          _handler_err_Internal(errObj.err, res);
          break;
        default:
          _handler_err_Internal(errObj.err?errObj.err:errObj, res);
      }
    });
  }));
}
