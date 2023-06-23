const sequelize = require('sequelize');
const { Model, Datatype } = require('../config/connection')

class Favorties extends Model {}

Favorties.init(
  {
    id: {
      type: Datatypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Datatypes.STRING,
    },
    breed: {
      type: Datatypes.STRING,
      allowNull: false,
    },
    description: {
      type: Datatypes.STRING,
    },
  }
)