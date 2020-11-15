const { Sequelize } = require("sequelize");

// TODO: Keep credentials in env variables
const sequelize = new Sequelize({
  dialect: "mysql",
  database: "fc5y_backend",
  username: "root",
  password: "LOVE12344",
  logQueryParameters: true,
  benchmark: true,
});

const modelDefiners = [
  require("./models/user"),
  // Add more models here...
  // require('./models/item'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
