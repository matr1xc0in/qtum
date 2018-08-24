# Node.js Web Server

## Installation

```
npm init -y

npm i qtumjs

npm i etherumjs-abi

npm i express

npm i base58check
```

## Package

TBD

## Run

currently, run `app.js` directly.

```
node app.js
```

## Examples

### Register IPFS

```
curl -v -XPOST -H "Sender-Address: qR7LMJGTNTktrhd5AUeyNkGQNAnPzdX5eu" http://ipfs.joecwu.com:6000/register/joetest
*   Trying 13.112.184.116...
* TCP_NODELAY set
* Connected to ipfs.joecwu.com (13.112.184.116) port 6000 (#0)
> POST /register/joetest HTTP/1.1
> Host: ipfs.joecwu.com:6000
> User-Agent: curl/7.54.0
> Accept: */*
> Sender-Address: qR7LMJGTNTktrhd5AUeyNkGQNAnPzdX5eu
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 1644
< ETag: W/"66c-qIXRcGZlWeu42DM45q2OOO4kDAE"
< Date: Tue, 21 Aug 2018 18:24:40 GMT
< Connection: keep-alive
<
* Connection #0 to host ipfs.joecwu.com left intact
{"amount":0,"fee":-0.57465451,"confirmations":0,"trusted":true,"txid":"48a0c525498fe849f98b7557cbff4b588c3b88696e204a191bc9ddd5389c3a7e","walletconflicts":[],"time":1534875880,"timereceived":1534875880,"bip125-replaceable":"no","details":[{"account":"","address":"qR7LMJGTNTktrhd5AUeyNkGQNAnPzdX5eu","category":"send","amount":-9.42534549,"label":"bcq","vout":0,"fee":-0.57465451,"abandoned":false},{"account":"","category":"send","amount":0,"vout":1,"fee":-0.57465451,"abandoned":false},{"account":"bcq","address":"qR7LMJGTNTktrhd5AUeyNkGQNAnPzdX5eu","category":"receive","amount":9.42534549,"label":"bcq","vout":0}],"hex":"0200000001d88f113ac4c4ea185512f5886b9377bb09813a7d895568201c2175ce84fc3404010000006a47304402206fc6c5d59bb1897d2c9730999a626e5515ef9160ebac04a369483df35e85998c02207305e8f4712366bb843c6c913d2fdc6d91c31e8225a612a2f25d1d8e178532da0121023d9c1abee1757e6576277d012763c47a41fed8ba5f3c059de393de475fd59ff4feffffff0295ef2d38000000001976a91452d3d96201bc1edf7f47d14b0ef4fd4210a4dba088ac0000000000000000fd2501010403400d0301284d0401616b48a7000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c03030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030323030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303037366136663635373436353733373430303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030301443b39311a957ced773bd5373d9c58338c53c48f5c2ac090300","method":"sell_to(string)"}⏎

```

### Query Balance

```
curl -v http://ipfs.joecwu.com:6000/balance/877feaaf2658f2faa90dc14528674c7e8331b980
*   Trying 13.112.184.116...
* TCP_NODELAY set
* Connected to ipfs.joecwu.com (13.112.184.116) port 6000 (#0)
> GET /balance/877feaaf2658f2faa90dc14528674c7e8331b980 HTTP/1.1
> Host: ipfs.joecwu.com:6000
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 67
< ETag: W/"43-ZwZrX9OrUVCrqP5IprSuhog0PAY"
< Date: Tue, 21 Aug 2018 18:30:47 GMT
< Connection: keep-alive
<
* Connection #0 to host ipfs.joecwu.com left intact
{"wallet":"877feaaf2658f2faa90dc14528674c7e8331b980","balance":168}⏎
```