const {
  UNITS_GENERAL,
  USERS_GENERAL,
  MARKS_UNITS,
  MARKS_IDLIST_UNITS,
  DIALOGUES_LATEST,
  TRACKS_USERS,
  BROADS_USERS_UNITS,
  ATTRIBUTION_UNIT,
  NOUNS_NAME
} = require('./queryIndicators.js');
const mysql = require('mysql');
const winston = require('../../config/winston.js');
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
  let queryObj = querySwitcher(queryIndicator);
  let selection = queryObj.table,
      selectQuery = queryObj.query;
  return new Promise((resolve, reject)=>{
    //confirm the condition is valid, and not empty
    condition.length>0 ? (
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
    ):(
      resolve([])
    )
  })
}

exports._select_withPromise_BasicNoLength = (queryIndicator, condition)=>{
  let queryObj = querySwitcher(queryIndicator);
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
          let rowsArr = results.slice();
          resolve(rowsArr);
          connection.release();
        })
      }
    })
  })
}

const selectQuery_UNITS_GENERAL = "SELECT * FROM units WHERE (id) IN (?)";
const selectQuery_USERS_GENERAL = "SELECT id, account FROM users WHERE (id) IN (?)";
const selectQuery_MARKS_UNITS = "SELECT * FROM marks WHERE (id_unit) IN (?)";
const selectQuery_MARKS_IDLIST_UNITS = "SELECT id, id_unit FROM marks WHERE (id_unit) IN (?)";
const selectQuery_DIALOGUES_LATEST = "SELECT id_thread, id_talker, editor_content, MAX(created) AS max_date FROM dialogues WHERE id_thread = ? ORDER BY max_date";
const selectQuery_TRACKS_USERS = "SELECT * FROM tracks WHERE (id_user) IN (?)";
const selectQuery_BROADS_USERS_UNITS = "SELECT id_unit FROM broads WHERE (id_user) IN (?)";
const selectQuery_ATTRIBUTION_UNIT = "SELECT id_noun FROM attribution WHERE (id_unit) IN (?)";
const selectQuery_NOUNS_NAME = "SELECT id, name FROM nouns WHERE (name) IN (?)";

function querySwitcher(queryIndicator){
  switch (queryIndicator) {
    case UNITS_GENERAL:
      return {query: selectQuery_UNITS_GENERAL, table: "units"}
      break;
    case USERS_GENERAL:
      return {query: selectQuery_USERS_GENERAL, table: "users"}
      break;
    case MARKS_UNITS:
      return {query: selectQuery_MARKS_UNITS, table: "marks"}
      break;
    case MARKS_IDLIST_UNITS:
      return {query: selectQuery_MARKS_IDLIST_UNITS, table: "marks"}
      break;
    case DIALOGUES_LATEST:
      return {query: selectQuery_DIALOGUES_LATEST, table: "dialogues"}
      break;
    case TRACKS_USERS:
      return {query: selectQuery_TRACKS_USERS, table: "tracks"}
      break;
    case BROADS_USERS_UNITS:
      return {query: selectQuery_BROADS_USERS_UNITS, table: "broads"}
      break;
    case ATTRIBUTION_UNIT:
      return {query: selectQuery_ATTRIBUTION_UNIT, table: "attribution"}
      break;
    case NOUNS_NAME:
      return {query: selectQuery_NOUNS_NAME, table: "nouns"}
      break;
    default:
      return {query: '', table: ""}
  }
}

exports._select_Basic = (condition, accordance)=>{
  return new Promise((resolve, reject)=>{
    database.getConnection(function(err, connection){
      if (err) {
        //because there are multiple error handleing system connect to this function, we compromise the rejection for everyone.
        reject({status: 500, err: err, code: 131, message: 'connection to db from SelectHandlert, target '+condition.table+': '+err});
      }else{
        let pWhereCol = new Promise((resolveWhereCol)=>{
          let where = "";
          //in case there is not any 'where' need to take concern
          if(condition.where.length>0){
            where += ' WHERE (';
            condition.where.forEach((col, index)=>{
              where = where + (index>0?", ":"") + col;
            });
            where = where +") "+ ("comparison" in condition ? condition.comparison[0].operator+" "+condition.comparison[0].qmark:"IN (?)");
          }
          resolveWhereCol(where);
        }).catch((err)=>{reject({err: err, code: 131, message: 'unexpected from promise WhereCol in SlectHandler: '+err})}),
        pConditioncol = new Promise((resolveConditionCol)=>{
          let cols = '';
          condition.cols.forEach((col, index)=>{
            cols = cols + (index>0?", ":"") + col;
          });
          resolveConditionCol(cols);
        }).catch((err) => { reject({ err: err, code: 131, message: 'unexpected from promise ConditionCol in SlectHandler: '+ err }) });
        Promise.all([pConditioncol, pWhereCol]).then((strings)=>{
          let selectQuery = "SELECT "+strings[0]+" FROM "+condition.table+strings[1];
          connection.query(selectQuery, [accordance], function(err, results, fields){
            if (err) { reject({ err: err, code: 131, message: 'query to db from SelectHandler, `' + selectQuery+'`, '+err});connection.release(); return} //only with "return" could assure the promise end immediately if there is any error.
            let rowsArr = results.slice();
            resolve(rowsArr);
            connection.release();
          })
        }).catch((errObj)=>{reject(errObj)})
      }
    })
  })
}
