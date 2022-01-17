require('dotenv').config();

module.exports = {
  HOST: "localhost", //env
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DB: "groupomania_development", // env
  dialect: "mysql", // env
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
