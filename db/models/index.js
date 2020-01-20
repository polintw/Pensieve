'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const winston = require('../../config/winston.js');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/sequelize.js')[env];
const projectRootPath = require("../../projectRootPath");
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(path.join(projectRootPath, 'db/models/'))
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(projectRootPath, 'db/models/', file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

winston.warn("Sequelize: instance has prepared.");

module.exports = db;
