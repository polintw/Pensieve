'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('paths', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10).UNSIGNED,
      },
      name: {
        type: Sequelize.STRING(127),
        allowNull: false,
      },
      id_creator: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      pathName: {
        type: Sequelize.STRING(127),
        allowNull: false,
        unique: true // not allow duplicate
      },
      description: {
        type: Sequelize.STRING(255)
      },
      set_webLink: {
        type: Sequelize.STRING(511),
      },
      set_nodeStart: {
        type: Sequelize.INTEGER(10).UNSIGNED,
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }, {
      charset: 'utf8mb4' //for Mandarin, or emoji if you don't speak in mandarin
    }).then(()=>{
      return queryInterface.addConstraint('paths', ['id_creator'], {
        type: 'foreign key',
        name: 'constraint_fkey_paths_idcreator',
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
    return queryInterface.dropTable('paths');
  }
};
