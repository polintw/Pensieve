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
        let nameObj = {};
        csvData.forEach((obj, index) => {
          nameObj[obj['name:en']] = Object.assign({}, obj);
        });
        // then: from our own database, select the nodes we want as base
        let nodesCandiSelection = await db.nouns.findAll({
          where: {
            language: 'en',
            category: 'location_admin',
            // beneath are optional depend on aimmed group
            prefix: '',
            child: 0
          }
        });

        console.log('>>> selection result, length = ', nodesCandiSelection.length);

        let round = 0, insertArr = [], noMatchCount = 0;
        while(round < nodesCandiSelection.length ){ // use 'while'(for loop) to keep 'await' availible
          console.log(">>> inside while loop, round: ", round);

          let nameKey = nodesCandiSelection[round].name;
          if(!(nameKey in nameObj))  { noMatchCount ++ ; console.log(">>> no match, count: ", noMatchCount, ", @ name: ", nameKey); round ++; continue;};
          // get the osm data of this nameKey
          let osmAPIpath = 'https://nominatim.openstreetmap.org/lookup?osm_ids=R' + nameObj[nameKey]['@id'] + '&format=json&extratags=1';
          console.log('>>> going to fetch from OSM, api path: ', osmAPIpath);
          const resOsmGeocodeJSON = await axios.get(osmAPIpath);
          // if the res was actually empty
          if (resOsmGeocodeJSON.data.length == 0) { console.log(">>> osm res is empty, @ name: ", nameObj[nameKey]['name:en']); round ++; continue;};
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

        db.nodes_additional.bulkCreate(insertArr)
        .then(()=>{
          sequelize.close();
          console.log(">>> insert complete. sequelize close.")
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
