'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_demand_match', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      occupied: {
        type: Sequelize.BOOLEAN,
        defaultValue: Sequelize.literal(0)
      },
      taking: {
        type: Sequelize.STRING(127),
        defaultValue: "[]"
      },
      list_wished: {
        type: Sequelize.STRING(511),
        defaultValue: "[]"
      },
      list_willing: {
        type: Sequelize.STRING(511),
        defaultValue: "[]"
      },
      list_waited: {
        type: Sequelize.STRING(511),
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
      return queryInterface.addConstraint('users_demand_match', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_usersDemandMatch_iduser',
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
    return queryInterface.dropTable('users_demand_match');
  }
};
