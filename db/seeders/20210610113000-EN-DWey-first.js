'use strict';
const path = require('path');
const seedPath = require(__dirname + '/../../config/path.js')['dbSeed'];

const DWey = require(seedPath+'nodes_DWey_first_EN.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('nouns', DWey, {})
  },

  down: (queryInterface, Sequelize) => {
    //below, is the down method after the first seed
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("nouns",{
      createdAt: {
        [Op.and]: {
          [Op.gte]: new Date("2021","05","10"), //remember minus 1 for month---which start from '0'
          [Op.lt]: new Date("2021","05","11")
        }
      }
    });
  }
};
