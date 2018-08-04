var Migrations = artifacts.require("Migrations");

module.exports = function(deployer, network) {
  if(network == 'development') {
    console.log('deploying to network ' + network + ' via port 7545')
    deployer.deploy(Migrations);
  } else if(network == 'rinkeby') {
    console.log('deploying to network ' + network + ' via port 8545')
    deployer.deploy(Migrations);
  } else {
    console.log('network ' + network + 'not supported or ready')
  }
};
