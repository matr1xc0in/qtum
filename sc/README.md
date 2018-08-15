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

To run a single test case,
```
# It will still invoke all migration scripts first, but it will only trigger
# one test case for the contract you want to test.
truffle test --network=development test/15_simplegetset.js
```

# Qtum Contract Deployment
* `solar` deployment onto Qtum `testnet` - Deploy your smart contract.
Copy the contract into the container shared volume from your host machine, e.g.
```
cp -rp sc/contracts docker/testnet/qtum_data/
```
and now, if you are already running the `./docker/run-shell.sh` console, and you follow
from the parent's `README.md` file, you can access and deploy your contracts from the
wallet created before `qVuqcjpBmRYGjjVZm1q1LFa28KJGQYPepC` (assumed you have funded from
[Testnet faucet](http://testnet-faucet.qtum.info/#!/)) directly by running:
```
cd /dapp
solar --qtum_rpc=$QTUM_RPC --qtum_sender=qVuqcjpBmRYGjjVZm1q1LFa28KJGQYPepC --optimize deploy --force contracts/SimpleGetSet.sol
```
e.g.
```
exec: solc [contracts/SimpleGetSet.sol --combined-json bin,metadata --optimize --allow-paths /dapp]
🚀  All contracts confirmed
   deployed contracts/SimpleGetSet.sol => 43b39311a957ced773bd5373d9c58338c53c48f5
/dapp $ qcli fromhexaddress 43b39311a957ced773bd5373d9c58338c53c48f5
qPjMYwN7QnjC1mdJYfSJKrZiqXfRC4Ne61
```
and you can look them up on https://testnet.qtum.org e.g.
contract address - https://testnet.qtum.org/address/qPjMYwN7QnjC1mdJYfSJKrZiqXfRC4Ne61
qtum address balance - https://testnet.qtum.org/address/qVuqcjpBmRYGjjVZm1q1LFa28KJGQYPepC

# Known Issues
* https://github.com/qtumproject/qtum/issues/548 Proxy contract cannot invoke a remote contract function.
Workaround is to combine all contracts into 1 contract and deploy it. Yeah, gas killer and may be costly, etc.

