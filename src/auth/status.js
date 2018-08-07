const express = require('express');
const status = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const {verify_key} = require('../../config/jwt.js');
const {connection_key} = require('../../config/database.js');

const database = mysql.createPool(connection_key);

//verify token here, for any not login or register request
status.use(function(req, res) {
  console.log('check auth status')
  let token = req.body.token || req.headers['token'] || req.query.token;
  let resData = {};
  if (token) {
    jwt.verify(token, verify_key, function(err, payload) {
      if (err) {
        resData['error'] = 1;
        resData['data'] = "Token is invalid";
        res.status(401).json(resData);
      } else {
        database.getConnection(function(err, connection){
          if (err) {
            resData['error'] = 1;
            resData['data'] = 'Internal Server Error';
            res.status(500).json(resData);
            throw err;
          } else {
            connection.query('SELECT * FROM users WHERE id = ?', [payload.user_Id], function(err, rows, fields) {
              if (err) {
                resData['error'] = 1;
                resData['data'] = 'Error Occured!';
                res.status(500).json(resData);
                throw err;
              } else {
                if (rows.length > 0) {
                  let userInfo = rows[0];
                  resData.error = 0;
                  resData['data'] = "this is a valid token";
                  resData['userBasic'] = {account: userInfo.account};
                  res.status(200).json(resData);
                } else {
                  resData.error = 2;
                  resData['data'] = 'account does not exist!';
                  res.status(204).json(resData);
                }
              }
            });
            connection.release();
          }
        });
      }
    });
  } else {
    resData['error'] = 1;
    resData['data'] = 'Please send a token';
    res.status(403).json(resData);
  }
});

module.exports = status;
