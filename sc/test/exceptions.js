module.exports.errTypes = {
  revert            : "revert",
  outOfGas          : "out of gas",
  invalidJump       : "invalid JUMP",
  invalidOpcode     : "invalid opcode",
  stackOverflow     : "stack overflow",
  stackUnderflow    : "stack underflow",
  staticStateChange : "static state change"
};

/* jshint ignore:start */
module.exports.tryCatch = async function(promise, errTypes) {
  try {
    await promise;
      throw null;
  }
  catch (error) {
      assert(error, "Expected an error but did not get one");
      assert(error.message.startsWith(PREFIX + errTypes), "Expected an error starting with '" + PREFIX + errTypes + "' but got '" + error.message + "' instead");
  }
};
/* jshint ignore:end */

const PREFIX = "VM Exception while processing transaction: ";
