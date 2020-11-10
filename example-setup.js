const db = require("./models/index.js");

async function initDb() {
	console.log('Will rewrite the SQLite example database, adding some dummy data.');

	await db.sequelize.sync();
	await db.sequelize.models.User.bulkCreate([
		{
			full_name: 'jack-sparrow',
			email: 'testemail@gmail.com',
			password: '1234',
		},
	]).catch(function (err) {
	});
	console.log('Done!');
}

initDb();
