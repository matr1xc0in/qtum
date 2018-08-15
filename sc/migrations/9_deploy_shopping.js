var erc20 = artifacts.require("SimpleCoupons");
var shopping_center = artifacts.require("SimpleShopping");

module.exports = function(deployer) {
  deployer.deploy(erc20).then(function() {
    console.log("SimpleCoupons TDD address is created on " + erc20.address);
    return deployer.deploy(shopping_center, erc20.address);
  }).then(function() {
    console.log("SimpleShopping address is created on " + shopping_center.address);
    console.log("Don't forget to fund SimpleShopping contract " + shopping_center.address + " 500000 tokens to start from accounts[0]");
  });
};
