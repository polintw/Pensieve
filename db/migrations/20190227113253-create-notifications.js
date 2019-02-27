'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_forward: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      category: {
        type: Sequelize.TEXT('tiny')
      },
      status: {
        type: Sequelize.INTEGER(2).UNSIGNED,
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
      return queryInterface.addConstraint('notifications', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_notifications_iduser',
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
    return queryInterface.dropTable('notifications');
  }
};
