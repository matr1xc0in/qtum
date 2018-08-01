#!/bin/bash

curr_dir=$(cd $(dirname $0); pwd)

QTUM_DOCKER_IP=
QTUM_NETWORK=${QTUM_NETWORK:-"regtest"}
QTUM_CHAIN_DATA="$curr_dir/$QTUM_NETWORK/qtum_data"
mkdir -p "$QTUM_CHAIN_DATA"

DOCKER_QTUM_NETWORK=qtum_network_bridge
if [ "$QTUM_NETWORK" = "regtest" ] ; then
  QTUM_DOCKER_IP=${QTUM_DOCKER_IP:-"192.168.168.168"}
elif [ "$QTUM_NETWORK" = "testnet" ] ; then
  QTUM_DOCKER_IP=${QTUM_DOCKER_IP:-"192.168.168.111"}
else
  echo "fatal - cannot recognize qtum network ${QTUM_NETWORK}, exiting!"
  exit -1
fi

echo "ok - connecting to Qtum $QTUM_NETWORK on IP $QTUM_DOCKER_IP"

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
  -e QTUM_RPC="http://qtum:test@${QTUM_DOCKER_IP}:3889" \
  qtum-dev \
  sh
