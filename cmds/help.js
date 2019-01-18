const menus = {
  main: `
    blockstorm-cli [command] <options>

    block <options>  .......... show block info
    tx <options>     .......... show transaction info
    addr <options>   .......... show wallet info and transaction history
    balance          .......... show wallet balance
    latest           .......... show latest block info
    help             .......... show help menu for a command`,

  block: `
    blockstorm-cli block [id] <options>

    --download, -d ..... download the results as CSV`,

  tx: `
    blockstorm-cli tx [id] <options>

    --download, -d ..... download the results as CSV`,

  addr: `
    blockstorm-cli addr <options>

    --id           ..... (required) id of wallet
    --download, -d ..... download the results as CSV`,

  balance: `
    blockstorm-cli addr [id] <options>

    --download, -d ..... download the results as CSV`,

  latest: `
    blockstorm-cli latest <options>

    --download, -d ..... download the results as CSV`
};

module.exports = args => {
  const subCmd = args._[0] === 'help' ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
};
