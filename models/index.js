const User = require('./User');
const Pets = require('./Pets');
const Likes = require('./Likes');
const Comments = require('./Comments');
const Pictures = require('./Pictures');

User.hasMany(Pets, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Pets.belongsTo(User, {
  foreignKey: 'user_id'
});

Pictures.hasMany(Likes, {
  foreignKey: 'pictures_id'
});

Pictures.belongsTo(Pets, {
  foreignKey: 'pet_id'
});

Pictures.hasMany(Comments, {
  foreignKey: 'pictures_id'
});

Likes.belongsTo(User, {
  foreignKey: 'user_id'
});

Likes.belongsTo(Pictures, {
  foreignKey: 'pictures_id'
});

User.hasMany(Comments, {
  foreignKey: 'user_id'
});

Comments.belongsTo(Pictures, {
  foreignKey: 'pictures_id'
  });

module.exports = { User, Pets, Likes, Comments, Pictures };