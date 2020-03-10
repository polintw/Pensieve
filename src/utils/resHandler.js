const winston = require('../../config/winston.js');

exports._res_success = function(res, sendingData, message){
  if(process.env.NODE_ENV == 'development'){winston.verbose(message);};
  delete sendingData.temp;
  let resData = {};
  resData['error'] = 0;
  resData['message'] = (!!message) ? message: 'req success!';
  resData['main'] = sendingData;
  resData = JSON.stringify(resData);
  res.status(200).json(resData);
}

exports._res_success_201 = function(res, sendingData, message){
  if(process.env.NODE_ENV == 'development'){winston.verbose(message);};
  let resData = {};
  resData['error'] = 0;
  resData['message'] = (message.length > 0) ? message: 'req success!';
  resData['main'] = sendingData;
  resData = JSON.stringify(resData);
  res.status(201).json(resData);
}
