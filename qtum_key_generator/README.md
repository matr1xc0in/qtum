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

and invoke the key-gen script
```
./_qtum-wallet-gen.sh
```
