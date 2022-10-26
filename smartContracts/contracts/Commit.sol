// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

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

    function withdraw() external nonReentrant{
        require(msg.sender == dns, "You cannot withdraw from this contract");
        (bool success,) = dns.call{value:address(this).balance}("");

        require(success, "Failed to send Ether back to the owner");
    }
}
