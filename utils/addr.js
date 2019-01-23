const axios = require('axios');
const merge = require('deepmerge');
const error = require('./error');
const extract = require('./extract');

module.exports = {
  get: async args => {
    const addr = this;
    let address = {};
    // Get initial transaction
    await addr.fetch(args).then(data => {
      // Keep original address info
      address = data;
      let txs = extract.transactions(data.txs);
      addr.page(args, data.n_tx).then(tx_arr => {
        // Update transactions
        address.txs = merge(txs, tx_arr);
      });

      return address;
    });
  },
  page: (args, n_tx) => {
    const addr = this;
    let txs = [];

    // Page through transaction history.
    while (args.offset < n_tx) {
      args.offset += 50;
      let data = addr.fetch(args);
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
