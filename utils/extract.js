const moment = require('moment');
const error = require('../utils/error');

module.exports = {
  transactions: txs => {
    // Create empty array to populate.
    let tx_list = [];
    // Loop through all transactions
    txs.forEach(tx => {
      // Create base for each record.
      let time = moment.unix(tx.time).format('L LTS');
      let base = {
        date: time,
        hash: tx.hash,
        'received address': null,
        'received value': null,
        'sent address': null,
        'sent value': null
      };

      // Process inputs
      if (tx.inputs) {
        tx.inputs.forEach(input => {
          // console.log(input);
          let in_base = Object.assign({}, base);
          in_base['received address'] = input.addr;
          in_base['received value'] = Number.parseFloat(
            input.value / 1000000000
          );
          tx_list.push(in_base);
        });
      }

      // Process outputs
      if (tx.out) {
        tx.out.forEach(out => {
          // console.log(out);
          let out_base = Object.assign({}, base);
          out_base['sent address'] = out.addr;
          out_base['sent value'] = Number.parseFloat(out.value / 1000000000);
          tx_list.push(out_base);
        });
      }
    });

    return tx_list;
  }
};
