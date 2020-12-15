require("dotenv").config();

const Sequelize = require("sequelize");

const sequelize = new Sequelize({
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
  require("./contest"),
  require("./participation"),
  // Add more models here...
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

module.exports = {
  sequelize,
};
