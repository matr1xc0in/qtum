# Qtum wallet generator
This directory provides a docker to generate Qtum wallet address
that are derived from Ethereum address (private/public keys).

To build the Docker image first before running,
```
./build.sh
```

To run it, (default generates 10 key pairs)
```
generate_keys.sh
```

e.g. and you can use the address (qtum wallet) from the 1st column, and 
go to the [Qtum faucet](http://testnet-faucet.qtum.info/#!/) to fund Qtum for testing.
```
$ ./generate_keys.sh 
ok - this runs on a regtest network and it creates its own chaindata dir under
/..../github/qtum_hackathon/qtum_key_generator/regtest-keygen that shall not be used for other purposes!
# Ethereum Wallet Generator
# How many keypairs would you like to generate? (type in the number you would like, e.g '5' will generate 5 keypairs.)
3
ok - will be generating 3 key pairs
# You typed in: 3, will generate those now.
ok - generating Qtum key pair idx=0
ok - generating Qtum key pair idx=1
ok - generating Qtum key pair idx=2
qaz3MQCWfFuasK9iWvRvcgm9Xkure4WNgF	cQpznPutgUKNTYhSMryjX8FAu2ZrKYGZX7KGzWbj5PypdK1V1t2T
qQSBSXVxf3ZuogBDMvAASH6aiExyAnCFUb	cVQpwaHr926AN17DaU19UCwCrxmACMSxQ1WpNgnMcdpa8pSh964D
qQD2pHvsXuhnWdiWmb4gLWbzxyqpPc3iYq	cQU8Ens1jhghuiEGRr1q1LMkQY9dMnySewEMepuFtd7YnFG4cjkK
```

# Manual Testing
Kick off the `debug.sh` script, it will enter the container and provide you
a `sh` shell promopt.
```
./debug.sh
# The qtumd should be running already, 'ps aux' shows
# qtumd -regtest -rpcbind=0.0.0.0:13889 -rpcallowip=192.168.0.0/16 -datadir=/dapp/.qtum -logevents -logips
```

If you want to manually restart `qtumd`, you can
```
cd $HOME
kill $(pgrep -n -x qtumd)
./start_qtumd.sh
```

and invoke the key-gen script, and type in the number for how many keys do
you want to generate. Default is set to `10`.
```
./_qtum-wallet-gen.sh
```

e.g. and you can use the address (qtum wallet) from the 1st column, and 
go to the [Qtum faucet](http://testnet-faucet.qtum.info/#!/) to fund Qtum for testing.
