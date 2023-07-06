const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserConversation extends Model {}

UserConversation.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'user_id',
      },
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conversation',
        key: 'conversation_id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'UserConversation',
  }
);

module.exports = UserConversation;
