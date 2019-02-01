'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('units', {
      id: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_author: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      url_pic_layer0: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      url_pic_layer1: {
        type: Sequelize.STRING(255)
      },
      id_primer: {
        type: Sequelize.INTEGER(10).UNSIGNED
      },
      established: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(()=>{
      return queryInterface.addConstraint('units', ['id_author'], {
        type: 'foreign key',
        name: 'constraint_fkey_units_idauthor',
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
    return queryInterface.dropTable('units');
  }
};
