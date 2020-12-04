"use strict";

require("dotenv").config();
const Sequelize = require("sequelize");
const db = {};

let sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logQueryParameters: true,
  benchmark: true,
});

const modelDefiners = [
  require("./user"),
  require("./email_verification"),
  // Add more models here...
  // require('./models/item'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// We export the sequelize connection instance to be used around our app.
db.sequelize = sequelize;
module.exports = db;
