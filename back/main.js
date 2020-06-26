let express = require('express');
let request = require('request-promise');
let bodyParser = require('body-parser');
let cors = require('cors')
let Web3 = require('web3')

const network = 'ropsten'
const apikey = process.env.APIKEY
const rocksideURL = process.env.APIURL || 'https://api.rockside.io'

const forwarderAddress = process.env.FORWARDER_CONTRACT || '0xB87178115C7fd4C5B8b38Adf50e372CdC3b3db4D';
const contractAddress = process.env.VOTE_CONTRACT || '0x45fdd93c3d3b3a1c7ce5000ab5ba1a3073225b91'

async function setup(req,res) {
  res.json({
    voteContract: contractAddress,
  })
}

async function voteParams(req, res) {
  const requestBody = {
    account: req.body.account,
    channel_id: '0',
  };

  const response = await request({
    uri: `${rocksideURL}/ethereum/${network}/forwarders/${forwarderAddress}/relayParams?apikey=${apikey}`,
    method: 'POST',
    body: requestBody,
    json: true,
  })

  res.json({
    nonce: response.nonce,
  })
}

async function getRocksideTx(req, res) {
  const response = await request({
    uri: `${rocksideURL}/ethereum/${network}/transactions/${req.params.trackingId}?apikey=${apikey}`,
    method: 'GET',
    json: true,
  })

  res.json(response)
}

async function fetchGasPrice(signer) {
  const requestBody = {
    account: signer,
    channel_id: '0',
  };

  const response = await request({
    uri: `${rocksideURL}/ethereum/${network}/forwarders/${forwarderAddress}/relayParams?apikey=${apikey}`,
    method: 'POST',
    body: requestBody,
    json: true,
  })

  return response.gas_prices;
}

async function vote(req, res) {
  const body = req.body;

  const gasPrice = await fetchGasPrice(body.signer);

  const requestBody = {
    destination_contract: contractAddress,
    data: {
      signer: body.signer,
      to: body.to,
      data: body.data,
      nonce: body.nonce,
    },
    signature: body.signature,
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
app.post('/voteParams', wrap(voteParams))
app.get('/tx/:trackingId', wrap(getRocksideTx))
app.post('/vote', wrap(vote))

app.set('trust proxy', true);
app.use(function(err, req, res, next) {
  res.status(500).json({ error: err.message })
});
app.listen(process.env.PORT);
