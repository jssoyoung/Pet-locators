const sequelize = require('../config/connection');
const { User, Pets } = require('../models');


const userData = require('./userData.json');
const petsData = require('./petsData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const pets of petsData) {
    await Pets.create({
      ...pets,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();