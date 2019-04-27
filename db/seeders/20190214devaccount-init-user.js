'use strict';
const path = require('path');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', , {})
      .then(()=>{
        return queryInterface.bulkInsert('nouns', adminJpEN, {})
      });
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
