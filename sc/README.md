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

