const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Pictures = require('./Pictures');
const fetch = require('node-fetch');

class Pets extends Model {}

Pets.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    likes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    breed: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newPetData) => {
        if (newPetData.profile_picture === null) {
          newPetData.profile_picture = '/images/Paw_Print.svg'
          return newPetData;
        }
      },
      afterCreate: async (newPetData) => {
        await Pictures.create({
          pet_id: newPetData.id,
          pictureUrl: '/images/image__welcome.png',
        });
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'pets',
  }
);

module.exports = Pets;
