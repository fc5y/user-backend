const getHelloWorld = (req, res) => {
  return res.status(200).send("Hello World");
};

const getHiThere = (req, res) => {
  return res.status(200).send("Hi There");
};

// const sendEmail = (req, res) => {
//   return res.status(200).send("Sent email");
// };

module.exports = {
  getHelloWorld,
  getHiThere,
};
