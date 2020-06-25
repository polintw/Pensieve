'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('list_mails', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      setting: {
        type: Sequelize.TEXT('tiny'),
        defaultValue: Sequelize.literal("full")
      },
      last_deliver: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(0)
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('list_mails', ['id_user'], {
      type: 'foreign key',
      name: 'constraint_fkey_listMails_iduser',
      references: { //Required field
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('list_mails');
  }
};
