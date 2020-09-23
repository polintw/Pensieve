'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('units', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
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
      exposedId: {
        type: Sequelize.UUID,
        //new col, no need to set defaultValue(set in working model)
        //Not to forbidden default Null at this moment.
        unique: true
      },
      established: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
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
