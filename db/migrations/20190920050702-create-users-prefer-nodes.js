'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_prefer_nodes', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      list_shared: {
        type: Sequelize.STRING(511),
        allowNull: false,
        defaultValue: "[]"
      },
      list_inspired: {
        type: Sequelize.STRING(511),
        allowNull: false,
        defaultValue: "[]"
      },
      list_recent20: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "[]"
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
      return queryInterface.addConstraint('users_prefer_nodes', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_prefersNodes_iduser',
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
    return queryInterface.dropTable('users_prefer_nodes');
  }
};
