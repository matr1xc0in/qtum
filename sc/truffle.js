module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  // contracts_build_directory: "./build/contracts",
  networks: {
    development: {
      // Either use provider here, or specify host and port exclusively
      // provider: function() {
      //   var doesntmatter = require('./src/js/web3.min.js');
      //   if (typeof web3 !== 'undefined') {
      //       web3 = new Web3(web3.currentProvider);
      //   } else {
      //       // set the provider you want from Web3.providers
      //       web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
      //   }
      // },
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gas: 4700000
    },
    rinkeby: {
      host: "127.0.0.1", // Connect to geth on the specified
      port: 8545,
      from: "0x473a2ff25b3e963f700e25bd2c5e9412cbe961c0", // default address to use for any transaction Truffle makes during migrations
      network_id: 15,
      gas: 6000000 // Gas limit used for deploys
    }
  }
};
