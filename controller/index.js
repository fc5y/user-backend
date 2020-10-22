const getHelloWorld = (req, res) => {
  return res.status(200).send("Hello World");
};

const getHiThere = (req, res) => {
  return res.status(200).send("Hi There");
};

module.exports = {
  getHelloWorld,
  getHiThere,
};
