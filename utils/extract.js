const moment = require('moment');

module.exports = {
  transactions: async txs => {
    // Create empty array to populate.
    let tx_list = [];
    // Loop through all transactions
    txs.forEach(tx => {
      // Create base for each record.
      let base = {
        date: moment.unix(tx.time).utc(),
        hash: tx.hash,
        'received address': '',
        'received value': '',
        'sent address': '',
        'sent value': '',
        balance: 0
      };

      // Process inputs
      if (tx.inputs) {
        tx.inputs.forEach(input => {
          let in_base = new base();
          in_base['received address'] = input.addr;
          in_base['received value'] = input.value;
          in_base['balance'] += input.value / 1000000000;
          tx_list.push(in_base);
        });
      }

      // Process outputs
      if (tx.out) {
        tx.out.forEach(out => {
          let out_base = new base();
          out_base['sent address'] = out.addr;
          out_base['sent value'] = out.value;
          out_base['balance'] -= out.value / 1000000000;
          tx_list.push(out_base);
        });
      }
    });

    return tx_list;
  }
};
