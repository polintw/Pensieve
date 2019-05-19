'use strict';
const path = require('path');
const seedPath = require(__dirname + '/../../config/path.js')['dbSeed'];

const adminDeLandsEN = require(seedPath+'nouns_de_lands_EN.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('nouns', adminDeLandsEN, {})
  },

  down: (queryInterface, Sequelize) => {
    //below, is the down method after the first seed
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("nouns",{
      createdAt: {
        [Op.gte]: new Date("2019","04","19") //remember minus 1 for month---which start from '0'
      }
    });
  }
};
