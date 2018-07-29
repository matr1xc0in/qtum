#!/bin/bash -x

set -e 

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

exit 0
