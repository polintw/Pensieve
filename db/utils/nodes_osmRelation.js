'use strict';

const fs = require('fs');
const path = require('path');
const parse = require('csv-parse')
const axios = require('axios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const env = process.env.NODE_ENV || 'development';
const { envAppRootPath } = require('./config/.env.json');
const config = require(path.join(envAppRootPath, './config/sequelize.js'))[env]; //depend on the path to /config

const db = {};

let sequelize;

sequelize = new Sequelize(config.database, config.username, config.password, config);

//way to recruit Sequelize DB models
fs
    .readdirSync(path.join(envAppRootPath, './db/models/')) //read the model file of db, path depend on the dir path
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== "index.js") && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(envAppRootPath, "./db/models/", file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

//----------------------------------------------------------

async function asyncGeocodeReq(csvData){
    try {
        console.log(">>> start Geocode Req.")
        // start from: make an obj by data.name
        let nameList = [],
            firstLayer= {}, // firstLayer should be the highest, no prefix
            secondLayer = {
              secondLayerPrefixList: []
            },
            thirdLayer = {
              thirdLayerPrefixList: []
            };
        let firstLayer_level = ["2"], // basically always '2', level of 'country'
            secondLayer_level = ["4", "6"], thirdLayer_level = ["5","7","8"]; // depend on country, here is layer of 'Taiwan'
        csvData.forEach((obj, index) => {
          if(obj['name:en'].length == 0) return; // prevent any empty('') obj
          nameList.push(obj['name:en']);
          if(firstLayer_level.indexOf(obj['admin_level']) > (-1)){
            firstLayer[obj['name:en']] = Object.assign({}, obj);
          }
          else if(secondLayer_level.indexOf(obj['admin_level']) > (-1)){
            let prefixId = obj['prefix_osmId'];
            if(!(prefixId in secondLayer)) secondLayer[prefixId] = {};
            secondLayer[prefixId][obj['name:en']] = Object.assign({}, obj);
            if(secondLayer["secondLayerPrefixList"].indexOf(prefixId) < 0) secondLayer['secondLayerPrefixList'].push(prefixId);
          }
          else if(thirdLayer_level.indexOf(obj['admin_level']) > (-1)){
            let prefixId = obj['prefix_osmId'];
            if(!(prefixId in thirdLayer)) thirdLayer[prefixId] = {};
            thirdLayer[prefixId][obj['name:en']] = Object.assign({}, obj);
            if(thirdLayer["thirdLayerPrefixList"].indexOf(prefixId) < 0) thirdLayer['thirdLayerPrefixList'].push(prefixId);
          };
        });
        // then: from our own database, select the nodes we want as base
        let nodesCandiSelection = await db.nouns.findAll({
          where: {
            language: 'en',
            category: 'location_admin',
            // beneath are optional depend on aimmed group, this pair is for 'country' level
            [Op.and]: {
              [Op.or]: [
                {parent_id: 4570},
                {
                  [Op.and]: {
                    parent_id: {[Op.gt]: 758},
                    parent_id: {[Op.lt]: 781}
                  }
                }
              ]
            }
          }
        });

        console.log('>>> selection result, length = ', nodesCandiSelection.length);

        let round = 0, insertArr = [], noMatchCount = 0, noMatchList = [], noOsmRes = [];
        // claim a f() to return absolute osmId for req
        function osmIdConfirm(nodeName, nodePrefix){
          console.log(">>> osmIdConfirm(). param nodeName: ", nodeName, "; param nodePrefix: ", nodePrefix, ".");
          // nodePrefix start from firstLayer
          if(nodePrefix in firstLayer){
            console.log(">>> osmIdConfirm, prefix in firstLayer.");
            let prefixKey = firstLayer[nodePrefix]['@id'];
            let osmId = (nodeName in secondLayer[prefixKey]) ? secondLayer[prefixKey][nodeName]['@id']: '';
            return osmId;
          };
          // nodePrefix enter second layer
          // check if the nodePrefix in each seconlayer
          let returnId = false; // set a var to set in for() loop
          for(let i = 0; i < secondLayer['secondLayerPrefixList'].length; i++){
            let key = secondLayer['secondLayerPrefixList'][i];
            if(nodePrefix in secondLayer[key]){
              console.log(">>> osmIdConfirm, prefix in secondLayer.");
              let prefixKey = secondLayer[key][nodePrefix]['@id'];
              returnId = (nodeName in thirdLayer[prefixKey]) ? thirdLayer[prefixKey][nodeName]['@id']: '';
              break;
            };
          }
          if(returnId) return returnId;
          // currently only 3 layers, so not in above must in firstLayer directly
          if(nodeName in firstLayer){
            console.log(">>> osmIdConfirm, no prefix, node in firstLayer.");
            return firstLayer[nodeName]['@id'];
          }
          // or, an outlier
          else return '';
        };

        while(round < nodesCandiSelection.length ){ // use 'while'(for loop) to keep 'await' availible
          console.log(">>> inside while loop, round: ", round);

          let rowPrefix = nodesCandiSelection[round].prefix;
          let nameKey = nodesCandiSelection[round].name;
          if(nameList.indexOf(nameKey) < 0 )  {
            noMatchCount ++ ; noMatchList.push(nameKey);
            console.log(">>> no match, count: ", noMatchCount, ", @ name: ", nameKey, ", of prefix: ", rowPrefix); round ++; continue;};

          let targetOsmId = osmIdConfirm(nameKey, rowPrefix);
          // get the osm data of this nameKey
          let osmAPIpath = 'https://nominatim.openstreetmap.org/lookup?osm_ids=R' + targetOsmId + '&format=json&extratags=1';
          console.log('>>> going to fetch from OSM, api path: ', osmAPIpath);
          const resOsmGeocodeJSON = await axios.get(osmAPIpath);
          // if the res was actually empty
          if (resOsmGeocodeJSON.data.length == 0) {
            noOsmRes.push(targetOsmId);
            console.log(">>> osm res is empty, @ id: ", targetOsmId, '.'); round ++; continue;};
          // then: keep the data we want
          let latitude = resOsmGeocodeJSON.data[0]['lat'];
          let longitude = resOsmGeocodeJSON.data[0]['lon'];
          let osmId = resOsmGeocodeJSON.data[0]['osm_id'];
          let wiki_data_id = resOsmGeocodeJSON.data[0]['extratags']['wikidata'];
          let wiki_pedia_name = resOsmGeocodeJSON.data[0]['extratags']['wikipedia'];

          insertArr.push({
            id_node: nodesCandiSelection[round].id,
            category: nodesCandiSelection[round].category,
            location_lat: latitude,
            location_lon: longitude,
            osm_id: osmId,
            wiki_data_id: wiki_data_id,
            wiki_pedia_name: wiki_pedia_name
          });

          round ++;
        };

        db.nodes_locationAdmin.bulkCreate(insertArr)
        .then(()=>{
          sequelize.close();
          console.log(">>> insert complete. sequelize close.")
          console.log(">>> no match list: ", noMatchList);
          console.log(">>> no res from Osm: ", noOsmRes);
          process.on('exit', function (code) {
              return console.log(`About to exit with code ${code}`);
          });
        });

    } catch (error) {
        console.log(error);
    }
}

async function relationidParser() {
    console.log(">>> start.")
    let filePath = process.env.PATH_ABSOLUTE;

    let fileRecords = [];
    fs.createReadStream(filePath)
        .pipe(
            parse({ columns: true}) // default: ',' seperate only
            )
        .on('data', function (csvrow) {
            // 'csvrow' would be an 'obj' of each row
            console.log(">>> csvrow: ", csvrow);
            fileRecords.push(csvrow); // push row to an arr
        })
        .on('end', function () {
            //do something with result
            console.log('>>> file read.')
            asyncGeocodeReq(fileRecords); // call async
        });
};

relationidParser()
    .catch((error) => {
        console.log(error);
    });
