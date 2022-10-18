// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./IDomain.sol";

contract Domain is IDomain {
    address payable public owner;
    string domainName;

    constructor(string memory _domainName, address _owner) {
        owner = payable(_owner);
        domainName = _domainName;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Invalid owner");
        _;
    }

    modifier amountAvailable(uint amount) {
        require(amount <= address(this).balance, "Invalid amount available");
        _;
    }

    modifier validAddress(address _to) {
        require(_to != address(0), "Invalid address");
        _;
    }

    //Check amount of eth in contract
    function getBalance() public view returns (uint _balance) {
        _balance = address(this).balance;
    }

    function transferOwnership(address recipient)
        external
        override
        isOwner
        returns (bool)
    {
        owner = payable(recipient);
        return true;
    }

    function transferEthToOwner()
        external
        payable
        override
        isOwner
        returns (bool)
    {
        // Call returns a boolean value indicating success or failure.
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether back to the owner");
        return sent;
    }

    function transferEth() external payable override isOwner {}

    function transferEthTo(address recipient, uint amount)
        external
        override
        isOwner
        amountAvailable(amount)
        validAddress(recipient)
        returns (bool)
    {
        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "Failed to send Ether back to the owner");
        return sent;
    }

    //FALLBACK FUNCTIONS
    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
