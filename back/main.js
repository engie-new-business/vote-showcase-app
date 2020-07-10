let express = require('express');
let request = require('request-promise');
let bodyParser = require('body-parser');
let cors = require('cors')
let Web3 = require('web3')
const { TypedDataUtils } = require('eth-sig-util');
const { keccak256 } = require('ethereumjs-util');

const network = 'ropsten'
const chainId = 3
const apikey = process.env.APIKEY
const rocksideURL = process.env.APIURL || 'https://api.rockside.io'

const forwarderAddress = process.env.FORWARDER_CONTRACT || '0x79043BeB5C751afD1Ae40dA4399a463cF4D10Ebb';
const contractAddress = process.env.VOTE_CONTRACT || '0x49a1f9ab6095a01107b3ecfd6a3921d99150d5d4';
const relayerEOAAddress = process.env.RELAYER_EOA || '0x30d2589f86d81b4a77d221de799a3d06645b4c70';

async function setup(req,res) {
  res.json({
    voteContract: contractAddress,
  })
}

async function fetchRelayParams(account) {
  const requestBody = { account, channel_id: '0' };

  const response = await request({
    uri: `${rocksideURL}/ethereum/${network}/forwarders/${forwarderAddress}/relayParams?apikey=${apikey}`,
    method: 'POST',
    body: requestBody,
    json: true,
  })

  return response;
}

function hashRelayMessage({ signer, to, data, nonce }) {
  const domain = { verifyingContract: forwarderAddress, chainId };

  const eip712DomainType = [
    { name: 'verifyingContract', type: 'address' },
    { name: 'chainId', type: 'uint256' }
  ];
  const encodedDomain = TypedDataUtils.encodeData(
    'EIP712Domain',
    domain,
    { EIP712Domain: eip712DomainType }
  );
  const hashedDomain = keccak256(encodedDomain);

  const messageTypes = {
    'TxMessage': [
      { name: "signer", type: "address" },
      { name: "to", type: "address" },
      { name: "data", type: "bytes" },
      { name: "nonce", type: "uint256" },
    ]
  };

  const encodedMessage = TypedDataUtils.encodeData(
    'TxMessage',
    {
      signer,
      to, data,
      nonce
    },
    messageTypes,
  );

  const hashedMessage = keccak256(encodedMessage);

  return keccak256(
    Buffer.concat([
      Buffer.from('1901', 'hex'),
      hashedDomain,
      hashedMessage,
    ])
  );
}

async function getRocksideTx(req, res) {
  const response = await request({
    uri: `${rocksideURL}/ethereum/${network}/transactions/${req.params.trackingId}?apikey=${apikey}`,
    method: 'GET',
    json: true,
  })

  res.json(response)
}

async function signRocksideEOA(signer, message) {
  const body = { message };

  const response = await request({
    uri: `${rocksideURL}/ethereum/eoa/${signer}/sign-message?apikey=${apikey}`,
    method: 'POST',
    json: true,
    body,
  })

  return response.signed_message;
}


async function vote(req, res) {
  const body = req.body;

  const to = contractAddress;
  const signer = relayerEOAAddress;
  const { data } = body;
  const { nonce, gas_prices: gasPrice } = await fetchRelayParams(relayerEOAAddress);

  const hash = hashRelayMessage({ signer, to, data, nonce });
  const signature = await signRocksideEOA(signer, '0x' + hash.toString('hex'));

  const requestBody = {
    message: {
      signer,
      to,
      data: body.data,
      nonce 
    },
    signature,
    speed: 'fast',
    gas_price_limit: gasPrice.fast,
  };

  const response = await request({
    method: 'POST',
    uri: `${rocksideURL}/ethereum/${network}/forwarders/${forwarderAddress}?apikey=${apikey}`,
    method: 'POST',
    body: requestBody,
    json: true,
  })


  const trackingId = response.tracking_id;

  res.status(200).json({ trackingId })
}

function wrap(handler) {
  return (req, res, next) => {
    return Promise
      .resolve(handler(req, res))
      .catch(next);
  }
}

let app = express();

app.use(bodyParser.json())
app.use(cors())

app.get('/setup', wrap(setup))
app.get('/tx/:trackingId', wrap(getRocksideTx))
app.post('/vote', wrap(vote))

app.set('trust proxy', true);
app.use(function(err, req, res, next) {
  res.status(500).json({ error: err.message })
});
app.listen(process.env.PORT);
