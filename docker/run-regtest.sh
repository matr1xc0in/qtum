#!/bin/bash

curr_dir=$(cd $(dirname $0); pwd)
QTUM_NETWORK=regtest
QTUM_CHAIN_DATA="$curr_dir/$QTUM_NETWORK/qtum_data"
mkdir -p "$QTUM_CHAIN_DATA"

DOCKER_QTUM_NETWORK=qtum_network_bridge
QTUM_DEBUG=${QTUM_DEBUG:0}
QTUM_RPC_IP="192.168.168.168"

docker run -it --rm \
  --name qtum_regtest \
  --mount "type=bind,src=$QTUM_CHAIN_DATA,dst=/dapp" \
  -u $(id -u $USER) \
  --network=$DOCKER_QTUM_NETWORK \
  --ip $QTUM_RPC_IP \
  -e QTUM_NETWORK=$QTUM_NETWORK \
  -e QTUM_DEBUG=$QTUM_DEBUG \
  -e QTUM_RPC_IP=$QTUM_RPC_IP \
  -e QTUM_RPC_USER=qtum \
  -e QTUM_RPC_PASS=test \
  -p 9899:9899 \
  -p 9888:9888 \
  -p 3889:3889 \
  -p 13888:13888 \
  qtum-dev
