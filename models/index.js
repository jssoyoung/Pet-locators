const User = require('./User');
const Pets = require('./Pets');
const Favorties = require('./Favorites');

User.hasMany(Pets, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Pets.belongsTo(User, {
  foreignKey: 'user_id'
});

Favorties.belongsTo(User, {
  foreignKey: 'user_id'
});

Favorties.hasMany(Pets, {
  foreignKey: 'pet_id'
});

module.exports = { User, Pets };