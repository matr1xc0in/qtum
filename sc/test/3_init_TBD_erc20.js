/**
 * Utilize async here to init ERC20 Token contract first to allow
 * Token-like trading contract to test on.
 */
var ERC20TOKEN = artifacts.require("./ERC20Token.sol");
var tokenSymbol = "TBD";
var contractName = "NoSilo";

/* jshint ignore:start */
async function initERC(accounts) {
  const erc20tokInstance = await ERC20TOKEN.deployed(contractName,tokenSymbol, {from: accounts[0]});
  it("should have ERC20Token deployed", function() {
    assert(erc20tokInstance !== undefined, "ERC20 Token has been deployed");
  });
  return { erc20tokInstance };
}

const run = exports.run = initERC;
contract('ERC20Token', run);
/* jshint ignore:end */
