const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userPicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pronouns: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    twitter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        if (newUserData.pronouns !== undefined) {
          if (newUserData.pronouns.includes('He/Him')) {
            newUserData.userPicture = `https://randomuser.me/api/portraits/men/${Math.trunc(
              Math.random() * 50 + 1
            )}.jpg`;
          } else if (newUserData.pronouns.includes('She/Her')) {
            newUserData.userPicture = `https://randomuser.me/api/portraits/women/${Math.trunc(
              Math.random() * 50 + 1
            )}.jpg`;
          } else if (
            newUserData.pronouns === null ||
            newUserData.pronouns.includes('They/Them')
          ) {
            const randomNumber = Math.trunc(Math.random() * 50 + 1);
            const gender = randomNumber % 2 === 0 ? 'men' : 'women';
            newUserData.userPicture = `https://randomuser.me/api/portraits/${gender}/${randomNumber}.jpg`;
          }
        }
        return newUserData;
      },
      beforeUpdate: async (updatedUserData) => {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;
