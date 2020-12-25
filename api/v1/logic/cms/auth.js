const CMS_SERVER = process.env.CMS_SERVER;
const CMS_SIGNATURE = process.env.CMS_SIGNATURE;
const { get, post } = require('../../utils/fetch');

async function generateToken() {
  const url = `${CMS_SERVER}/api/token/generate/`;
  const data = { signature: CMS_SIGNATURE };
  // const body = await post('google.com');
  fetch('google.com', {
    method: 'GET',
    // body: new FormData(form)
  }).then(() => {
    console.log("success");
  }).catch((err) => {
    console.log(err);
  });
  // console.log(body);
}

module.exports = {
  generateToken,
};
