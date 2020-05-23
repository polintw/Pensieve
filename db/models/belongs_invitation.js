'use strict';
module.exports = (sequelize, DataTypes) => {
  const belongs_invitation = sequelize.define('belongs_invitation', {
    id_user: DataTypes.INTEGER,
    id_node: DataTypes.INTEGER,
    belongType: DataTypes.STRING,
    exposedKey: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    }
  }, {});
  belongs_invitation.associate = function(models) {
    // associations can be defined here
    belongs_invitation.belongsTo(models.users, {
      foreignKey:"id_user",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    belongs_invitation.belongsTo(models.nouns, {
      foreignKey:"id_node",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  belongs_invitation.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return belongs_invitation;
};
