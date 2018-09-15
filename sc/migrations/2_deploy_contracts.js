var erc20 = artifacts.require("ERC20Token");
var proof_of_stake_balance = 100;

module.exports = function(deployer) {
  deployer.deploy(erc20, 'NoSilo', 'TBD').then(function() {
    console.log("ERC20Token NoSilo address is created on " + erc20.address);
  });
};
