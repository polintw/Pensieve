const path = require("path");
const jwt = require('jsonwebtoken');
const Validator = require('validator');
const deliverVerifiedMail = require('./verifiedMail.js');
const {
  verify_email
} = require('../../../config/jwt.js');
const winston = require('../../../config/winston.js');
const {
  _select_Basic
} = require('../../utils/dbSelectHandler.js');
const _DB_users = require('../../../db/models/index').users;
const _DB_users_apply = require('../../../db/models/index').users_apply;
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError,
  tooManyReqError
} = require('../../utils/reserrHandler.js');
const isEmpty = require('../../utils/isEmpty');

function _handle_auth_mailConfirm_GET(req, res){
  const reqToken = req.body.token || req.headers['token'] || req.query.token;
  jwt.verify(reqToken, verify_email, function(err, payload) {
    if (err) {
      winston.error(`${"Error: JWT verify, "} - ${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      res.status(401).redirect('/confirm/fail');
    } else {
      let userId = payload.user_Id;
      let mysqlForm = {
        accordancesList: [[userId]]
      },
      conditionUser = {
        table: "users_apply",
        cols: ["id_user", "token_email","status"],
        where: ["id_user"]
      };
      _select_Basic(conditionUser, mysqlForm.accordancesList).then((rows)=>{
        if(rows.length>0){
          let applyData = rows[0];
          // for link to confirm use, 2 condition: 'unverified/frequentUnverified' or 'newly/active'
          if((applyData.status != 'unverified') && (applyData.status != 'frequentUnverified')) throw {custom: true, status: 302, path: '/confirm/success'};
          else{
            if(reqToken == applyData.token_email){
              let pupdateUsers = Promise.resolve(
                _DB_users.findOne({
                  where: {id: userId},
                  attributes: ['id', 'status']
                }).then(users => {
                  return users.update(
                    { status: 'newly'},
                    {where: {id: userId}}
                  );
                }).catch((err)=>{console.log('error from pupdateUsers');throw {err: err}})
              );
              let pupdateUsersApply = Promise.resolve(
                //it's bad to use 'findOne' before update, the result instance is not proper here
                _DB_users_apply.update(
                  {status:'newly'},
                  {where:{id_user: userId}}
                ).catch((err)=>{console.log('error from pupdateUsersApply');throw {err: err}})
              );
              return Promise.all([pupdateUsers, pupdateUsersApply]).then((results)=>{
                res.status(200).redirect('/confirm/success');
              });
            }else{throw {custom: true, status: 401, path: '/confirm/fail', err: 'token_email inconsistent for user sended'}};
          }
        }else{
          throw {custom: true, status: 404, path: '/confirm/fail', err: 'no such user found '+userId};
        }
      }).catch((errObj)=>{
        //catch errors, both custom and internal
        if('err' in errObj) console.log("Error catched during: auth/confirm register promise: "+errObj.err);
        errObj = Object.assign({status: 500, path: '/confirm/fail'}, errObj);
        res.status(errObj.status).redirect(errObj.path);
      });
    }
  })
}

async function _handle_auth_mailResend_PATCH(req, res){
  //input format validation first
  let errors = {};
  req.body.email = !isEmpty(req.body.email) ? req.body.email : '';
  if (!Validator.isEmail(req.body.email)) {
    errors.email = 'Email is invalid';
  }
  if (Validator.isEmpty(req.body.email)) {
    errors.email = 'Email is required';
  }
  let isValid = isEmpty(errors);
  if (!isValid) {
    _handle_ErrCatched (new forbbidenError(errors, 186), req, res);
    return;
  }
  // check the email has signed up
  const userRow = await _DB_users.findOne({
    where: { email: req.body.email },
    attributes: ['id', 'status', 'first_name']
  });
  if (!userRow) { //null, nothing found
    _handle_ErrCatched(new notFoundError({ "email": "this email hasn't sign up yet!" }, 50), req, res);
    return;
  };
  // then use the status in users_apply, which has 'active', 'newly', 'unverified', 'frequentUnverified/Forget'
  const userApplyRow = await _DB_users_apply.findOne({
    where: { id_user: userRow.id }
  });

  new Promise((resolve, reject)=>{
    /*
    a new status 'frequent'
    last updatedat too close to now if 'unverified',
    turn to 'frequentUnverified'
    need to wait a period if 'frequent',
    but shift back to 'unverified' if has warned.
    */
    if(userRow.status != 'unverified'){ // mail had been confirmed, base on status in .users
      reject (new forbbidenError({"warning": "Your email had been verified, could sign in directly."}, 85));
    }
    else if(userApplyRow.status == 'frequentUnverified'){ // check if the cerified mail had been sent too many time, base on users_apply
      _DB_users_apply.findOne({
        where: { id_user: userRow.id }
      }).then((resultApply)=>{
        // checking the frequency here, in order to update if needed
        let frequentify = false;
        if(!!resultApply.updatedAt){ // only need if the updatedAt ia not NULL
          // prepare time for later compare
          let dateNow = new Date(),
          dateLastReq = new Date(resultApply.updatedAt);
          let nowTime = dateNow.getTime(),
          lastReqTime = dateLastReq.getTime();

          if((nowTime - lastReqTime) < 2400000) frequentify = true; //req twice less than 40 mins
        };

        if(frequentify) throw new tooManyReqError({"warning": "Havn't seen the mail? Take a look at spam folder, or take a rest before it came. You could resend the mail again 30 mins later."}, 150)
        else { // pass the 'cool time'
          return _DB_users_apply.update(
            {status: 'unverified'},
            { where: {id: userRow.id}}
          )
          .then(()=>{
            return new Promise((resolveJWT, rejectJWT)=>{
              //sign a token for email verification
              const payload = {
                user_Id: userRow.id,
                token_property: 'emailVerified'
              };
              jwt.sign(JSON.parse(JSON.stringify(payload)), verify_email, {
                expiresIn: '1d'
              }, (err, token) => {
                if(err){
                  rejectJWT(new internalError("jwt.sign error in register/mail.js: "+err, 131));
                }
                else {
                  resolveJWT(token);
                }
              });
            });
          }).then((tokenEmail)=>{
            //update token to users_apply
            return resultApply.update(
              { token_email: tokenEmail},
              { where: { id_user: userRow.id } }
            ).then(()=>{
              return tokenEmail;
            })
          }).then((tokenEmail)=>{
            //finally, sending the mail to the user
            let userInfo = {
              email: req.body.email,
              first_name: userRow.first_name
            }
            return deliverVerifiedMail(userInfo, tokenEmail);
          });
        }
      })
      .then(()=>{ resolve(); })
      .catch((error)=>{reject(error);});
    }
    else{ // any status accepted to send verifications again
      //start to send email verification again
      new Promise((resolveJWT, rejectJWT)=>{
        //sign a token for email verification
        const payload = {
          user_Id: userRow.id,
          token_property: 'emailVerified'
        };
        jwt.sign(JSON.parse(JSON.stringify(payload)), verify_email, {
          expiresIn: '1d'
        }, (err, token) => {
          if(err){
            rejectJWT(new internalError("jwt.sign error in register/mail.js: "+err, 131));
          }
          else {
            resolveJWT(token);
          }
        });
      }).then((tokenEmail)=>{
        return _DB_users_apply.findOne({
          where: { id_user: userRow.id }
        }).then((resultApply)=>{
          // checking the frequency here, in order to update if needed
          let frequentify = false;
          if(!!resultApply.updatedAt){ // only need if the updatedAt ia not NULL
            // prepare time for later compare
            let dateNow = new Date(),
            dateLastReq = new Date(resultApply.updatedAt);
            let nowTime = dateNow.getTime(),
            lastReqTime = dateLastReq.getTime();

            if((nowTime - lastReqTime) < 1200000) frequentify = true; //req twice less than 20 mins
          };
          //update token to users_apply
          return resultApply.update(
            { token_email: tokenEmail},
            { where: { id_user: userRow.id } }
          ).then(()=>{
            if(frequentify){
              return _DB_users_apply.update(
                {status: 'frequentUnverified'},
                {where: { id_user: userRow.id}}
              )
              .then(()=>{
                return;
              })
            }
            else return;
          }).then(()=>{
            return tokenEmail;
          })
        })
        .catch((err) =>{ throw err;});

      }).then((tokenEmail)=>{
        //finally, sending the mail to the user
        let userInfo = {
          email: req.body.email,
          first_name: userRow.first_name
        }
        return deliverVerifiedMail(userInfo, tokenEmail);
      })
      .then(()=>{ resolve(); })
      .catch((error)=>{reject(error);}); // this line is neccessary for promise in promise
    };
  }).then(()=>{
    //complete the process, and response to client
    let resData = {
      "code": "",
      "message": {"warning": "Verification has been sended again to your email address."},
      "console": ""
    };
    res.status(200).json(resData);
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = {
  _handle_auth_mailConfirm_GET,
  _handle_auth_mailResend_PATCH
};
