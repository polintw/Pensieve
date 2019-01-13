const express = require('express');
const register = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const {verify_key} = require('../../config/jwt.js');
const {connection_key} = require('../../config/database.js');

const database = mysql.createPool(connection_key);

//handle register request
register.use(function(req, res) {
  let today = new Date();
  let resData = {};
  let userData = {
    'first_name': req.body.first_name,
    'last_name': req.body.last_name,
    'email': req.body.email,
    'password': req.body.password,
    'created': today
  }
  database.getConnection(function(err, connection) {
    if (err) {
      resData['error'] = 1;
      resData['message'] = "Internal Server Error";
      res.status(500).json(resData);
    } else {
      connection.query('INSERT INTO users SET ?', userData, function(err, rows, fields) {
        if (!err) {
          resData.error = 0;
          resData['message'] = 'User registered successfully!';
          res.status(201).json(resData);
        } else {
          resData['error'] = 1;
          resData['message'] = "Error Occured";
          res.status(400).json(resData);
        }
      });
      connection.release();
    }
  });
});

module.exports = register;
