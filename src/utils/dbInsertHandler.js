const mysql = require('mysql');
const {connection_key} = require('../../config/database.js');

const database = mysql.createPool(connection_key);

exports._insert_withPromise_Basic = (table, dataSet)=>{
  return new Promise((resolve, reject)=>{
    database.getConnection(function(err, connection){
      if (err) {
        console.log("error occured when getConnection to insert to "+table);
        reject({status: 500, err: err});
      }else{
        connection.query('INSERT INTO '+table+' SET ?', dataSet, function(err, result, fields) {
          if (err) {reject({err: err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
          console.log('database connection success: '+table);
          resolve();
        })
      }
    })
  })
}

exports._insert_basic = (condition, valuesArr)=>{
  return new Promise((resolve, reject)=>{
    //confirm the valuesArr is valid and not empty
    valuesArr.length>0 ?(
      database.getConnection(function(err, connection){
        if (err) {
          console.log("error occured when getConnection to insert to "+condition.table);
          reject({status: 500, err: err});
        }else{
          connection.query('INSERT INTO '+condition.table+" "+condition.col+' VALUES ?', [valuesArr], function(err, result, fields) {
            if (err) {reject({err: err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
            console.log('database connection success: '+condition.table);
            resolve(result);
          })
        }
      })
    ):(
      resolve([])
    )
  }).catch((errObj)=>{return errObj})
}

exports._insert_basic_Ignore = (condition, valuesArr)=>{
  return new Promise((resolve, reject)=>{
    //confirm the valuesArr is valid and not empty
    valuesArr.length>0 ? (
      database.getConnection(function(err, connection){
        if (err) {
          console.log("error occured when getConnection to insert to "+condition.table);
          reject({status: 500, err: err});
        }else{
          connection.query('INSERT IGNORE INTO '+condition.table+" "+condition.col+' VALUES ?', [valuesArr], function(err, result, fields) {
            if (err) {reject({err: err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
            console.log('database connection success: '+condition.table);
            resolve();
          })
        }
      })
    ):(
      resolve([])
    )
  }).catch((errObj)=>{return errObj})
}

exports._insert_raw = (query, values)=>{
  console.log("dbInsertHandler, raw usage")
  return new Promise((resolve, reject)=>{
    //confirm the values is valid and not empty
    values.length>0 ?(
      database.getConnection(function(err, connection){
        if (err) {
          console.log("error occured when getConnection to insert by raw query");
          reject({status: 500, err: err});
        }else{
          connection.query(query, [values], function(err, result, fields) {
            if (err) {reject({err: err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
            console.log('database connection success: to insert by raw query');
            resolve();
          })
        }
      })
    ):(
      resolve([])
    )
  }).catch((errObj)=>{return errObj})
}
