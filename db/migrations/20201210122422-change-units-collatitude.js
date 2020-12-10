'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('units', 'latitude_img', {
        type: Sequelize.DECIMAL(21, 16),
    })
    .then(() => {
        return queryInterface.addColumn('units', 'longitude_img', {
            type: Sequelize.DECIMAL(21, 16),
        })
    });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('units', 'latitude_img', {})
      .then(() => {
          return queryInterface.removeColumn('units', 'longitude_img', {})
      });
  }
};
