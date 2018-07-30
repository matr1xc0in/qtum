#!/bin/bash -x

DEBUG=${DEBUG:-"true"}
build_cmd="docker build "

if [ "$DEBUG" != "true" ] ; then
  build_cmd="docker build --no-cache"
fi

# Build base qtum image with the correct non-pivileged UID user
$build_cmd \
  --rm \
  -t qtum-dev \
  --build-arg QTUM_UID=$(id -u $USER) \
  --file Dockerfile \
  .

ret=$?
if [ "$ret" -ne "0" ] ; then
  echo  "fail - docker build fail"
fi

exist_network=$(docker network inspect qtum_network_bridge 2>/dev/null)
ret=$?
if [ "$ret" -ne "0" ] ; then
  echo 'ok - create docker network qtum_network_bridge'
  echo 'ok - the subnet 192.168.0.0/16 has already been whitelisted in qtumd-launch'
  docker network create -d bridge \
    --subnet=192.168.168.0/24 \
    --gateway=192.168.168.1 \
    --ip-range=192.168.168.0/24 \
    qtum_network_bridge
else
  echo "qtum_network_bridge => \n $exist_network"
fi

exit 0
