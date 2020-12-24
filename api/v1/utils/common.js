function dateToTimestamp(date) {
  return Math.floor(date.getTime() / 1000);
}

function timestampToDate(timestamp) {
  return new Date(timestamp * 1000);
}

function getTimestampNow() {
  return dateToTimestamp(new Date());
}

module.exports = {
  dateToTimestamp,
  timestampToDate,
  getTimestampNow,
};
