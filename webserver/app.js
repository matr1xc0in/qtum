const { QtumRPC, Contract } = require('qtumjs');

const repo = require('./solar.development.json');

const rpc = new QtumRPC('http://qtum:test@localhost:3889');
const contract = new Contract(rpc, repo.contracts['contracts/SimpleGetSet.sol']);

const abi = require('ethereumjs-abi');
// const bs58 = require('bs58')

var express = require('express')
var app = express()

async function balanceOf(resp, address) {
    try{
        // var encodedAddr = bs58.decode(address).toString('hex')
        console.log(`invoking balanceOf with address:[${address}]`);
        const res = await contract.call('balanceOf(address)', [address]);
        const balance = res.outputs[0];
        console.log('balanceOf res:', res);
        // var balance = abi.simpleDecode("balanceOf(address):(uint256)", res.executionResult.output)
        // var balance = abi.rawDecode(['uint256'], res.executionResult.output)[0];
        // console.log('balanceOf outputs:', balance.toNumber());
        var json = {
            'wallet': address,
            'balance': balance.toNumber()
        }
        resp.send(json);
    } catch (e) {
        console.log(e);
        resp.status(500).send({ 'error' : { 'msg': e.message } });
    }
}

async function registerIpfs(resp, ipfsId, senderAddress) {
    console.log(`invoking sellTo with ipfsId:[${ipfsId}] senderAddress:[${senderAddress}]`);
    try {
        var encodedData = abi.rawEncode(["string"], [ipfsId]);
        console.log('encodedIpfsId:'+encodedData.toString('hex'));
        const tx = await contract.send(
            'sell_to(string)', 
            [encodedData.toString('hex')],
            {
                "senderAddress": senderAddress
            }
        );
        console.log('sellTo tx:', tx);
        resp.send(tx);
    } catch (e) {
        console.log(e);
        resp.status(500).send({ 'error' : { 'msg': e.message } });
    }
}

// var addr = 'aeb08a851d651a88059aeb6c250f1a615abb9930'; //original: qZV4DhZAEmT95n57DZdn7A39jGGKu5wou2
// var addr = '877feaaf2658f2faa90dc14528674c7e8331b980';

var addr = '43b39311a957ced773bd5373d9c58338c53c48f5'; //original: qPjMYwN7QnjC1mdJYfSJKrZiqXfRC4Ne61 (vscode wallet)

app.get('/balance/:address', function (req, res) {
    var addr = req.params.address
    balanceOf(res, addr)
  })

app.post('/register/:ipfsId', function (req, res) {
    var ipfsId = req.params.ipfsId
    var senderAddress = req.get('SENDER-ADDRESS')
    registerIpfs(res, ipfsId, senderAddress)
  })
  
app.listen(6000)