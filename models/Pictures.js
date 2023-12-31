const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Pictures extends Model {}

Pictures.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    pictureUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pet_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pets',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'pictures',
  }
);

module.exports = Pictures;
