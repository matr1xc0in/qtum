# Docker build for Qtum Development

This dir contains all the docker related stuff for development, testing, etc.
**DO NOT USE these for production**. It's only good for local development,
deployment, and to prototype stuff, etc.
It simplies provide a more secure container than the original one `hayeah/qtumportal:latest`.
The original image was built based on Alpine Linux by the way. We will always use a
secured image (e.g. Alpine).
```
$ cat /etc/alpine-release
3.7.0
```

This builds the Docker image based on [hayeah/qtumportal:latest](https://hub.docker.com/r/hayeah/qtumportal/tags/)
and enhance the image for better security. It performs the following:
* Upgrade Alpine packages
* Create a local docker network `qtum_network_bridge` with subnet `192.168.168.0/24`,
gateway is `192.168.168.1`.
* Override `/Procfile` and `qtumd-launch` to whitelist subnet `192.168.0.0/16` for JSON-RPC calls.
The subnet `172.17.0.0/16` overlaps with `docker0` defaults, hence, we cahnge it to `192.168.0.0/16`
and we assign IP from `192.168.0.0/16` to `qtumd` service.
* `qtumd-launch` will bind to all interfaces `0.0.0.0` inside the container
* Added `QTUM_DEBUG` env variable to swith debug mode `on|off`. `export QTUM_DEBUG=1` will enable debug.
Be aware, this prints out a lot of logs on console. Default is `QTUM_DEBUG=0`.
* Added `QTUM_RPC_IP` env variable for `qcli` so you no longer need to specify `-rpcconnect=x.x.x.x`
everytime.
```
./build.sh
```

**Remember to delete './regtest/qtum_data' if you make any changes to start fresh**
The following script kicks off a **local** Qtum network for **Testing** (aka `regtest`)
running as container `qtum_regtest`. It also attach to the docker network `qtum_network_bridge`
created to interact with other local docker container (e.g. the one starts by `run-shell.sh`).
It will have a local IP `192.168.168.168` assigned at startup on one of its interface.
```
./run-regtest.sh
# to enable debug mode, debug default is disabled.
export QTUM_DEBUG=1 ; ./run-regtest.sh
# To clean up and start fresh with block=0
rm -rf ./regtest; ./run-regtest.sh
```

To kick of a `/bin/sh` shell to manually interact with `qcli` (qtum console interface). This shares
the same local directory `./regtest/qtum_data` with `run-regtest.sh` so you will reuse a copy of the `chaindata`.
This can interact with different Qtum network, however, you will need to specify the RPC address and port
respectively inside the container when you invoke `qcli`.
```
# Default connects to Qtum regtest network
./run-shell.sh
# This connects to Testnet container. ./run-testnet.sh must be running.
QTUM_NETWORK=testnet ./run-shell.sh
```

The chain `regtest` has 0 block from the beginning, and you won't have any Qtum to spend.
The blocks in `regtest` mode will generate by itself gradually, but it's faster to
just bootstrap it so you don't need to wait. You will see the following error message
if you try to send a transaction from the beginning.
```
qcli sendtoaddress qfq9iwQ4sS83hJ99XveRZAhibV41PFngoT 10
error code: -6
error message:
Insufficient funds
```

Let's bootstrap manually to generate `600` blocks with the following command.
You need exactly `501+` blocks to take rewards (`regtest` per block reqard is `20000`).
It takes about ~30 seconds or less. In `regtest` mode, `501+` blocks are sufficient.
It does not matter if it is PoW/PoS. (In Qtum world, from the genesis block=0,
PoW is applied to the first 5000 blocks, and it switches over to PoS after 5000 blocks).
```
qcli generate 600
```
e.g. now you have some balance in your Qtum coinbase wallet.
```
qcli getbalance
2019989.99923200
```

Testing connectivity from your `shell` container to others, you can use `curl`. e.g. testing
connectivity to `regtest` container that is running Qtum regtest.
```
curl --connect-timeout 1 -sSf -v telnet://192.168.168.168:9888
^C
```

Some example `qcli` commands to connect to `qtum_regtest` container.
```
qcli getblockchaininfo
qcli getnetworkinfo
qcli getwalletinfo
```

The following env variables defined in the Docker images are useful. You can override them
for your customization during `docker run`.
```
QTUM_DATADIR=/dapp/.qtum
QTUM_USER=qtumuser
QTUM_NETWORK=regtest
QTUM_RPC_PASS=test
QTUM_GID=5888
QTUM_RPC_USER=qtum
QTUM_UID=501
QTUM_RPC_IP=192.168.168.168
QTUM_RPC=http://qtum:test@192.168.168.168:3889
```

# Deploy to Qtum TestNet

To interact with [Qtum Testnet](https://testnet.qtum.info/), kick off the following
script and it will sync with Qtum testnet. To fund your Qtum
wallet with some test Qtum, go to [Qtum faucet](http://testnet-faucet.qtum.info/#!/), Once your wallet is funded,
you can do some deployment and testing on Qtum testnet. This automatically picks up the local dir
`./testnet/qtum_data` and continue to sync with Qtum testnet. Keep in mind, Qtum uses [UTXO](http://book.qtum.site/en/part1/utxos-balances.html) which is not like Ethereum.
```
# The container IP is 192.168.168.111. If you want to connect to the qtumd testnet daemon
# running inside the container.
./run-testnet.sh
# to enable debug mode, debug default is disabled.
export QTUM_DEBUG=1 ; run-testnet.sh
```

`qcli` command to connect to the Qtum testnet client container running on your local laptop.
```
# TBD
qcli getblockchaininfo
qcli getnetworkinfo
qcli getwalletinfo
```

# Import keys from key-generator

Assume you use the `qtum_key_generator` key generator to generate a pair of key, you can
import the private key and use it in your wallet after you import it.
```
# qVuqcjpBmRYGjjVZm1q1LFa28KJGQYPepC	cRgRqGfiP7wTdhUR4k9z9QBWsuBvSXmcVT4SeEoUSea7dKC3MLw7
~ $ qcli importprivkey cRgRqGfiP7wTdhUR4k9z9QBWsuBvSXmcVT4SeEoUSea7dKC3MLw7 "from-keygen" true
~ $ qcli listaccounts
{
  "": -225.30916246,
  "xyz": 136.27344962,
  "from-keygen": 78.00000000,
  "abc": 163.09002760
}
```
