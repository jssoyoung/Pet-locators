const User = require('./User');
const Pets = require('./Pets');
const Favortites = require('./Likes');

User.hasMany(Pets, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

User.hasMany(Comments, {
  foreignKey: 'pet_id',
  onDelete: 'CASCADE',
});

Pets.belongsTo(User, {
  foreignKey: 'user_id'
});

Likes.belongsTo(User, {
  foreignKey: 'user_id'
});

Likes.hasMany(Pets, {
  foreignKey: 'pet_id'
});

module.exports = { User, Pets, Likes, Comments };