const MISSING_REQUIRED_FIELDS = 1000;
const MISSING_EMAIL = 1002;
const MISSING_FULLNAME = 1003;
const MISSING_USER_ID = 1004;
const USER_NOT_FOUND = 2001;
const EMAIL_USERNAME_PASSWORD_INVALID = 3006;

let errorMap = {};
errorMap[MISSING_REQUIRED_FIELDS] = "Missing required field(s)";
errorMap[MISSING_EMAIL] = "Missing email";
errorMap[MISSING_FULLNAME] = "Missing fullname";
errorMap[MISSING_USER_ID] = "Missing user ID";
errorMap[USER_NOT_FOUND] = "User not found";
errorMap[EMAIL_USERNAME_PASSWORD_INVALID] =
  "Email/Username or password is invalid";

class FcError extends Error {
  constructor(errCode, data = null) {
    super(errorMap[errCode]);
    this.code = errCode;
    this.msg = errorMap[errCode];
    this.data = data;
  }
}

module.exports = {
  FcError: FcError,
  MISSING_REQUIRED_FIELDS,
  MISSING_EMAIL,
  MISSING_FULLNAME,
  MISSING_USER_ID,
  USER_NOT_FOUND,
  EMAIL_USERNAME_PASSWORD_INVALID,
};