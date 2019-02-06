'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sheets', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      gender: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      birthYear: {
        type: Sequelize.STRING(7)
      },
      birthMonth: {
        type: Sequelize.STRING(7)
      },
      birthDate: {
        type: Sequelize.STRING(7)
      },
      residence: {
        type: Sequelize.STRING(127)
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
      charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
    }).then(()=>{
      return queryInterface.addConstraint('sheets', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_sheets_iduser',
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
    return queryInterface.dropTable('sheets');
  }
};
