// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// This contract is used to lock bid values placed by bidders
// It also inherists the reentrancyGuard to protect from reentrancy attacks
contract Commit is ReentrancyGuard{
    address public bidder;
    string public name;
    address private dns;

    constructor(address _bidder, string memory _name) payable {
        bidder = _bidder;
        name = _name;
        dns = msg.sender;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // Function to be called by the DNS contract if a user has been able to succesfully reveal his bid
    // It only allows the DNS contract to withdraw funds 
    function withdraw() external nonReentrant{
        require(msg.sender == dns, "You cannot withdraw from this contract");
        (bool success,) = dns.call{value:address(this).balance}("");

        require(success, "Failed to send Ether back to the owner");
    }
}
