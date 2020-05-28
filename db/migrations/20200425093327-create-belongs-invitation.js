'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('belongs_invitation', {
      id_user: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_node: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      belongType: {
        type: Sequelize.STRING(31)
      },
      exposedKey: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
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
      return queryInterface.addConstraint('belongs_invitation', ['id_user'], {
        type: 'foreign key',
        name: 'constraint_fkey_invitationBelong_iduser',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(()=>{
      return queryInterface.addConstraint('belongs_invitation', ['id_node'], {
        type: 'foreign key',
        name: 'constraint_fkey_invitationBelong_idnode',
        references: { //Required field
          table: 'nouns',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('belongs_invitation');
  }
};
