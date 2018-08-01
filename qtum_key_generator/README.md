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

It will kick off a shell, simply kick off `qtumd` by 
```
./start_qtumd.sh
```

and invoke the key-gen script, and type in the number for how many keys do
you want to generate. Default is set to `10`.
```
./_qtum-wallet-gen.sh
```

e.g. and you can use the address (qtum wallet) from the 1st column, and 
go to the [Qtum faucet](http://testnet-faucet.qtum.info/#!/) to fund Qtum for testing.
```
$ ./generate_keys.sh 
ok - this runs on a regtest network and it creates its own chaindata dir under
/..../github/qtum_hackathon/qtum_key_generator/regtest-keygen that shall not be used for other purposes!
20ffe2390f5e:~$ ./start_qtumd.sh 
20ffe2390f5e:~$ ./_qtum-wallet-gen.sh 
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
