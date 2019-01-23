module.exports = {
  report: (message, exit) => {
    console.error(message);
    exit && process.exit(1);
  },
  log: arguments => {
    console.log(arguments);
    // Print the stack trace
    console.trace();
  }
};
