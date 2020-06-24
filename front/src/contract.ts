import Web3 from 'web3';
import config from '@/config';

export const VoteABI = JSON.parse(`[
	{
		"constant": false,
		"inputs": [
			{
				"name": "value",
				"type": "bool"
			}
		],
		"name": "vote",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "no",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "yes",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]`);

export const ForwarderABI = JSON.parse(`[
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"relayersAddress",
            "type":"address"
         },
         {
            "internalType":"address[]",
            "name":"contracts",
            "type":"address[]"
         }
      ],
      "stateMutability":"nonpayable",
      "type":"constructor"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"relayersAddress",
            "type":"address"
         }
      ],
      "name":"changeRelayersSource",
      "outputs":[

      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         },
         {
            "internalType":"uint128",
            "name":"",
            "type":"uint128"
         }
      ],
      "name":"channels",
      "outputs":[
         {
            "internalType":"uint128",
            "name":"",
            "type":"uint128"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"contract IRelayer",
            "name":"relayerContract",
            "type":"address"
         },
         {
            "internalType":"bytes",
            "name":"signature",
            "type":"bytes"
         },
         {
            "internalType":"address",
            "name":"signer",
            "type":"address"
         },
         {
            "internalType":"address",
            "name":"to",
            "type":"address"
         },
         {
            "internalType":"uint256",
            "name":"value",
            "type":"uint256"
         },
         {
            "internalType":"bytes",
            "name":"data",
            "type":"bytes"
         },
         {
            "internalType":"uint256",
            "name":"gasPriceLimit",
            "type":"uint256"
         },
         {
            "internalType":"uint256",
            "name":"nonce",
            "type":"uint256"
         }
      ],
      "name":"forward",
      "outputs":[

      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"signer",
            "type":"address"
         },
         {
            "internalType":"uint128",
            "name":"channel",
            "type":"uint128"
         }
      ],
      "name":"getNonce",
      "outputs":[
         {
            "internalType":"uint128",
            "name":"",
            "type":"uint128"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"signer",
            "type":"address"
         },
         {
            "internalType":"address",
            "name":"to",
            "type":"address"
         },
         {
            "internalType":"uint256",
            "name":"value",
            "type":"uint256"
         },
         {
            "internalType":"bytes",
            "name":"data",
            "type":"bytes"
         },
         {
            "internalType":"uint256",
            "name":"nonce",
            "type":"uint256"
         }
      ],
      "name":"hashTxMessage",
      "outputs":[
         {
            "internalType":"bytes32",
            "name":"",
            "type":"bytes32"
         }
      ],
      "stateMutability":"pure",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"relayersAddress",
            "type":"address"
         },
         {
            "internalType":"address[]",
            "name":"contracts",
            "type":"address[]"
         }
      ],
      "name":"initialize",
      "outputs":[

      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "inputs":[

      ],
      "name":"initialized",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "name":"owners",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[

      ],
      "name":"relayers",
      "outputs":[
         {
            "internalType":"contract Relayers",
            "name":"",
            "type":"address"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address",
            "name":"",
            "type":"address"
         }
      ],
      "name":"trustedContracts",
      "outputs":[
         {
            "internalType":"bool",
            "name":"",
            "type":"bool"
         }
      ],
      "stateMutability":"view",
      "type":"function"
   },
   {
      "inputs":[
         {
            "internalType":"address[]",
            "name":"contracts",
            "type":"address[]"
         }
      ],
      "name":"updateTrustedContracts",
      "outputs":[

      ],
      "stateMutability":"nonpayable",
      "type":"function"
   },
   {
      "stateMutability":"payable",
      "type":"receive"
   }
]`);
