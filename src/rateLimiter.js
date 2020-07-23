const rateLimit = require('express-rate-limit');
const winston = require('../config/winston.js');

const limiter = rateLimit({
  // limit each IP to 2.5 requests per sec
  windowMs: 15 * 60 * 1000,
  max: 2250,
  message:{
    'message': "Too many request from this IP, please try again later",
    'console': ''
  },
  onLimitReached: function(req, res){
    winston.warn(`${"WARN: too many request for "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}`);
  }
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message:{
    'message': {'warning': "Login failed too many time or wierd behavior from this IP, please try again after 15 min."},
    'console': ''
  },
  onLimitReached: function(req, res){
    winston.warn(`${"WARN: login request exceeded from ip "} ${req.ip}`);
  }
});
const registerLimiter = rateLimit({ // incl. both /register & /register/mail
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 12,
  message:{
    'message': {'warning': "Trying completing registered process or verifying account too many times."},
    'console': ''
  },
  onLimitReached: function(req, res){
    winston.warn(`${"WARN: too many register request for "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}`);
  }
});
const forgetLimiter = rateLimit({ // incl. /forget/password
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5,
  message:{
    'message': {'warning': "Requesting too /forget too many times."},
    'console': ''
  },
  onLimitReached: function(req, res){
    winston.warn(`${"WARN: too many request to /forget for "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}`);
  }
});
const shareLimiter = rateLimit({
  windowMs: 12 * 60 * 1000, // 12 minutes
  max: 7,
  message:{
    'message':  "Trying sharing a new unit from yuor account too many times.",
    'console': ''
  },
  onLimitReached: function(req, res){
    winston.warn(`${"WARN: share post over the limit for "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}`);
  }
});

const accountPwLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 4,
  message:{
    'message': {'warning': "Asking for resetting password too many times."},
    'console': ''
  },
  onLimitReached: function(req, res){
    winston.warn(`${"WARN: too many request to /account/Password for "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}`);
  }
});
const nodesSearchLimiter = rateLimit({
  windowMs: 12 * 60 * 1000, // 12 minutes
  max: 100,
  message:{
    'message': "Too many request.",
    'console': 'Too many request to /nouns/search.'
  },
  onLimitReached: function(req, res){
    winston.warn(`${"WARN: too many request to /nouns/search for "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}`);
  }
});
const belongsPatchLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 8,
  message:{
    'message': "You've kept setting your belongs repeatedly. Waiting for 20 mins, and please set a place favor you the most. ",
    'console': ''
  },
  onLimitReached: function(req, res){
    winston.warn(`${"WARN: too many request to /profile/nodesBelong for "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}`);
  }
});

module.exports = {
    limiter,
    loginLimiter,
    registerLimiter,
    forgetLimiter,
    shareLimiter,
    accountPwLimiter,
    nodesSearchLimiter,
    belongsPatchLimiter
};
