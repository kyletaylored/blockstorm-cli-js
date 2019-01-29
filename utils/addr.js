const axios = require("axios");
const merge = require("deepmerge");
const error = require("./error");
const extract = require("./extract");

class Address {
  /**
   * async get - return extracted transaction data from blockchain.info.
   *
   * @param  {type} args description
   * @return {type}      description
   */
  async get(args) {
    // Get initial transaction
    this.fetch(args)
      .then(data => {
        // Keep original address info
        let info = data;
        let txs = extract.transactions(data.txs);

        // Page through all transactions
        let tx_arr = this.page(args, data.n_tx);
        // Update transactions
        info.txs = merge(txs, tx_arr);
        return info;
      })
      .catch(err => {
        error.report(err, 1);
      });
  }

  /**
   * async page - helper function to page through multiple transactions.
   *  applies an offset based on the number of transactions avaialable.
   *
   * @param  {object} args command line arguments
   * @param  {int} n_tx number of transactions
   * @return {array}      array of transaction objects
   */
  async page(args, n_tx) {
    let txs = [];

    // Page through transaction history.
    while (args.offset < n_tx) {
      args.offset += 50;

      await this.fetch(args)
        .then(data => {
          txs.push(extract.transactions(data.txs));
        })
        .catch(err => {
          error.report(err, 1);
        });

      await this.timeoutPromise(1000);
      count++;
    }

    return txs;
  }

  /**
   * async fetch - description
   *
   * @param  {type} args command line arguments that contain wallet address id.
   * @return {type}      description
   */
  async fetch(args) {
    return axios
      .get("https://blockchain.info/rawaddr/" + args.id, {
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
  }

  /**
   * timeoutPromise - helper function to delay promises resolving.
   *
   * @param  {type} timeout number of milliseconds to resolve timeout.
   * @return {promise}
   */
  timeoutPromise(timeout) {
    new Promise(resolve => setTimeout(resolve, timeout));
  }
}

module.exports = new Address();
