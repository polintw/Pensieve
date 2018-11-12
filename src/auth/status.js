const express = require('express');
const status = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const {verify_key} = require('../../config/jwt.js');
const {connection_key} = require('../../config/database.js');

const database = mysql.createPool(connection_key);

//verify token here, for any not login or register request
status.use(function(req, res) {
  let token = req.body.token || req.headers['token'] || req.query.token;
  let resData = {};
  if (token) {
    jwt.verify(token, verify_key, function(err, payload) {
      if (err) {
        resData['error'] = 1;
        resData['message'] = "Token is invalid";
        res.status(401).json(resData);
        console.log("error occured during status confirm: step jwt verify "+err)
      } else {
        database.getConnection(function(err, connection){
          if (err) {
            resData['error'] = 1;
            resData['message'] = 'Internal Server Error';
            res.status(500).json(resData);
            console.log("error occured during status confirm: step getConnection"+err)
          } else {
            connection.query('SELECT id, account FROM users WHERE id = ?', [payload.user_Id], function(err, rows, fields) {
              if (err) {
                resData['error'] = 1;
                resData['message'] = 'Error Occured!';
                res.status(500).json(resData);
                console.log("error occured during status confirm: step query"+err)
              } else {
                if (rows.length > 0) {
                  let userInfo = rows[0];
                  resData.error = 0;
                  resData['message'] = "this is a valid token";
                  resData['userInfo'] = {account: userInfo.account, id: userInfo.id};
                  res.status(200).json(resData);
                } else {
                  resData.error = 2;
                  resData['message'] = 'account does not exist!';
                  res.status(401).json(resData);
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
    resData['message'] = 'Please send a token';
    res.status(403).json(resData);
  }
});

module.exports = status;
