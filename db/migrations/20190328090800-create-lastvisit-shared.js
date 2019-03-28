'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('lastvisit_shared', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      ip: {
        type: Sequelize.TEXT('tiny')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }).then(()=>{
      return queryInterface.addConstraint('lastvisit_shared', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_lastvisitatshared_iduser',
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
    return queryInterface.dropTable('lastvisit_shared');
  }
};
