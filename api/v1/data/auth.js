const { sequelize } = require("../../../models");

async function findEmailVerificationByEmail(email) {
  return await sequelize.models.EmailVerification.findOne({
    where: { email },
  });
}

async function upsertEmailVerification({ email, otp, expired_time }) {
  return await sequelize.models.EmailVerification.upsert({
    email,
    otp,
    expired_time,
  });
}

module.exports = {
  findEmailVerificationByEmail,
  upsertEmailVerification,
};
