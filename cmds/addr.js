const download = require("../utils/download");
const error = require("../utils/error");
const spinner = require("../utils/spinner");
const json2csv = require("json2csv").parse;
const be = require("../utils/blockchaininfo");
const extract = require("../utils/extract");

module.exports = async args => {
  // spinner().start();

  try {
    if (!args.id) {
      error.report(
        "No ID provided. Use the --id flag to pass in a wallet ID.",
        1
      );
    }

    // Create empty data array to store objects in.
    let wallet = {};
    // Get transactions
    be.addr(args.id)
      .then(result => {
        // Now we have the wallet address with only 50 transactions in history.
        let address = JSON.parse(result);
        wallet = address;

        // We need to extract the current transaction data, then get the rest
        // by paging through using an "offset" based on the number of total
        // transactions available (address.n_tx)
        let data = extract.transactions(address.txs);

        // Compute the number of cycles and offsets
        for (var i = 50; i < address.n_tx; i += 50) {
          be.addr(args.id, { offset: i }).then(d => {
            d = JSON.parse(d);
            let ext = extract.transactions(d.txs);
            data.concat(ext);
            setTimeout(function() {}, 500);
          });
          // Wait
          setTimeout(function() {}, 1000);
        }

        // Download file
        if (args.d || args.download) {
          // Split block info and transactions.
          let name = wallet.address;
          delete wallet.txs;

          // Write block info and transactions separately.
          let options = {
            name: name + "_info",
            data: wallet
          };
          download.toCSV(options);

          // Write transaction file.
          options = {
            name: name + "_txs",
            data: data
          };
          download.toCSV(options);
        } else {
          try {
            // Output raw data
            // console.log(data);
            // console.log(
            //   json2csv(data, [
            //     'hash160',
            //     'n_tx',
            //     'total_received',
            //     'total_sent',
            //     'final_balance'
            //   ])
            // );
          } catch (err) {
            console.error(err);
          }
        }
      })
      .catch(err => {
        throw err;
      });

    // spinner().stop();
    // spinner().succeed();
  } catch (err) {
    // spinner().stop();

    console.error(err);
  }
};
