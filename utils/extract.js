const moment = require("moment");
const fs = require("fs");
const error = require("../utils/error");

module.exports = {
  transactions: txs => {
    // Create empty array to populate.
    let tx_list = [];

    // Need to calculate transaction fee.
    let txBalance = 0;

    // Loop through all transactions
    txs.forEach((tx, index) => {
      if (index == 2) {
        fs.writeFileSync("tx-test.json", JSON.stringify(tx));
      }
      // Create base for each record.
      let time = moment.unix(tx.time).format("L LTS");
      let base = {
        date: time,
        hash: tx.hash,
        "input address": "",
        "input value": "",
        "output address": "",
        "output value": ""
      };

      // Process inputs
      if (tx.inputs) {
        tx.inputs.forEach(inp => {
          // console.log(input);
          let in_base = Object.assign({}, base);
          let value = Number.parseFloat(inp.prev_out.value / 1000000000);
          in_base["input address"] = inp.prev_out.addr;
          in_base["input value"] = value.toString();
          tx_list.push(in_base);
          // Add to balance.
          txBalance += value;
        });
      }

      // Process outputs
      if (tx.out) {
        tx.out.forEach(out => {
          // console.log(out);
          let out_base = Object.assign({}, base);
          let value = Number.parseFloat(out.value / 1000000000);
          out_base["output address"] = out.addr;
          out_base["output value"] = value.toString();
          tx_list.push(out_base);
          // Subtract from balance.
          txBalance -= value;
        });
      }

      // Process fees
      if (txBalance != 0) {
        let fee_base = Object.assign({}, base);
        fee_base["output value"] = txBalance.toString() + " (fee)";
        tx_list.push(fee_base);
      }
    });

    return tx_list;
  }
};
