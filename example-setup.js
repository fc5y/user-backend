const db = require("./models/index.js");
const { updateOrCreate } = require("./utils/models.js");
const bcrypt = require('bcryptjs');

async function initDb() {
  console.log(
    "Will rewrite the SQLite example database, adding some dummy data."
  );

  await db.sequelize.sync();
  const userObject = {
    full_name: "Test User",
    email: "testemail@gmail.com",
    password: "1234",
    is_email_verified: false,
  };
  const anotherUser = {
    full_name: "Another Test",
    email: "another@test.com",
    password: bcrypt.hashSync("12345678"),
    is_email_verified: false,
  }
  updateOrCreate(
    db.sequelize.models.User,
    { email: userObject["email"] },
    userObject
  )
    .then(function (result) {
      result.item; // the model
      result.created; // bool, if a new item was created.
    })
    .catch(function (err) {
      console.log(err);
    });
  
  
    updateOrCreate(
      db.sequelize.models.User,
      { email: anotherUser["email"] },
      anotherUser
    )
      .then(function (result) {
        result.item; // the model
        result.created; // bool, if a new item was created.
      })
      .catch(function (err) {
        console.log(err);
      });
  console.log("Done!");
}

initDb();
