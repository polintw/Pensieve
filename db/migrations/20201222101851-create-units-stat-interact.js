'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('units_stat_interact', {
      id_unit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      times_unsignedLoad: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }).then(()=>{
      return queryInterface.addConstraint('units_stat_interact', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_unitsStatInteract_idunit',
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('units_stat_interact');
  }
};
