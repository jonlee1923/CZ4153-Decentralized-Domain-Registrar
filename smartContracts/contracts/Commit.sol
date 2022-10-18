// SPDX-License-Identifier: MIT
import "./ICommit.sol";
pragma solidity ^0.8.4;

contract Commit{
    // string public override name;
    address public  bidder;
    uint public foo;
    constructor(address _bidder, uint x){
        foo = x;
        bidder = _bidder;
    }

    function withdraw()  external{
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether back to the owner");
    }

    function balance() external view returns (uint){
        return address(this).balance;
    }
    

    event withdrawn(address bidder);
}