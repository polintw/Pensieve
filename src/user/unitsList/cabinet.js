const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const mkdirp = require('mkdirp');
const update = require('immutability-helper');

function _promise_readCabinet(req, res, focus){
  let listToRead;
  switch(focus){
    case 'all':
      listToRead = "listTime.json";
      break;
    case 'shared':
      listToRead = "listShared.json";
      break;
    case 'collection':
      listToRead = "listCollection.json";
      break;
    default:
      listToRead = "listTime";
  }
  new Promise((resolve, reject)=>{
    jsonfile.readFile('./dev/Statics_users/user/'+listToRead, function(err, data){
      if(err) {console.log('err in Read_listTime');reject(err);}
      let sendingData = new Object();
      //abstract the arr first, preventing damage the original data.
      let listArr = data['listArr'].slice();
      let readers = [];
      listArr.forEach(function(key, index){
        //for "promise.all()" in next resolve: 陣列中的值如果不是Promise物件，會自動使用Promise.resolve方法來轉換
        let readerPromise = new Promise((resolve, reject)=>{
          jsonfile.readFile('./dev/Statics_units/'+key+'/details.json', (err, data)=>{
            if(err) throw err;
            resolve(data);
          });
        }).catch((err) => {
          console.log(err.message)
        })
        readers.push(readerPromise);
      })
      Object.assign(sendingData, {unitsList: listArr});
      Object.assign(sendingData, {unitsDataReader: readers});
      resolve(sendingData)
    })
  }).then((sendingData)=>{
    return new Promise((resolve, reject)=>{
      Promise.all(sendingData.unitsDataReader).then(function(resultsArr){
        let unitsDataSet = new Object();
        resultsArr.forEach(function(detailObj, index){
          unitsDataSet[sendingData.unitsList[index]] = detailObj;
        })
        delete sendingData.unitsDataReader;
        Object.assign(sendingData, {unitsBasicSet: unitsDataSet});
        resolve(sendingData)
      }).catch((err) => {
        console.log(err.message)
      })
    });
  }).then(function(sendingData){
    res.status(200).json(sendingData);
  }).catch(
    (err)=>{
      console.log('err during promise of get unit data: '+err);
      res.status(500).json({
        success: false,
        err: err
      });
    }
  );
}

module.exports = _promise_readCabinet
