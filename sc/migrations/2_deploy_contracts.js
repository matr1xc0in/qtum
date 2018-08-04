var erc20 = artifacts.require("ERC20Token");
var ipfsreward = artifacts.require("RewardDistributor.sol");
var proof_of_stake_balance = 100;

module.exports = function(deployer) {
  deployer.deploy(erc20, 'NoSilo', 'TBD').then(function() {
    console.log("ERC20Token NoSilo address is created on " + erc20.address);
    return deployer.deploy(ipfsreward, erc20.address, true, proof_of_stake_balance);
  }).then(function() {
    console.log("RewardDistributor address is created on " + ipfsreward.address);
    console.log("Don't forget to fund RewardDistributor contract " + ipfsreward.address + " 500000000 tokens to start from accounts[0]");
  });
};
