const axios = require('axios');

module.exports = async () => {
  const results = await axios({
    method: 'get',
    url: 'https://blockchain.info/latestblock'
  });

  return results.data;
};
