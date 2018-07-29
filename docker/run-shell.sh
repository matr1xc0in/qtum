#!/bin/bash

curr_dir=$(cd $(dirname $0); pwd)

QTUM_CHAIN_DATA="$curr_dir/qtum_data"
mkdir -p "$QTUM_CHAIN_DATA"

docker run -it --rm \
  --name qtum_myapp \
  -e "QTUM_NETWORK=testnet" \
  --entrypoint '' \
  --mount "type=bind,src=$QTUM_CHAIN_DATA,dst=/dapp" \
  -u $(id -u $USER) \
  -p 9899:9899 \
  -p 9888:9888 \
  -p 3889:3889 \
  -p 13888:13888 \
  qtum-dev \
  sh
