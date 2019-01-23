const axios = require('axios');
const merge = require('deepmerge');
const error = require('./error');
const extract = require('./extract');

module.exports = {
  get: async args => {
    // Get initial transaction
    const address = module.exports
      .fetch(args)
      .then(data => {
        // Keep original address info
        let info = data;
        let txs = extract.transactions(data.txs);
        error.log(txs);
        // Page through all transactions
        let tx_arr = module.exports.page(args, data.n_tx);
        // Update transactions
        info.txs = merge(txs, tx_arr);
        return info;
      })
      .catch(err => {
        error.report(err, 1);
      });
  },
  page: (args, n_tx) => {
    const transactions = function(args, n_tx) {
      let txs = [];
      error.log(args);
      // Page through transaction history.
      while (args.offset < n_tx) {
        args.offset += 50;
        let data = module.exports.fetch(args);
        txs.push(extract.transactions(data.txs));
        count++;
      }
      return txs;
    };
    return transactions;
  },
  fetch: async args => {
    error.log(args);
    const results = axios
      .get('https://blockchain.info/rawaddr/' + args.id, {
        params: {
          offset: args.offset || 0
        }
      })
      .then(results => {
        return results.data;
      })
      .catch(err => {
        error.report(err, 1);
      });

    return results;
  }
};
