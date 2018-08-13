const privateKeys = require('./truffle-keys').private;
const publicKeys = require('./truffle-keys').public;
const EthereumTx = require('ethereumjs-tx');
var init_fake20_tok = require("./8_init_TDD_fake20.js");
var shopping_deals = artifacts.require("./SimpleShopping.sol");

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
 
contract('SimpleShopping', function(accounts) {
  describe("SimpleShopping contract creation and inspection before testing", function() {
    let erc20tok = null;
    /* jshint ignore:start */
    it("should have the shared context", async function() {
      context = await init_fake20_tok.run(accounts);
      erc20tok = context.fake_tok_instance;
      assert(erc20tok !== undefined, 'has been assigned with ERC20 contract instance');
    });

    it(accounts[0] + " should have init balance of " + defaultTotalSupply + " TDD tokens by default", async function() {
      let registry_instance = null;

      registry_instance = await shopping_deals.deployed(erc20tok.address, {from: accounts[1]});
      let balance = (await erc20tok.balanceOf.call(accounts[0])).toNumber();
      assert.equal(balance.valueOf(),
                   defaultTotalSupply,
                   defaultTotalSupply + " wasn't in the first account " + accounts[0]);
      console.log('SimpleShopping deployed with address ' +
                  registry_instance.address +
                  ' using SimpleTest TDD token address ' +
                  erc20tok.address);
      let erc20_addr = (await registry_instance.current_currency.call());
      assert.equal(erc20_addr,
                  erc20tok.address,
                  'SimpleShopping contract should hold SimpleTest contract address ' + erc20tok.address);
    });
  });

  describe("SimpleShopping exchanging token with Qtum test cases", function() {
    let web3Contract = null;
    let eventCounter = {}; // to track all events fired
    let erc20_contract = null;
    let shopping_inventory_contract = null;

    /* jshint ignore:start */
    before(async () => {
      context = await init_fake20_tok.run(accounts);
      erc20_contract = context.fake_tok_instance;
      assert(erc20_contract !== undefined, 'has not been assigned with SimpleTest TDD contract instance');
      shopping_inventory_contract = (await shopping_deals.deployed(erc20_contract.address, {from: accounts[0]}));
      web3Contract = web3.eth.contract(shopping_inventory_contract.abi).at(shopping_inventory_contract.address);
      owner = web3Contract._eth.coinbase;
      logging('TDD Token Contract Address=' + erc20_contract.address);
      logging('SimpleShopping Contract Address=' + shopping_inventory_contract.address);
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
      let notOwnerBalanceBefore = (await erc20_contract.balanceOf.call(notOwner)).toNumber();
      // PRE-FUND this Trading Contract with ALL Tokens from accounts[0]
      let pre_fund_completed = (await erc20_contract.transfer(shopping_inventory_contract.address, 500000, {from: accounts[0]}));
      logging('Pre-funding shopping_inventory_contract ' + shopping_inventory_contract.address + ' with init token balance 500000');
      let a0 = (await erc20_contract.balanceOf.call(accounts[0])).toNumber();
      let e0 = (await erc20_contract.balanceOf.call(erc20_contract.address)).toNumber();
      let t0 = (await erc20_contract.balanceOf.call(shopping_inventory_contract.address)).toNumber();
      logging('accounts[0]=' + accounts[0] + ' has start token balance ' + a0);
      logging('erc20_contract.address=' + erc20_contract.address + ' has start token balance ' + e0);
      logging('shopping_inventory_contract.address=' + shopping_inventory_contract.address + ' has start token balance ' + t0);
      logging('publicKeys[5]=' + notOwner + ' has start token balance ' + notOwnerBalanceBefore);
      logging('SimpleShopping contract address ' + shopping_inventory_contract.address + ' has init Qtum balance ' + web3.eth.getBalance(shopping_inventory_contract.address));
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

      let notOwnerBalanceAfter = (await erc20_contract.balanceOf.call(notOwner)).toNumber();
      a0 = (await erc20_contract.balanceOf.call(accounts[0])).toNumber();
      e0 = (await erc20_contract.balanceOf.call(erc20_contract.address)).toNumber();
      t0 = (await erc20_contract.balanceOf.call(shopping_inventory_contract.address)).toNumber();
      logging(notOwner + ' has new token balance ' + notOwnerBalanceAfter);
      logging('accounts[0]=' + accounts[0] + ' has new token balance ' + a0);
      logging('erc20_contract.address=' + erc20_contract.address + ' has new token balance ' + e0);
      logging('shopping_inventory_contract.address=' + shopping_inventory_contract.address + ' has new token balance ' + t0);
      logging('SimpleShopping contract address ' + shopping_inventory_contract.address + ' has new Qtum balance ' + web3.eth.getBalance(shopping_inventory_contract.address));
      assert.strictEqual(0, result.indexOf('0x'));
    });
    /* jshint ignore:end */

  }); // end of describe

  describe("SimpleShopping purchasing an iphone test cases", function() {
    let web3Contract = null;
    let eventCounter = {}; // to track all events fired
    let erc20_contract = null;
    let shopping_inventory_contract = null;
    let product_sku = 'SKU-123456789-iphone5s';
    let spent_qtum = 1;
    /* jshint ignore:start */
    let expected_balance = (spent_qtum * 10 ** 18 / eth_to_tok_exchangeRate) + default_loyal_program_reward;
    /* jshint ignore:end */

    /* jshint ignore:start */
    before(async () => {
      context = await init_fake20_tok.run(accounts);
      erc20_contract = context.fake_tok_instance;
      assert(erc20_contract !== undefined, 'has been assigned with SimpleTest TDD contract instance');
      shopping_inventory_contract = (await shopping_deals.deployed(erc20_contract.address, {from: accounts[0]}));
      web3Contract = web3.eth.contract(shopping_inventory_contract.abi).at(shopping_inventory_contract.address);
      owner = web3Contract._eth.coinbase;
      logging('SimpleTest TDD Token Contract Address=' + erc20_contract.address);
      logging('SimpleShopping Contract Address=' + shopping_inventory_contract.address);
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

    it('should have pre-funded tokens before serving registry', async function() {
      let t0 = (await erc20_contract.balanceOf.call(shopping_inventory_contract.address)).toNumber();
      logging('shopping_inventory_contract=' + shopping_inventory_contract.address + ' has init token balance ' + t0);
      assert.equal(t0, 499900, "shopping_inventory_contract " + shopping_inventory_contract.address +
        " contract should still have remaining 499900 tokens from accounts[0]=" + accounts[0]);
    });

    it('should be able to shop for ipone5s for non-owner', async function() {
      let notOwner = publicKeys[5];
      let notOwnerBalanceBefore = (await erc20_contract.balanceOf.call(notOwner)).toNumber();
      let a0 = (await erc20_contract.balanceOf.call(accounts[0])).toNumber();
      let e0 = (await erc20_contract.balanceOf.call(erc20_contract.address)).toNumber();
      let t0 = (await erc20_contract.balanceOf.call(shopping_inventory_contract.address)).toNumber();
      logging('accounts[0]=' + accounts[0] + ' has start token balance ' + a0);
      logging('erc20_contract.address=' + erc20_contract.address + ' has start token balance ' + e0);
      logging('shopping_inventory_contract.address=' + shopping_inventory_contract.address + ' has start token balance ' + t0);
      logging('publicKeys[5]=' + notOwner + ' has start token balance ' + notOwnerBalanceBefore);
      logging('SimpleShopping contract address ' + shopping_inventory_contract.address + ' has init Qtum balance ' + web3.eth.getBalance(shopping_inventory_contract.address));

      let eth_value = 1; // 1 eth = 1 * 10 ** 18 wei. This needs to align with the contract
      let reg_successful = (await shopping_inventory_contract.sell_to(product_sku, {value: eth_value * 10 ** 18, from: notOwner}))
      logging('purchase status = ' + reg_successful.toString());

      let notOwnerBalanceAfter = (await erc20_contract.balanceOf.call(notOwner)).toNumber();
      a0 = (await erc20_contract.balanceOf.call(accounts[0])).toNumber();
      e0 = (await erc20_contract.balanceOf.call(erc20_contract.address)).toNumber();
      t0 = (await erc20_contract.balanceOf.call(shopping_inventory_contract.address)).toNumber();
      logging(notOwner + ' has new token balance ' + notOwnerBalanceAfter);
      logging('accounts[0]=' + accounts[0] + ' has new token balance ' + a0);
      logging('erc20_contract.address=' + erc20_contract.address + ' has new token balance ' + e0);
      logging('shopping_inventory_contract.address=' + shopping_inventory_contract.address + ' has new token balance ' + t0);
      logging('SimpleShopping contract address ' + shopping_inventory_contract.address + ' has new Qtum balance ' + web3.eth.getBalance(shopping_inventory_contract.address));

      assert.equal(notOwnerBalanceAfter, expected_balance, 'it should get ' + expected_balance + ' tokens for 1 qtum');
      assert.equal(t0, 499732, 'registry contract token should have remaining balance 499732');
    });

    it('should be able to fetch the sale history by their wallet', async function() {
      let notOwner = publicKeys[5];
      let purchased_item = (await shopping_inventory_contract.you_bought(notOwner, {from: notOwner})).toString();
      logging('fetched sale history = ' + purchased_item);
      assert.equal(purchased_item, product_sku, 'it should show sale history ' + product_sku);

      let notOwnerBalanceBefore = (await erc20_contract.balanceOf.call(notOwner)).toNumber();
      logging('publicKeys[5]=' + notOwner + ' has token balance ' + notOwnerBalanceBefore);
      t0 = (await erc20_contract.balanceOf.call(shopping_inventory_contract.address)).toNumber();
      assert.equal(t0, 499732, 'registry contract token should remain unchanged with balance 499732');
      assert.equal(notOwnerBalanceBefore, expected_balance, 'publicKeys[5]=' + notOwner + ' token balance should remain the same');
    });
    /* jshint ignore:end */

  }); // end of describe

  /* jshint ignore:end */
}); // end of contract