const Ora = require('ora');

module.exports = args => {
  const spinner = new Ora({
    text: 'Fetching data from blockchain.info',
    spinner: 'simpleDots'
  });

  // // If quiet, send null functions.
  // if (args || args.q || args.quiet) {
  //   let fake = function() {
  //     function start() {}
  //     function stop() {}
  //     function succeed() {}
  //   };
  //   return fake;
  // }

  return spinner;
};
