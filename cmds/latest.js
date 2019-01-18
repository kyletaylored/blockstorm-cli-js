const download = require('../utils/download');
const latest = require('../utils/latest');
const spinner = require('../utils/spinner');
const json2csv = require('json2csv').parse;

module.exports = async args => {
  // spinner().start();

  try {
    const data = await latest();

    // spinner().stop();
    // spinner().succeed();

    // Download file
    if (args.d || args.download) {
      try {
        // Split block info and transactions.
        let hash = data.hash;
        let tx = data.txIndexes;
        delete data.txIndexes;

        // Write block info and transactions separately.
        let options = {
          name: data.hash + '_info',
          data: data,
          opts: {}
        };
        download.toCSV(options);

        // Write transaction file.
        options = {
          name: data.hash + '_tx',
          data: ['txIndexes'].concat(tx).join('\r\n'),
          opts: {}
        };
        download.toFile(options);
      } catch (err) {
        console.error(err);
      }
    } else {
      // Output raw data
      console.log(json2csv(data));
    }
  } catch (err) {
    // spinner().stop();

    console.error(err);
  }
};
