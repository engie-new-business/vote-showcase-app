pragma solidity >=0.6.0 <0.7.0;

contract Vote {
    uint public yes;
    uint public no;

    constructor(address _forwarder) public {
        yes = 0;
        no = 0;

	    // this is used to check the EIP-712 signature of a vote
	    
		uint256 id;
		// solhint-disable-next-line no-inline-assembly
		assembly {
			id := chainid()
		}

		DOMAIN_SEPARATOR = hashEIP712Domain(address(this), id);
	}

	function hashEIP712Domain(address verifyingContract, uint256 chainId) internal pure returns (bytes32) {
		return keccak256(abi.encode(
			EIP712DOMAIN_TYPEHASH,
			verifyingContract,
			chainId
		));
	}
    
    function vote(bool value) public {
        if (value) {
            yes++;
        } else {
            no++;
        }
    }
    
	function voteWithSignature(address signer, bool _vote, bytes calldata signature) external {
	    bytes32 hash = hashVote(signer, _vote);
	    
	    require(recoverSigner(hash, signature) == signer, "Signature is not valid");
	    
	    vote(_vote);
	}
	
	// Signature stuff
	
	/* keccak256("EIP712Domain(address verifyingContract,uint256 chainId)"); */
	bytes32 constant EIP712DOMAIN_TYPEHASH = 0xa1f4e2f207746c24e01c8e10e467322f5fea4cccab3cd2f1c95d700b6a0c218b;
    
    // keccak256("Vote(address signer,uint256 vote)")
    bytes32 constant VOTE_TYPEHASH = 0xceb90ed4bd8cc2ec27f2992ed9b2b90d2d73f1ac615aca8d1a3cc9152aafb7d5;

    bytes32 DOMAIN_SEPARATOR;
    
	function hashVote(address signer, bool _vote) public pure returns (bytes32) {
		return keccak256(abi.encode(
			VOTE_TYPEHASH,
			signer,
			_vote
		));
	}
	
	
	function recoverSigner(bytes32 _hash, bytes memory _signature) internal view returns (address){
		bytes32 r;
		bytes32 s;
		uint8 v;
		// Check the signature length
		if (_signature.length != 65) {
			return 0x0000000000000000000000000000000000000000;
		}
		// Divide the signature in r, s and v variables
		// ecrecover takes the signature parameters, and the only way to get them
		// currently is to use assembly.
		// solium-disable-next-line security/no-inline-assembly
		assembly {
			r := mload(add(_signature, 32))
			s := mload(add(_signature, 64))
			v := byte(0, mload(add(_signature, 96)))
		}
		// Version of signature should be 27 or 28, but 0 and 1 are also possible versions
		if (v < 27) {
			v += 27;
		}
		// If the version is correct return the signer address
		if (v != 27 && v != 28) {
			return 0x0000000000000000000000000000000000000000;
		} else {
			bytes32 digest = keccak256(abi.encodePacked(
				"\x19\x01",
				DOMAIN_SEPARATOR,
				_hash
			));
			// solium-disable-next-line arg-overflow
			return ecrecover(digest, v, r, s);
		}
	}
}
