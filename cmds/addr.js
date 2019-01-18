const download = require('../utils/download');
const addr = require('../utils/addr');
const spinner = require('../utils/spinner');
const error = require('../utils/error');
const json2csv = require('json2csv').parse;

module.exports = async args => {
  // spinner().start();

  try {
    if (!args.id) {
      error('No ID provided. Use the --id flag to pass in a wallet ID.', 1);
    }

    await addr(args).then(data => {
      // spinner().stop();
      // spinner().succeed();

      // Download file
      if (args.d || args.download) {
        try {
          // Split block info and transactions.
          let name = data.address;
          let tx = data.txs;
          delete data.txs;

          // Write block info and transactions separately.
          let options = {
            name: name + '_info',
            data: data,
            opts: {
              flatten: true
            }
          };
          download.toCSV(options);

          // Write transaction file.
          options = {
            name: name + '_txs',
            data: tx,
            opts: {
              flatten: true
            }
          };
          download.toCSV(options);
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          // Output raw data
          console.log(data);
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
    });
  } catch (err) {
    // spinner().stop();

    console.error(err);
  }
};
