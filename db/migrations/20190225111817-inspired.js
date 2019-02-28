'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('inspired', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }).then(()=>{
      return queryInterface.changeColumn('inspired', 'updatedAt', {
        type: Sequelize.DATE
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('inspired', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE
    }).then(()=>{
      return queryInterface.changeColumn('inspired', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE
      })
    });
  }
};
