const express = require("express");
const routes = require("./routes");
const bodyParser = require("body-parser");
const jwt = require("express-jwt");
const apiV1 = require("./api/v1");

const app = express();
app.set("json spaces", 2); // optional, format json responses with 2 spaces

const db = require("./models/index.js");

// Routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
  }),
);

app.use("/api/v1", apiV1);
app.use("/", routes);

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await db.sequelize.authenticate();
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error.message);
    process.exit(1);
  }
}

// PORT
const PORT = process.env.PORT || 4000;
assertDatabaseConnectionOk().then(() => {
  app.listen(PORT, () => {
    console.log(`[User Backend] Listen on port ${PORT}`);
  });

  // Handle invalid endpoint error
  app.use(function (req, res) {
    res.status(400).json({
      code: 1006,
      msg: "Invalid endpoint/method",
      data: null,
    });
  });

  // Handle caught error
  app.use(function (err, req, res, next) {
    switch (err.name) {
      case "UnauthorizedError":
        res.status(400).json({
          code: 3005,
          msg: err.code,
          data: null,
        });
        break;
      default:
        res.status(400).json({
          code: 1001,
          msg: "Bad request",
          data: null,
        });
    }
  });
});
