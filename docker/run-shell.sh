#!/bin/bash

curr_dir=$(cd $(dirname $0); pwd)

QTUM_NETWORK=regtest
QTUM_CHAIN_DATA="$curr_dir/$QTUM_NETWORK/qtum_data"
mkdir -p "$QTUM_CHAIN_DATA"

DOCKER_QTUM_NETWORK=qtum_network_bridge

docker run -it --rm \
  --name qtum_shell_cli \
  -e "QTUM_NETWORK=$QTUM_NETWORK" \
  --entrypoint '' \
  --mount "type=bind,src=$QTUM_CHAIN_DATA,dst=/dapp" \
  -u $(id -u $USER) \
  --network=$DOCKER_QTUM_NETWORK \
  --ip 192.168.168.100 \
  -e QTUM_RPC_USER="qtum" \
  -e QTUM_RPC_PASS="test" \
  -e QTUM_RPC="http://qtum:test@192.168.168.168:3889" \
  qtum-dev \
  sh
