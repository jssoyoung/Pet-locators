const User = require('./User');
const Pets = require('./Pets');
const Likes = require('./Likes');
const Comments = require('./Comments');
const Pictures = require('./Pictures');
const Messages = require('./Messages');
const Conversation = require('./Conversation');
const UserConversation = require('./UserConversation');

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
  foreignKey: 'picture_id',
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
  foreignKey: 'picture_id',
  as: 'likedBy',
});

Pictures.hasMany(Comments, {
  foreignKey: 'picture_id',
  as: 'comments',
});

Likes.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Likes.belongsTo(Pictures, {
  foreignKey: 'picture_id',
  as: 'picture',
});

Comments.belongsTo(Pictures, {
  foreignKey: 'picture_id',
  as: 'picture',
});

Comments.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(Messages, {
  foreignKey: 'user_id',
});

Messages.belongsTo(User, {
  foreignKey: 'user_id',
});

User.belongsToMany(Conversation, {
  through: 'UserConversation',
  foreignKey: 'user_id',
  // otherKey: 'conversation_id',
});

Conversation.belongsToMany(User, {
  through: 'UserConversation',
  foreignKey: 'conversation_id',
  // otherKey: 'user_id',
});

Conversation.hasMany(Messages, {
  foreignKey: 'conversation_id',
});

Messages.belongsTo(Conversation, {
  foreignKey: 'conversation_id',
});

module.exports = {
  User,
  Pets,
  Likes,
  Comments,
  Pictures,
  Messages,
  Conversation,
  UserConversation,
};
