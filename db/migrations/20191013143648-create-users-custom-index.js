'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_custom_index', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      last_visit: {
        type: Sequelize.DATE
      },
      last_focusbelong: {
        type: Sequelize.STRING(63)
      },
      currentbelong: {
        type: Sequelize.STRING(255)
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
      return queryInterface.addConstraint('users_custom_index', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_customIndex_iduser',
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
    return queryInterface.dropTable('users_custom_index');
  }
};
