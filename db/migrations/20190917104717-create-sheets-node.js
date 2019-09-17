'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sheets_node', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      residence: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      residence_history: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      hometown: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      stay: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      stay_history: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
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
      return queryInterface.addConstraint('sheets_node', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_sheetsNode_iduser',
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
    return queryInterface.dropTable('sheets_node');
  }
};
