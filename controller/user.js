const { getIdParam } = require('../utils');
const db = require('./../models/index.js');
const models = db.sequelize.models;

async function getAll(req, res) {
	const users = await models.User.findAll();
	res.status(200).json(users);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const user = await models.User.findByPk(id);
	if (user) {
		res.status(200).json(user);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.User.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	const user = await models.User.findByPk(id);
	if (user) {
		models.User.update(req.body, {
			where: {
				id: id
			}
		});
		res.status(200).send('Updated');
	} else {
		res.status(404).send('User not found');
	}

};

async function remove(req, res) {
	const id = getIdParam(req);
	await models.user.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
};
