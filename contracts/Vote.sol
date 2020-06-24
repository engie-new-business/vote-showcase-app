pragma solidity >=0.6.0 <0.7.0;

contract Vote {
    uint public yes;
    uint public no;

    address private forwarder;
    
    constructor(address _forwarder) public {
        yes = 0;
        no = 0;

	forwarder = _forwarder;
    }
    
    function vote(bool value) public {
        if (value) {
            yes++;
        } else {
            no++;
        }
    }
    
    function relayExecute(address /* signer */, address /* to */, uint256 /* value */, bytes memory data) public {
	require(msg.sender == forwarder, "INVALID_SENDER");
        bool decodedVote = abi.decode(data, (bool));
        vote(decodedVote);
    }
}
