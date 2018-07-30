#!/bin/bash

curr_dir=$(cd $(dirname $0); pwd)

QTUM_NETWORK=testnet
QTUM_CHAIN_DATA="$curr_dir/$QTUM_NETWORK/qtum_data"
mkdir -p "$QTUM_CHAIN_DATA"

DOCKER_QTUM_NETWORK=qtum_network_bridge

# Set this to 1 to enable debug log in console
# QTUM_DEBUG=0

docker run -it --rm \
  --name qtum_myapp \
  -e "QTUM_NETWORK=$QTUM_NETWORK" \
  --mount "type=bind,src=$QTUM_CHAIN_DATA,dst=/dapp" \
  -u $(id -u $USER) \
  --network=$DOCKER_QTUM_NETWORK \
  --ip 192.168.168.111 \
  -e QTUM_DEBUG=$QTUM_DEBUG \
  -p 9899:9899 \
  -p 9888:9888 \
  -p 3889:3889 \
  -p 13888:13888 \
  qtum-dev
