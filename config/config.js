//configuration file for the sequelize instance



//we define the sequelize configuration object to apply to each imported model
//over at models/index.js
require('dotenv').config();

module.exports = {
  development: { //development = production't
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mariadb',
    logging: false,
  },
  //TODO: define prod and test environments??
  //enough time???
};
