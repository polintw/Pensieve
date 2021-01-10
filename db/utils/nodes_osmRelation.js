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
        let round = 0;
        while(round < csvData.length ){
            let osmAPIpath = 'https://nominatim.openstreetmap.org/lookup?osm_ids=R' + csvData[round]['@id'] + '&format=geocodejson';
            // Change -> https://nominatim.openstreetmap.org/lookup?osm_ids=R9407&format=json&extratags=1
            // so -> change properties beneath

            const resOsmGeocodeJSON = await axios.get(osmAPIpath);
            if (!('features' in resOsmGeocodeJSON.data) || resOsmGeocodeJSON.data['features'].length == 0) { console.log(csvData[round]['name:en']); continue;};
            let latitude = resOsmGeocodeJSON.data['features'][0].geometry.coordinates[1];
            let longitude = resOsmGeocodeJSON.data['features'][0].geometry.coordinates[0];
            
            console.log(">>> result, latitude: ", latitude, ", longitude: ", longitude);
            /* then, 
            pick from db.nouns by name
            if name exist, save coordinates, osm_id, wiki link to db.nodes_additional
            */

            round ++;
        }


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
