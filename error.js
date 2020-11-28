const MISSING_REQUIRED_FIELDS = 1000;
const MISSING_EMAIL = 1002;
const MISSING_FULLNAME = 1003;

const USER_NOT_FOUND = 2001;

let errorMap = {}
errorMap[MISSING_REQUIRED_FIELDS] = "Missing required field(s)";
errorMap[MISSING_EMAIL] = "Missing email";
errorMap[MISSING_FULLNAME] = "Missing fullname";
errorMap[USER_NOT_FOUND] = "User not found";

class FcError extends Error {
    constructor(errCode, data=null) {
        super(errorMap[errCode])
        this.code = errCode;
        this.msg = errorMap[errCode];
        this.data = data
    }
}

module.exports = {
    FcError: FcError,
    MISSING_REQUIRED_FIELDS,
    MISSING_EMAIL,
    MISSING_FULLNAME,
    USER_NOT_FOUND
}