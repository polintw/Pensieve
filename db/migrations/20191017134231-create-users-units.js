'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_units', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_unit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      count: {
        type: Sequelize.INTEGER(5).UNSIGNED,
        allowNull: false,
        defaultValue: 1
      },
      lastTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      timeDistance: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "[0]"
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
      return queryInterface.addConstraint('users_units', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_usersunits_iduser',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('users_units', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_usersunits_idunit',
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
    return queryInterface.dropTable('users_units');
  }
};
