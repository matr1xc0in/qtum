var shopping_center = artifacts.require("SimpleGetSet");

module.exports = function(deployer) {
  deployer.deploy(shopping_center).then(function() {
    console.log("SimpleGetSet TDD and ShoppingCenter address is created on " + shopping_center.address);
  });
};
