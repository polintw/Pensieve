const express = require('express');
const auth = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const {verify_key} = require('../../config/jwt.js');
const {connection_key} = require('../../config/database.js');

const database = mysql.createPool(connection_key);

//handle register request
auth.post('/register', function(req, res) {
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
      resData['data'] = "Internal Server Error";
      res.status(500).json(resData);
    } else {
      connection.query('INSERT INTO users SET ?', userData, function(err, rows, fields) {
        if (!err) {
          resData.error = 0;
          resData['data'] = 'User registered successfully!';
          res.status(201).json(resData);
        } else {
          resData['data'] = "Error Occured";
          res.status(400).json(resData);
        }
      });
      connection.release();
    }
  });
});

//handle log in request
auth.post('/login', function(req, res) {
  let resData = {};
  let account = req.body.account;
  let password = req.body.password;

  database.getConnection(function(err, connection){
    if (err) {
      resData['error'] = 1;
      resData['data'] = 'Internal Server Error';
      res.status(500).json(resData);
    } else {
      connection.query('SELECT * FROM users WHERE account = ?', [account], function(err, rows, fields) {
        if (err) {
          resData['error'] = 1;
          resData['data'] = 'Error Occured!';
          res.status(400).json(resData);
        } else {
          if (rows.length > 0) {
            if (rows[0].password == password) {
              token = jwt.sign(rows[0], verify_key, {
                expiresIn: '7d'
              });
              resData.error = 0;
              resData['token'] = token;
              res.status(200).json(resData);
            } else {
              resData['error'] = 1;
              resData['data'] = 'account and Password does not match';
              res.status(204).json(resData);
            }
          } else {
            resData.error = 1;
            resData['data'] = 'account does not exist!';
            res.status(204).json(resData);
          }
        }
      });
      connection.release();
    }
  });
});

//verify token here, for any not login or register request
auth.use(function(req, res, next) {
  let token = req.body.token || req.headers['token'];
  let resData = {};
  if (token) {
    jwt.verify(token, verify_key, function(err) {
      if (err) {
        resData['error'] = 1;
        resData['data'] = "Token is invalid";
        res.status(500).json(resData);
      } else {
        next();
      }
    });
  } else {
    resData['error'] = 1;
    resData['data'] = 'Please send a token';
    res.status(200).sendFile(
      path.join(__dirname+'/Pages/html_Login.html'
    ), {
      headers: {'Content-Type': 'text/html'}
    }, function (err) {
      if (err) {
        throw err
      }
    });
  }
});

auth.get('/getUsers', function(req, res) {
  let token = req.body.token || req.headers['token'];
  let resData = {};
  database.getConnection(function(err, connection) {
    if (err) {
      resData['error'] = 1;
      resData['data'] = 'Internal Server Error';
      res.status(500).json(resData);
    } else {
      connection.query('SELECT *FROM users', function(err, rows, fields) {
        if (!err) {
          resData['error'] = 0;
          resData['data'] = rows;
          res.status(200).json(resData);
        } else {
          resData['data'] = 'No data found';
          res.status(204).json(resData);
        }
      });
      connection.release();
    }
  });
});

module.exports = auth;
