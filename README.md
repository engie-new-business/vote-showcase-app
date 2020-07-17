# Vote showcase
This demo application shows how to create a DApp that allows gaseless transactions with Metamask thanks to Rockside API.

*The use of Metamask is not a prerequisite, other solutions to sign the meta-tx can be implemented. Do not hesitate to [create issues](https://github.com/rocksideio/vote-showcase-app/issues/new) to request other examples of integrations for your use case.*

### How does it work ?

![Relay overview](./Levote-sequence-diagram.png)

#### Pre-requisites

In order to relay meta transaction for a dApp, we need a Rockside Forwarder. This forwarder will be used by Rockside to forward meta transactions to the dapp contracts. See [the documentation](https://docs.rockside.io) for more information.

#### Dapp contract

The smart contract of this vote application if fairly simple. It manages a counter of "yes" and a counter of "no" votes. When an user wants to vote, he sends true to increment "yes" and false to increment "no".

```solidity
function voteWithSignature(address signer, bool _vote, bytes calldata signature) external {
    bytes32 hash = hashVote(signer, _vote);
    
    require(recoverSigner(hash, signature) == signer, "Signature is not valid");
    
    vote(_vote);
}
```

We implement a `voteWithSignature` function that allows an individual to vote using a signature. Since transactions are sent by the Rockside relayer, the Vote contract need a way to identify a voter without the `msg.sender` variable. We use a EIP-712 signature to validate the identity of a voter.

#### Dapp frontend

The dapp frontend does not know anything about the Rockside relayer. It works as if there was no relayer at all. It allows an user to sign a vote intent (yes or no) using the EIP-712 format. This intent and signature are sent to the dapp backend

#### Dapp backend

The dapp backend exposes a few routes :

- `/setup`: This route sends all required information for the front to work. Basically, the vote contract address to interact with it (get yes/no votes count, prepare a meta transaction)
- `/tx/:trackingId`: This route allows the frontend to follow the status of a transaction using a Rockside tracking_id. It can be used to retrieve the final transaction receipt.  It uses [transaction tracking](https://docs.rockside.io/rockside-api#get-transaction-infos) Rockside API.
- `/vote`: This route wraps a vote intent into a Rockside meta transaction. It first retrieves a valid nonce and gas price (using the [relay params]() Rockside API) then signs the meta transaction with an administration EOA (configurable via the RELAYER_EOA environment variable) signs these meta transactions. It returns a Rockside tracking_id that can be used to follow the transaction (which could be replayed, so the transaction hash could change). It uses [transaction relay](https://docs.rockside.io/rockside-api#relay-a-transaction) Rockside API. Furthermore, to simplify the code, meta transactions sent to Rockside are signed using an EOA stored by Rockside. __This is not required and this EOA can be stored anywhere.__
