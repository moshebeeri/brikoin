class TestUtils {
  failed(error) {
    return (
      error.message === "VM Exception while processing transaction: revert"
    );
  }

  validateReceipt(result, event, args) {
    let events = result.logs.filter(log => log.event === event);
    let eventLog = events[0];
    return Object.keys(args)
      .map(arg =>
        args[arg] === null
          ? eventLog.args[arg] !== undefined
          : eventLog.args[arg] == args[arg]
      )
      .reduce((acc, flag) => acc & flag, true);
  }
}

module.exports = new TestUtils();
