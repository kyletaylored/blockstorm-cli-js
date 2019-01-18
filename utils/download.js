const fs = require('fs');
const json2csv = require('json2csv').parse;

module.exports = {
  toCSV: async options => {
    let filename = (options.name || 'hash') + '.csv';
    fs.writeFileSync(filename, json2csv(options.data, options.opts));
  },
  toFile: async options => {
    let filename = (options.name || 'hash') + '.csv';
    fs.writeFileSync(filename, options.data);
  }
};
