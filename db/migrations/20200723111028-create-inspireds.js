'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('inspireds', {
      id_unit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
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
      return queryInterface.addConstraint('inspireds', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_inspireds_idunit',
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('inspireds', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_inspireds_iduser',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('inspireds');
  }
};
