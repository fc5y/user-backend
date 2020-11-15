const db = require("./models/index.js");
const { updateOrCreate } = require("./utils/models.js");

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
  console.log("Done!");
}

initDb();
