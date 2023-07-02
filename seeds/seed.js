const sequelize = require('../config/connection');
const Pets = require('../models/Pets');
const User = require('../models/User');
const Pictures = require('../models/Pictures');
const Likes = require('../models/Likes');
const Comments = require('../models/Comments');

const userData = require('./userData.json');
const petsData = require('./petsData.json');
const pictureData = require('./pictureData.json');
const likeData = require('./likeData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const pets = await Pets.bulkCreate(petsData, {
    individualHooks: true,
    returning: true,
  });

  const pictures = await Pictures.bulkCreate(pictureData);
  const likes = await Likes.bulkCreate(likeData);
  const comments = await Comments.bulkCreate(commentData);

  process.exit(0);
};

seedDatabase();
