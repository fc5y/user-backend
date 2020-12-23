const commonUtils = require("./common");

class SuccessResponse {
  constructor(res, msg = "", data = {}) {
    this.res = res;
    this.msg = msg;
    this.data = data;
    this.data["server_time"] = commonUtils.dateToTimestamp(new Date());
  }

  send() {
    // TODO: log
    return this.res.json({
      code: 0,
      msg: this.message,
      data: this.data,
    });
  }
}

module.exports = {
  SuccessResponse
};
