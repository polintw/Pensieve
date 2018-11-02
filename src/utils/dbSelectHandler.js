const {
  DIALOGUES_LATEST
} = require('./queryIndicators.js');
const mysql = require('mysql');
const {connection_key} = require('../../config/database.js');

const database = mysql.createPool(connection_key);

exports._select_nounsAttribution_unit_withPromise = (condition)=>{
  return new Promise((resolve, reject)=>{
    database.getConnection(function(err, connection){
      if (err) {
        console.log("error occured when getConnection to select from attribution.");
        reject({err: err});
      }else{
        let selectQuery = "SELECT id_noun FROM attribution WHERE (id_unit) IN (?)";
        connection.query(selectQuery, [condition], function(err, unitRows, fields){
          if (err) {reject({err: err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
          if(unitRows.length> 0){
            let idsArr = unitRows.map((row, index)=>{return [row.id_noun]});
            connection.query("SELECT name FROM nouns WHERE (id) IN (?)", [idsArr], function(err, nameRows, fields){
              if (err) {reject({err: err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
              if(nameRows.length> 0){
                let rowsArr = nameRows.slice();
                resolve(rowsArr);
                connection.release();
              }else{
                reject({err: 'data mismatch.'});
                connection.release();
              };
            });
          }else{
            reject({status: 404, err: 'data mismatch.'});
            connection.release();
          }
        })
      }
    })
  })
};

exports._select_Units_withPromise = (condition, basis)=>{
  let selection = "units";
  return new Promise((resolve, reject)=>{
    database.getConnection(function(err, connection){
      if (err) {
        console.log("error occured when getConnection to select from "+selection);
        reject({status: 500, err: err});
      }else{
        let column = basis? basis:"id";
        let selectQuery = "SELECT * FROM units WHERE ("+column+") IN (?)";
        connection.query(selectQuery, [condition], function(err, rows, fields){
          if (err) {reject({err: err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
          console.log('database connection success: '+selection);
          let rowsArr = rows.slice();
          resolve(rowsArr);
          connection.release();
        })
      }
    })
  })
}

exports._select_UnitsList_withPromise = (condition, basis)=>{
  let selection = "units, List"
  return new Promise((resolve, reject)=>{
    database.getConnection(function(err, connection){
      if (err) {
        console.log("error occured when getConnection to select from "+selection);
        reject({err: err});
      }else{
        let selectQuery = "SELECT id FROM units WHERE ("+basis+") IN (?)";
        connection.query(selectQuery, [condition], function(err, rows, fields){
          if (err) {reject({err: err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
          if(rows.length> 0){
            let rowsArr = rows.slice();
            resolve(rowsArr);
            connection.release();
          }else{
            reject({status: 500, err: 'data mismatch, '+selection});
            connection.release();
          }
        })
      }
    })
  })
}

exports._select_Users_Author_withPromise = (condition)=>{
  let selection = "users, Author";
  return new Promise((resolve, reject)=>{
    database.getConnection(function(err, connection){
      if (err) {
        console.log("error occured when getConnection to select from "+selection);
        reject({err: err});
      }else{
        let selectQuery = "SELECT id, account FROM users WHERE (id) IN (?)";
        connection.query(selectQuery, [condition], function(err, rows, fields){
          if (err) {reject({err: err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
          console.log('database connection success: '+selection);
          if(rows.length> 0){
            let rowsArr = rows.slice();
            resolve(rowsArr);
            connection.release();
          }else{
            reject({err: 'data mismatch, '+selection});
            connection.release();
          }
        })
      }
    })
  })
}

exports._select_Marks_withPromise = (condition, basis)=>{
  let selection = "marks";
  return new Promise((resolve, reject)=>{
    database.getConnection(function(err, connection){
      if (err) {
        console.log("error occured when getConnection to select from "+selection);
        reject({status: 500, err: err});
      }else{
        let selectQuery = "SELECT * FROM marks WHERE ("+basis+") IN (?)";
        connection.query(selectQuery, [condition], function(err, rows, fields){
          if (err) {reject({err: err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
          console.log('database connection success: '+selection);
          if(rows.length> 0){
            let rowsArr = rows.slice();
            resolve(rowsArr);
            connection.release();
          }else{
            reject({status: 500, err: 'data mismatch in '+selection});
            connection.release();
          }
        })
      }
    })
  })
}

exports._select_Threads_withPromise = (condition, basis)=>{
  let selection = "threads";
  return new Promise((resolve, reject)=>{
    database.getConnection(function(err, connection){
      if (err) {
        console.log("error occured when getConnection to select from "+selection);
        reject({status: 500, err: err});
      }else{
        let selectQuery = "SELECT * FROM threads WHERE ("+basis+") IN (?)";
        connection.query(selectQuery, [condition], function(err, results, fields){
          if (err) {reject({err: err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
          console.log('database connection success: '+selection);

          let resultsArr = results.slice();
          resolve(resultsArr);
          connection.release();
        })
      }
    })
  })
}

exports._select_withPromise_Basic = (queryIndicator, condition)=>{
  let queryObj = queryGenerator(queryIndicator);
  let selection = queryObj.table,
      selectQuery = queryObj.query;
  return new Promise((resolve, reject)=>{
    database.getConnection(function(err, connection){
      if (err) {
        console.log("error occured when getConnection to select from "+selection);
        reject({status: 500, err: err});
      }else{
        connection.query(selectQuery, [condition], function(err, results, fields){
          if (err) {reject({err: err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
          console.log('database connection success: '+selection);
          if(results.length> 0){
            let rowsArr = results.slice();
            resolve(rowsArr);
            connection.release();
          }else{
            reject({status: 500, err: 'data mismatch in '+selection});
            connection.release();
          }
        })
      }
    })
  })
}

const selectQuery_DIALOGUES_LATEST = "SELECT id_thread, id_talker, editor_content, MAX(created) AS max_date FROM dialogues WHERE id_thread = ? ORDER BY max_date";

function queryGenerator(queryIndicator){
  switch (queryIndicator) {
    case DIALOGUES_LATEST:
      return {query: selectQuery_DIALOGUES_LATEST, table: "dialogues"}
      break;
    default:
      return {query: selectQuery_DIALOGUES_LATEST, table: "dialogues"}
  }
}
