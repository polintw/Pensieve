'use strict';
const path = require('path');
const seedPath = require(__dirname + '/../../config/path.js')['dbSeed'];

const twMRTtaipeixin = require(seedPath+'corners_rails_TaipeiMRTXind_EN.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('nouns', twMRTtaipeixin, {})
  },

  down: (queryInterface, Sequelize) => {
    //below, is the down method after the first seed
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("nouns",{
      createdAt: {
        [Op.gte]: new Date("2020","00","18") //remember minus 1 for month---which start from '0'
      }
    });
  }
};
