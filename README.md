# Qtum
A place for hackathon projects on Qtum.

* `QWallet` - The code for Qtum wallet is linked (https://github.com/HenryFanDi/QWallet/tree/qtum-ios-bsx)
* `docker` - files and scripts to build/start a docker container for Qtum.
Reference: http://book.qtum.site/en/part1/qtum-docker.html
We added some minor security enhancement, and other sugar syntax t run it locally, that's it.
* `sc` - the Solidity smart contracts for testing and integrating into out
application. Be aware, Qtum EVM is NOT the same as Ethereuem's EVM's. For existing issues,
see: [qtumprojects/qtum issues on requires-fork label](https://github.com/qtumproject/qtum/issues?q=is%3Aissue+is%3Aopen+label%3Arequires-fork)
* `qtum_key_generator` - A quick key-pair generator to share/test qtum wallets across
machines. *Only use this for testing*, no randomness guarantee and the key pairs may
be compromised.

# Setting up a Test Integration environment
1. Generate a key pair, launch the qtum key generator and type in the numbers of
address you want.
```
./qtum_key_generator/generate_keys.sh
```

2. Kick off your `qtumd` test instance, can be `regtest` or `testnet`, etc. We use `testnet`
here so it simulates a production-like integration.
```
./docker/run-testnet.sh
```

3. Launch a qcli shell to access the `testnet`, convinient script `run-shell.sh` is provided.
Copy/paste qtum addresses generated from previous step and import into your running qtumd
instance via `importprivkey` option.
```
QTUM_NETWORK=testnet ./docker/run-shell.sh 
```
and import the private key. You can fund your wallet via [testnet faucet](http://testnet-faucet.qtum.info/#!/).
and the qtum address for this test private key is `qVuqcjpBmRYGjjVZm1q1LFa28KJGQYPepC`.
```
# importprivkey "qtumprivkey" ( "label" ) ( rescan )
qcli importprivkey cRgRqGfiP7wTdhUR4k9z9QBWsuBvSXmcVT4SeEoUSea7dKC3MLw7 "from-keygen" true
```
Now, you have a running qtumd with funded qtum to play with.

4. Exposing `qtumd` instance via docker is possible. As you can see, they are exposed on
all interfaces with the ports (e.g. `3889`, etc.).
```
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS              PORTS                                                                                                        NAMES
94c56e8bc73a        qtum-dev            "/bin/sh -c 'mkdir -…"   About a minute ago   Up About a minute   0.0.0.0:3889->3889/tcp, 0.0.0.0:9888->9888/tcp, 0.0.0.0:9899->9899/tcp, 3888/tcp, 0.0.0.0:13888->13888/tcp   qtum_myapp
$ docker port 94c56e8bc73a
3889/tcp -> 0.0.0.0:3889
9888/tcp -> 0.0.0.0:9888
9899/tcp -> 0.0.0.0:9899
13888/tcp -> 0.0.0.0:13888
```
You can allow others to interact with this instance to perform some task by utilizing
the same wallet (address) you generated from previous step. This means:

*Pros*:
* your application does not need to run a local qtum wallet (SPV)
* your application does not need to manage the wallet (unlocking with password, etc.)
* you can take advantage of the RPC APIs to make remote calls via other libraries (e.g. [qtumjs](https://github.com/qtumproject/qtumjs)
or [qweb3.js](https://github.com/bodhiproject/qweb3.js), etc)

*Cons*:
* If the `qtumd` instance is compromised by anyone else, you lose your qtum.
* You copied/pasted your private key expose risk, never ship your private key :-)
* Moving your wallet around is more complex and exposed to more risk.

Note: This is why this is only for *testing* Otz...... so please don't do this in production.
At least lock down and whitelist the IP that is accessing the docker instance, etc.

5. Deploy your smart contract. Copy the contract into the container shared volume
from your host machine, e.g.
```
cp -rp sc/contracts docker/testnet/qtum_data/
```
and now, if you are already running the `./docker/run-shell.sh` console, you can access
and deploy your contracts from the wallet created above `qVuqcjpBmRYGjjVZm1q1LFa28KJGQYPepC`
directly by running:
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

6. Now, integrate your application with me (the docker container).



