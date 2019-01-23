const axios = require('axios');
const merge = require('deepmerge');
const error = require('./error');
const extract = require('./extract');

module.exports = {
  get: async args => {
    let address = {};
    // Get initial transaction
    await module.exports.fetch(args).then(data => {
      // Keep original address info
      address = data;
      let txs = extract.transactions(data.txs);
      // Page through all transactions
      let tx_arr = module.exports.page(args, data.n_tx);
      // Update transactions
      address.txs = merge(txs, tx_arr);

      return address;
    });
  },
  page: async (args, n_tx) => {
    let txs = [];

    // Page through transaction history.
    while (args.offset < n_tx) {
      args.offset += 50;
      let data = module.exports.fetch(args);
      txs.push(extract.transactions(data.txs));
    }

    return txs;
  },
  fetch: async args => {
    const results = await axios
      .get('https://blockchain.info/rawaddr/' + args.id, {
        params: {
          offset: args.offset || 0
        }
      })
      .then(results => {
        return results.data;
      })
      .catch(err => {
        error(err, 1);
      });

    return results;
  }
};
