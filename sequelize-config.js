 
const path = require('path');

// Añadimos las variables de entorno de .env a process.env
require('dotenv').config({
  path: path.join(__dirname, './.env')
});

process.env.NODE_ENV = process.env.APP_ENV;
module.exports = require("./sequelize-config.json");