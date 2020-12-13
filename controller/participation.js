const db = require("../models/index.js");
const models = db.sequelize.models;
const errors = require("../utils/error");
const { updateOrCreate } = require("../utils/models.js");
const { statusCode } = require("../utils");

async function buildParticipationJson(participation) {
	return {
		"contest_name": participation.Contest.contest_name,
		"contest_title": participation.Contest.contest_title,
		// "contest_total_participations": 234,
		"is_hidden": participation.is_hidden,
		"rating": participation.rating,
		"rating_change": participation.rating_change,
		"score": participation.score,
		"rank_in_contest": participation.rank_in_contest,
	};
}

// POST /api/v1/participations
async function register(req, res, next) {
	const user_id = req.user.id;
	const { contest_name, is_hidden } = req.body;
	const contest = await models.Contest.findOne({ where: {contest_name} });
	if (!contest) {
		throw new errors.FcError(errors.CONTEST_NOT_FOUND);
	}
	await updateOrCreate(
    models.Participation,
    {
			user_id: user_id,
			contest_id: contest.id
		},
    {
      user_id: user_id,
			contest_id: contest.id,
			is_hidden
    },
  );
  res.status(statusCode.SUCCESS).json({
    code: 0,
    msg: "Registered successfully",
    data: {},
  });
}

async function getParticipationByUsername(req, res, next) {
	const username = req.params;
  const user = await models.User.findOne({ where: username });
	if (!user) {
    throw new errors.FcError(errors.USER_NOT_FOUND);
  }
	models.Contest.hasMany(models.Participation, {
		foreignKey: 'contest_id',
		sourceKey: 'id',
	});
	models.Participation.belongsTo(models.Contest, {
		foreignKey: "contest_id",
		as: "contest",
	});
	const participations = await models.Participation.findAll({
		where: { user_id: user.id } ,
		include: [
			{
				model: models.Contest,
				as: "contest",
			}
    ]
	});

	res.status(statusCode.SUCCESS).json({
    code: 0,
    msg: "Registered successfully",
    data: {
			// total: participations.length,
			// participations: participations.map(participation => buildParticipationJson(participation)),
		},
  });
}

module.exports = {
	register,
	getParticipationByUsername
};
