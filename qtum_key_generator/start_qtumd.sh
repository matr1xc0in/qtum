#!/bin/sh

qtumd-launch >> $HOME/logs.txt 2>&1 &

exec "$@"
