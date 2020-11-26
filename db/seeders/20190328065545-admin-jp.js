'use strict';
const path = require('path');
const seedPath = require(__dirname + '/../../config/path.js')['dbSeed'];

const adminJpEN = require(seedPath+'nouns_jp_EN.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('nouns', adminJpEN, {})
  },

  down: (queryInterface, Sequelize) => {
    //below, is the down method after the first seed
    const Op = Sequelize.Op;
    //remember minus 1 for month---which start from '0'
    return queryInterface.bulkDelete("nouns",{
      createdAt: {
        [Op.gte]: new Date("2019","02","28")
      }
    });
  }
};
