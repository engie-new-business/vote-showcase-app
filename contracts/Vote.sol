pragma solidity >=0.6.0 <0.7.0;

contract Vote {
    uint public yes;
    uint public no;

    address private forwarder;
    
    // keccak256("vote(bool)")
    bytes4 constant voteSelector = 0x4b9f5c98;

    
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
        
        (bool success,) = address(this).call(data);
        require(success, "CALL_FAILED");
    }
}
