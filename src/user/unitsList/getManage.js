const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const mkdirp = require('mkdirp');
const update = require('immutability-helper');

exports._promise_unitLtd = function(req, res){
  new Promise((resolve, reject)=>{
    jsonfile.readFile('./dev/Statics_units/idList.json', function(err, data){
      if(err) {console.log('err in Read_units_idList');reject(err);}
      //abstract the arr first, preventing damage the original data.
      let idArr = data['idArr'].slice();
      let readers = [];
      idArr.forEach(function(key, index){
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
      resolve(readers);
    });
  }).then((readers)=>{
    return new Promise((resolve, reject)=>{
      Promise.all(readers).then(function(resultsArr){
        let unitsDataSet = new Object();
        let unitsList = [];
        resultsArr.forEach(function(detailObj, index){
          let unitName = detailObj.submitTime;
          unitsList.push(unitName);
          unitsDataSet[unitName] = detailObj;
        })
        let sendingData = new Object();
        Object.assign(sendingData, {unitsList: unitsList,unitsBasicSet: unitsDataSet});
        resolve(sendingData)
      }).catch((err) => {
        console.log(err.message)
      })
    });
  }).then((sendingData)=>{
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
};

exports._promise_unitSingle = function(req, res){
  const reqUnit = req.query.unitName;
  const reqUser = req.query.id; //should come from token verified in the future.

  new Promise((resolve, reject)=>{
    console.log('get old one: details.');
    jsonfile.readFile('./dev/Statics_units/'+reqUnit+'/details.json', function(err, data){
      if(err) {console.log('err in Read_sharedData');reject(err);}
      let sendingData = new Object();
      Object.assign(sendingData, data);
      resolve(sendingData)
    })
  }).then(function(sendingData){
    return new Promise((resolve, reject)=>{
      console.log('get old one: check permission.');
      sendingData['action'] = 'both';
      if(sendingData.arthur == reqUser){
        sendingData['action'] = 'edit';
        resolve(sendingData);
      }else{
        jsonfile.readFile('./dev/Statics_users/user/listCollection.json', function(err, data){
          if(err) {console.log('err in Read_listCollection');reject(err);};
          data["listArr"].forEach(function(name, index){
            if(reqUnit == name){
              sendingData['action'] = 'collected';
            }
          })
          resolve(sendingData);
        })
      }
    })
  }).then(function(sendingData){
    return new Promise((resolve, reject)=>{
      console.log('get old one: marks.');
      jsonfile.readFile('./dev/Statics_units/'+reqUnit+'/marks.json', function(err, data){
        if(err) {console.log('err in Read_marksData');reject(err);}
        sendingData['coverMarksObj'] = data.coverMarksObj;
        sendingData['beneathMarksObj'] = data.beneathMarksObj;
        resolve(sendingData);
      });
    })
  }).then((sendingData)=>{
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
};

exports._promise_readCabinet = function(req, res, focus){
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
