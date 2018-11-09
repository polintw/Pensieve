const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('./reserrHandler.js');

exports._promise_composeUsersBasic_old = (connection, dataObj)=>{
  return new Promise((resolve, reject)=>{
    let selectQuery = "SELECT id, account FROM users WHERE (id) IN (?)";
    connection.query(selectQuery, [dataObj.temp.usersList], function(err, rows, fields){
      if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
      console.log('database connection: success.')
      if(rows.length> 0){
        rows.forEach((row, index)=>{
          dataObj.usersBasic[row.id] = {
            authorAccount: row.account
          }
        })
        resolve(dataObj);
      }else{
        _handler_err_Internal('data mismatch.', res);
        reject('data mismatch.');
      }
    })
  })
};

exports._promise_composeMarksBasic_old = (connection, dataObj, basis)=>{
  return new Promise((resolve, reject)=>{
    let selectQuery = "SELECT * FROM marks WHERE ("+basis+") IN (?)";
    connection.query(selectQuery, [dataObj.temp.marksList], function(err, rows, fields){
      if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
      if(rows.length> 0){
        rows.forEach((row, index)=>{
          let markSet = {
            editorContent: JSON.parse(row.editor_content),
            layer: row.layer
          }
          dataObj.marksBasic[row.id] = markSet;
          if(row.id_unit in dataObj.unitsBasic){
            dataObj.unitsBasic[row.id_unit].marksList.push(row.id);
          }else{
            dataObj.unitsBasic[row.id_unit] = {marksList: [row.id]};
          }
        })
        resolve(dataObj);
      }else{
        _handler_err_Internal('data mismatch.', res);
        reject('data mismatch.');
      }
    })
  })
}

exports._promise_composeUnitsBasic_old = (connection, dataObj, basis)=>{
  return new Promise((resolve, reject)=>{
    let selectQuery = "SELECT * FROM units WHERE ("+basis+") IN (?)";
    connection.query(selectQuery, [dataObj.temp.unitsList], function(err, rows, fields){
      if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
      if(rows.length> 0){
        rows.forEach((row, index)=>{
          dataObj.unitsBasic[row.id] = {
            authorId: row.id_author,
            pic_layer0: row.url_pic_layer0,
            created: row.established
          };
        })
        resolve(dataObj);
      }else{
        _handler_err_Internal('data mismatch.', res);
        reject('data mismatch.');
      }
    })
  })
};
