'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const winston = require(__dirname+ '/../../config/winston.js');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/sequelize.js')[env];
const db = {};

console.log('here, in models/index')
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
console.log("in models/index, import from file: "+file)
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
console.log("in models/index, associate() file: "+file)    
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

winston.warn("Sequelize: instance has prepared, required as '_DB_'.");

module.exports = db;
