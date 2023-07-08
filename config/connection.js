// Import sequelize to create connection to database
const Sequelize = require('sequelize');
// Import dotenv to hide sensitive data
require('dotenv').config();

let sequelize;

// JAWDB is for Heroku deployment; it is a remote database
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
  // If not JAWSDB, then use local database
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      // port: 3001,
      dialectOptions: {
        decimalNumbers: true,
      },
    }
  );
}

module.exports = sequelize;
