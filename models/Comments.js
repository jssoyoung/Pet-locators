const sequelize = require('sequelize');
const { Model, Datatype } = require('../config/connection');

class Comments extends Model {}

Comments.init(
  {
    id: {
      type: Datatypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    picture_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pet',
        key: 'id',
      },
    },
    comment: {
      type: Datatypes.STRING,
      allowNull: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'pets',
  },
);

module.exports = Comments;