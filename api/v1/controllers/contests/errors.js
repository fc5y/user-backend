class ContestRuntimeError extends Error {
  constructor({ code, msg, data }, ...params) {
    super(...params);
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}

module.exports = {
  ContestRuntimeError,
};
