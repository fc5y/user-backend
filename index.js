const express = require("express");
const routes = require("./routes");
const sequelize = require('./sequelize');
const bodyParser = require('body-parser');
const exampleSetup = require('./example-setup') // Delete this line after the first setup

const app = express();

// Routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		console.log('Database connection OK!');
	} catch (error) {
		console.log('Unable to connect to the database:');
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
});
