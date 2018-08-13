const privateKeys = require('./truffle-keys').private;
const publicKeys = require('./truffle-keys').public;
const EthereumTx = require('ethereumjs-tx');
var shopping_deals = artifacts.require("./SimpleGetSet.sol");

var default_loyal_program_reward = 168;
/* jshint ignore:start */
var eth_to_tok_exchangeRate = 10 ** 16;
/* jshint ignore:end */
var defaultTotalSupply = 1000000000000000000000000; // 1M * 10**18

/***********************
 * FUNCTION DEFINITION *
 ***********************/
function logging(msg) {
  // Define a CSS to format the text
  console.log('\x1b[47m\x1b[30m[TT]>>> ' + msg + '\x1b[0m');
}

function printData(data) {
  var str = '';
  for (var k in data) {
      if (typeof data[k] == 'object') str += k + printData(data[k]) + ' ';
      else str += k + ' => ' + data[k] + '\n';
  }
  return str;
}

function rawTransaction(
  senderPublicKey,
  senderPrivateKey,
  contractAddress,
  data,
  value
) {
  return new Promise((resolve, reject) => {

    let key = new Buffer(senderPrivateKey, 'hex');
    // required to keep track of tx#
    let nonce = web3.toHex(web3.eth.getTransactionCount(senderPublicKey));

    let gasPrice = web3.eth.gasPrice;
    let gasPriceHex = web3.toHex(web3.eth.estimateGas({
      from: contractAddress
    }));
    let gasLimitHex = web3.toHex(5500000);

    let rawTx = {
        nonce: nonce,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data: data,
        to: contractAddress,
        value: web3.toHex(value)
    };
    console.log('tx data includes: ' + printData(rawTx));
    let tx = new EthereumTx(rawTx);
    tx.sign(key);

    let stx = '0x' + tx.serialize().toString('hex');

    web3.eth.sendRawTransaction(stx, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
} // end function
/***************************
 * END FUNCTION DEFINITION *
 ***************************/
 
contract('SimpleGetSet', function(accounts) {
  describe("SimpleGetSet exchanging token with Qtum test cases", function() {
    let web3Contract = null;
    let eventCounter = {}; // to track all events fired
    let shopping_inventory_contract = null;

    /* jshint ignore:start */
    before(async () => {
      shopping_inventory_contract = (await shopping_deals.deployed({from: accounts[0]}));
      web3Contract = web3.eth.contract(shopping_inventory_contract.abi).at(shopping_inventory_contract.address);
      owner = web3Contract._eth.coinbase;
      logging('SimpleGetSet Contract Address=' + shopping_inventory_contract.address);
      logging('accounts[0]=' + accounts[0]);
      logging('owner=' + owner + ' publicKeys[0]=' + publicKeys[0]);
      logging('other=' + accounts[1] + ' publicKeys[1]=' + publicKeys[1]);
      let other = publicKeys[1];
  
      // Verifying that you have specified the right key for testing in ganache-cli
      if (publicKeys[0] !== owner || publicKeys[1] !== other) {
        throw new Error('Use `truffle develop` and store the keys in ./test/truffle-keys.js' +
        ', and make sure you specify these keys in ganache-cli');
      }
  
      // Tracks all events for later verification, count may be sufficient?
      shopping_inventory_contract.allEvents({}, (error, details) => {
        if (error) {
          console.error(error);
        } else {
          let count = eventCounter[details.event];
          eventCounter[details.event] = count ? count + 1 : 1;
        }
      });
    });

    it('should be able to sell tokens to non-owner', async function() {
      let notOwner = publicKeys[5];
      let notOwnerPrivateKey = privateKeys[5];
      let notOwnerBalanceBefore = (await shopping_inventory_contract.balanceOf.call(notOwner)).toNumber();
      let a0 = (await shopping_inventory_contract.balanceOf.call(accounts[0])).toNumber();
      let t0 = (await shopping_inventory_contract.balanceOf.call(shopping_inventory_contract.address)).toNumber();
      logging('accounts[0]=' + accounts[0] + ' has start token balance ' + a0);
      logging('shopping_inventory_contract.address=' + shopping_inventory_contract.address + ' has start token balance ' + t0);
      logging('publicKeys[5]=' + notOwner + ' has start token balance ' + notOwnerBalanceBefore);
      logging('SimpleGetSet contract address ' + shopping_inventory_contract.address + ' has init Qtum balance ' + web3.eth.getBalance(shopping_inventory_contract.address));
      // assert.equal(t0, 500000, "trader contract should be pre-funded with 500000 tokens from accounts[0]=" + accounts[0]);

      let value = 1; // 1 eth = 1 * 10 ** 18 wei. This needs to align with the contract

      let data = web3Contract.givemetokens.getData();

      let result = await rawTransaction(
        notOwner,
        notOwnerPrivateKey,
        shopping_inventory_contract.address,
        data,
        value
      );

      let notOwnerBalanceAfter = (await shopping_inventory_contract.balanceOf.call(notOwner)).toNumber();
      a0 = (await shopping_inventory_contract.balanceOf.call(accounts[0])).toNumber();
      t0 = (await shopping_inventory_contract.balanceOf.call(shopping_inventory_contract.address)).toNumber();
      logging('publickey[5]=' + notOwner + ' has new token balance ' + notOwnerBalanceAfter);
      logging('accounts[0]=' + accounts[0] + ' has new token balance ' + a0);
      logging('shopping_inventory_contract.address=' + shopping_inventory_contract.address + ' has new token balance ' + t0);
      logging('SimpleGetSet contract address ' + shopping_inventory_contract.address + ' has new Qtum balance ' + web3.eth.getBalance(shopping_inventory_contract.address));
      assert.strictEqual(0, result.indexOf('0x'));
    });
    /* jshint ignore:end */

  }); // end of describe

  describe("SimpleGetSet purchasing an iphone test cases", function() {
    let web3Contract = null;
    let eventCounter = {}; // to track all events fired
    let shopping_inventory_contract = null;
    let product_sku = 'SKU-123456789-iphone5s';
    let spent_qtum = 1;
    /* jshint ignore:start */
    let expected_balance = (spent_qtum * 10 ** 18 / eth_to_tok_exchangeRate) + default_loyal_program_reward;
    /* jshint ignore:end */

    /* jshint ignore:start */
    before(async () => {
      shopping_inventory_contract = (await shopping_deals.deployed({from: accounts[0]}));
      web3Contract = web3.eth.contract(shopping_inventory_contract.abi).at(shopping_inventory_contract.address);
      owner = web3Contract._eth.coinbase;
      logging('SimpleGetSet Contract Address=' + shopping_inventory_contract.address);
      logging('accounts[0]=' + accounts[0]);
      logging('owner=' + owner + ' publicKeys[0]=' + publicKeys[0]);
      logging('other=' + accounts[1] + ' publicKeys[1]=' + publicKeys[1]);
      let other = publicKeys[1];
  
      // Verifying that you have specified the right key for testing in ganache-cli
      if (publicKeys[0] !== owner || publicKeys[1] !== other) {
        throw new Error('Use `truffle develop` and store the keys in ./test/truffle-keys.js' +
        ', and make sure you specify these keys in ganache-cli');
      }

      // Tracks all events for later verification, count may be sufficient?
      shopping_inventory_contract.allEvents({}, (error, details) => {
        if (error) {
          console.error(error);
        } else {
          let count = eventCounter[details.event];
          eventCounter[details.event] = count ? count + 1 : 1;
        }
      });
    });

    it('should be able to shop for ipone5s for non-owner', async function() {
      let notOwner = publicKeys[5];
      let notOwnerBalanceBefore = (await shopping_inventory_contract.balanceOf.call(notOwner)).toNumber();
      let a0 = (await shopping_inventory_contract.balanceOf.call(accounts[0])).toNumber();
      let t0 = (await shopping_inventory_contract.balanceOf.call(shopping_inventory_contract.address)).toNumber();
      logging('accounts[0]=' + accounts[0] + ' has start token balance ' + a0);
      logging('shopping_inventory_contract.address=' + shopping_inventory_contract.address + ' has start token balance ' + t0);
      logging('publicKeys[5]=' + notOwner + ' has start token balance ' + notOwnerBalanceBefore);
      logging('SimpleGetSet contract address ' + shopping_inventory_contract.address + ' has init Qtum balance ' + web3.eth.getBalance(shopping_inventory_contract.address));

      let eth_value = 1; // 1 eth = 1 * 10 ** 18 wei. This needs to align with the contract
      let reg_tx = (await shopping_inventory_contract.sell_to(product_sku, {value: eth_value * 10 ** 18, from: notOwner}))
      logging('purchase status = ' + reg_tx.toString());

      let notOwnerBalanceAfter = (await shopping_inventory_contract.balanceOf.call(notOwner)).toNumber();
      a0 = (await shopping_inventory_contract.balanceOf.call(accounts[0])).toNumber();
      t0 = (await shopping_inventory_contract.balanceOf.call(shopping_inventory_contract.address)).toNumber();
      logging(notOwner + ' has new token balance ' + notOwnerBalanceAfter);
      logging('accounts[0]=' + accounts[0] + ' has new token balance ' + a0);
      logging('shopping_inventory_contract.address=' + shopping_inventory_contract.address + ' has new token balance ' + t0);

      assert.equal(notOwnerBalanceAfter, expected_balance, 'it should get ' + expected_balance + ' tokens for 1 qtum');
      assert.equal(t0, 999732, 'registry contract token should have remaining balance 999732');
    });

    it('should be able to fetch the sale history by their wallet', async function() {
      let notOwner = publicKeys[5];
      let purchased_item = (await shopping_inventory_contract.you_bought(notOwner, {from: notOwner})).toString();
      logging('fetched sale history = ' + purchased_item);
      assert.equal(purchased_item, product_sku, 'it should show sale history ' + product_sku);

      let notOwnerBalanceBefore = (await shopping_inventory_contract.balanceOf.call(notOwner)).toNumber();
      logging('publicKeys[5]=' + notOwner + ' has token balance ' + notOwnerBalanceBefore);
      t0 = (await shopping_inventory_contract.balanceOf.call(shopping_inventory_contract.address)).toNumber();
      assert.equal(t0, 999732, 'registry contract token should remain unchanged with balance 999732');
      assert.equal(notOwnerBalanceBefore, expected_balance, 'publicKeys[5]=' + notOwner + ' token balance should remain the same');
    });
    /* jshint ignore:end */

  }); // end of describe

  /* jshint ignore:end */
}); // end of contract