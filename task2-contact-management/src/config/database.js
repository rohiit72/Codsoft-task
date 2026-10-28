const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let dbStorage = process.env.DB_STORAGE || path.resolve(__dirname, '../../database.sqlite');
if (dbStorage !== ':memory:') {
  dbStorage = path.resolve(dbStorage);
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbStorage,
  logging: process.env.NODE_ENV === 'test' ? false : false
});

module.exports = sequelize;
