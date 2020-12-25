const authLogic = require("../logic/auth");
const { formatUser } = require("../utils/users");

function sendOtp(req, res, next) {
  return authLogic
    .sendOtp({
      email: req.body.email,
    })
    .then(() => {
      res.send({
        code: 0,
        msg: "OTP sent",
        data: {
          email: req.body.email,
        },
      });
    })
    .catch(next);
}

function signup(req, res, next) {
  return authLogic
    .signup({
      email: req.body.email,
      username: req.body.username,
      otp: req.body.otp,
      password: req.body.password,
      full_name: req.body.full_name,
      school_name: req.body.school_name,
    })
    .then(({ user }) => {
      res.json({
        code: 0,
        msg: "Signup successfully",
        data: {
          user: formatUser(user),
        },
      });
    })
    .catch(next);
}

function login(req, res, next) {
  return authLogic
    .login({
      email_or_username: req.body.email_or_username,
      password: req.body.password,
    })
    .then(({ access_token }) => {
      res.json({
        code: 0,
        msg: "Login successfully",
        data: {
          access_token,
        },
      });
    })
    .catch(next);
}

module.exports = {
  sendOtp,
  signup,
  login,
};
