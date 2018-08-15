var FAKETOK = artifacts.require("./SimpleCoupons.sol");

/* jshint ignore:start */
async function initERC(accounts) {
  const fake_tok_instance = await FAKETOK.deployed({from: accounts[0]});
  it("should have FAKETOK deployed", function() {
    assert(fake_tok_instance !== undefined, "SimpleTest Token has been deployed");
  });
  return { fake_tok_instance };
}

const run = exports.run = initERC;
contract('FAKETOK', run);
/* jshint ignore:end */
