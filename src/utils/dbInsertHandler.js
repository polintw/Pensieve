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
