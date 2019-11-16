'use strict';
const path = require('path');
const seedPath = require(__dirname + '/../../config/path.js')['dbSeed'];

const ukCountiesEN = require(seedPath+'nouns_UK_counties_EN.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('nouns', ukCountiesEN, {})
  },

  down: (queryInterface, Sequelize) => {
    //below, is the down method after the first seed
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("nouns",{
      createdAt: {
        [Op.gte]: new Date("2019","11","05") //remember minus 1 for month---which start from '0'
      }
    });
  }
};
