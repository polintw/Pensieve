'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('units_req_origin', {
      id_unit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      exposedId: {
        type: Sequelize.UUID
      },
      prev_domain: {
        type: Sequelize.STRING(4095),
      },
      reqCount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1
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
      return queryInterface.addConstraint('units_req_origin', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_unitsReqUnsigned_idunit',
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
    return queryInterface.dropTable('units_req_origin');
  }
};
