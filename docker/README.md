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
and enhance the image for better security.
```
./build.sh
```

To kick of a `/bin/sh` shell to manually interact with `qcli` (qtum console interface). This shares
the same local directory `./qtum_data` with `run-testnet.sh` so you will reuse a copy of the `chaindata`.
Otherwise, you will need to download the whole chain everytime.
```
./run-shell.sh
```

To interact with [Qtum Testnet](https://testnet.qtum.info/), kick off the following
script and it will sync with Qtum testnet. To fund your Qtum
wallet with some test Qtum, go to [Qtum faucet](http://testnet-faucet.qtum.info/#!/), Once your wallet is funded,
you can do some deployment and testing on Qtum testnet. This automatically picks up the local dir
`./qtum_data` and continue to sync with Qtum testnet.
```
./run-testnet.sh
```
