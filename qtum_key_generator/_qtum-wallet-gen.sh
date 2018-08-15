#!/bin/bash

# Reference: https://github.com/vkobel/ethereum-generate-wallet
# https://kobl.one/blog/create-full-ethereum-keypair-and-address/

echo -n "Starting local qtumd instance."
WARMING_UP=0
while [ $WARMING_UP -le 5 ]
do
  sleep 1
  echo -n '.'
  let WARMING_UP++
done
echo ""
echo "Qtumd warmed up, we are ready to go."

totalGenKeyPairs=10
declare -a KEYPAIRS_QTUM_ADDR
declare -a KEYPAIRS_ADDR
declare -a KEYPAIRS_PRIV

while getopts :n opt; do
  case $opt in
    n)
      totalGenKeyPairs=$OPTARG;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

echo "# Ethereum Wallet Generator"
echo "# How many keypairs would you like to generate? (type in the number you would like, e.g '5' will generate 5 keypairs.)"

read totalGenKeyPairs

if [ "$totalGenKeyPairs" -eq "$totalGenKeyPairs" ] 2>/dev/null; then #this checks if input is numeric
  if [ $totalGenKeyPairs -eq "0" ]; then
    echo "# You typed in 0. No keys will be generated. Exiting!";
    exit 0
  fi
  echo "ok - will be generating $totalGenKeyPairs key pairs"
else
  totalGenKeyPairs=10
  echo "ok - default setting to $totalGenKeyPairs key pairs"
fi

echo "# You typed in: $totalGenKeyPairs, will generate those now.";

idx=0
while [ $idx -lt $totalGenKeyPairs ]
do
  echo "ok - generating Qtum key pair idx=$idx"
  qtum_addr=$(qcli -rpcconnect=192.168.168.44 -rpcport=13889 -regtest getnewaddress)
  qtum_priv=$(qcli -rpcconnect=192.168.168.44 -rpcport=13889 -regtest dumpprivkey $qtum_addr)
  KEYPAIRS_QTUM_ADDR[$idx]="$qtum_addr"
  KEYPAIRS_PRIV[$idx]="$qtum_priv"
  let idx=idx+1
done # end while

# Print out all mapping keys
max_idx="${#KEYPAIRS_QTUM_ADDR[@]}"
let max_idx=max_idx-1
for i in $(seq 0 $max_idx)
do
  qtum_addr=${KEYPAIRS_QTUM_ADDR[$i]}
  qtum_priv=${KEYPAIRS_PRIV[$i]}
  echo -e "${qtum_addr}\t${qtum_priv}"
done

exit 0
