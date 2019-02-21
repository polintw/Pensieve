'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_apply', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      status: {
        type: Sequelize.TEXT('tiny'),
        allowNull: false
      },
      token_email: {
        type: Sequelize.STRING(1023),
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
    },{
      charset: 'utf8mb4', //for Mandarin, or emoji if you don't speak in mandarin
    }).then(()=>{
      return queryInterface.addConstraint('users_apply', ['id_user'], {
        type: 'unique',
        name: 'constraint_unique_usersapply_iduser'
      });
    }).then(()=>{
      return queryInterface.addConstraint('users_apply', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_usersapply_iduser',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users_apply');
  }
};
