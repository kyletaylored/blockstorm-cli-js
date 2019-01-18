const axios = require('axios');
const error = require('./error');

module.exports = async args => {
  const results = await axios({
    method: 'get',
    url: 'https://blockchain.info/rawaddr/' + args.id
  })
    .then(results => {
      return results.data;
    })
    .catch(err => {
      error(err, 1);
    });

  return results;
};
