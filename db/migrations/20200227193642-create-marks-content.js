'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('marks_content', {
      id_mark: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_unit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      contentEntityMap: {
        type: Sequelize.STRING(1023)
      },
      contentBlocks_Light: {
        type: Sequelize.STRING(1023)
      },
      text_byBlocks: {
        type: Sequelize.STRING(4095),
        charset: 'utf8mb4', //for Mandarin, or emoji if you don't speak in mandarin
      },
      inlineStyleRanges_byBlocks: {
        type: Sequelize.STRING(1023)
      },
      entityRanges_byBlocks: {
        type: Sequelize.STRING(1023)
      },
      data_byBlocks: {
        type: Sequelize.STRING(1023),
        charset: 'utf8mb4', //for Mandarin, or emoji if you don't speak in mandarin
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
      return queryInterface.addConstraint('marks_content', ['id_mark'], {
        type: 'foreign key',
        name: 'constraint_fkey_markscontent_idmark',
        references: { //Required field
          table: 'marks',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('marks_content', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_markscontent_idunit',
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
    return queryInterface.dropTable('marks_content');
  }
};
