const User = require('./User');
const Pets = require('./Pets');
const Likes = require('./Likes');
const Comments = require('./Comments');
const Pictures = require('./Pictures');

User.hasMany(Pets, {
  foreignKey: 'user_id',
  as: 'pets',
  onDelete: 'CASCADE',
});

User.hasMany(Comments, {
  foreignKey: 'user_id',
  as: 'comments',
});

User.belongsToMany(Pictures, {
  through: Likes,
  foreignKey: 'user_id',
  as: 'likedPictures',
});

User.hasMany(Comments, {
  foreignKey: 'pet_id',
  onDelete: 'CASCADE',
});

Pets.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'owner',
});

Pets.hasMany(Pictures, {
  foreignKey: 'pet_id',
  as: 'pictures',
});

Pictures.belongsTo(Pets, {
  foreignKey: 'pet_id',
  as: 'pet',
});

Pictures.belongsToMany(User, {
  through: Likes,
  foreignKey: 'pictures_id',
  as: 'likedBy',
});

Pictures.hasMany(Comments, {
  foreignKey: 'pictures_id',
  as: 'comments',
});

Likes.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Likes.belongsTo(Pictures, {
  foreignKey: 'pictures_id',
  as: 'picture',
});

Comments.belongsTo(Pictures, {
  foreignKey: 'pictures_id',
  as: 'picture',
});

Comments.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

module.exports = { User, Pets, Likes, Comments, Pictures };
