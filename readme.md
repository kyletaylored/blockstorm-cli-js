# Blockstorm

This is a simple CLI tool that fetches and downloads information from blockchain.info.

## Installation

```bash
npm i -g blockstorm-cli
```

## Usage

```bash
$ blockstorm-cli help

blockstorm-cli [command] <options>

block <options>  .......... show block info
tx <options>     .......... show transaction info
addr <options>   .......... show wallet info and transaction history
balance          .......... show wallet balance
latest           .......... show latest block info
help             .......... show help menu for a command
```

For example, if you want to fetch info about a specific wallet.

```bash
$ blockstorm-cli addr --id 1234567890asdfghjklqwertyuioopzxc
```
