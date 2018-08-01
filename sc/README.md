# A Solidity contract for IPFS Storage Registry

*DO NOT USE truffle-keys.js ADDRESS. THEY ARE INSECURE AND YOU
WILL LOSE YOUR FUND*

We use truffle for development. To setup Truffle,
see https://truffleframework.com/docs/getting_started/project

* Init npm modiules first for some javascript libs
```
npm install
```

* Compile the contract
```
rm -rf build; truffle compile --reset
```

* Run test on the contract, make sure [ganachi](https://github.com/matr1xc0in/ganache-cli/tree/dockerize-it) is running. We use
local port `7545` here for test. See `./truffle.js`. The key-pairs used for test
case are defined in `./testtruffle-keys.js`.
```
# To kick off Ganachi with predictable key-pairs on local port 7545
# The keys are hardcoded in the script
./run-keys.sh
```
and kick off the test case.
```
truffle test --network=development
```

* `solar` deployment onto Qtum local `regtest` for testing, e.g.
```
$ solar deploy ERC20Token.sol '["NoSilo","TBD"]'
exec: solc [ERC20Token.sol --combined-json bin,metadata --optimize --allow-paths /dapp/contracts]
🚀  All contracts confirmed
   deployed ERC20Token.sol => 04a44512bd857510c43f019dfd6798cee959bdc2
$ solar deploy RewardDistributor.sol  '["04a44512bd857510c43f019dfd6798cee959bdc2",true,100]'
exec: solc [RewardDistributor.sol --combined-json bin,metadata --optimize --allow-paths /dapp/contracts]
🚀  All contracts confirmed
   deployed RewardDistributor.sol => 1bbd63601e7834c02e18d2e9e9071df6f984239d
$ solar status
✅  ERC20Token.sol
        txid: 8bac47eebdcccd3dead21e6d8c558b7adb168e5f3ac79a0456a201b733741fa5
     address: 04a44512bd857510c43f019dfd6798cee959bdc2
   confirmed: true
       owner: qTKLeXWdVdV8dUJtLtLDYiynr1fqqF2xWX

✅  RewardDistributor.sol
        txid: 851b13f63d1da808f04d333810c903bba7bad32f1821d210eade194c9187c784
     address: 1bbd63601e7834c02e18d2e9e9071df6f984239d
   confirmed: true
       owner: qW899g5aDNpPQ9NGbRcyWDenP7iNY1jfmW
```
*The argument MUST be a json array. Use double quote to wrap String, and single quote for the entire array*
