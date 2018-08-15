#!/bin/bash

curr_dir=$(cd $(dirname $0); pwd)
QTUM_NETWORK=regtest
QTUM_CHAIN_DATA="$curr_dir/${QTUM_NETWORK}-keygen/qtum_data"
mkdir -p "$QTUM_CHAIN_DATA"

DOCKER_QTUM_NETWORK=qtum_network_bridge
QTUM_DEBUG=${QTUM_DEBUG:0}

echo "ok - this runs on a regtest network and it creates its own chaindata dir under"
echo "$curr_dir/${QTUM_NETWORK}-keygen that shall not be used for other purposes!"

docker run -it \
  --rm \
  -e "QTUM_NETWORK=$QTUM_NETWORK" \
  --mount "type=bind,src=$QTUM_CHAIN_DATA,dst=/dapp" \
  -u $(id -u $USER) \
  --network=$DOCKER_QTUM_NETWORK \
  --ip 192.168.168.44 \
  -e QTUM_DEBUG=$QTUM_DEBUG \
  -e QTUM_RPC_USER=qtum \
  -e QTUM_RPC_PASS=test \
  qtum-gen-key \
  sh -l
