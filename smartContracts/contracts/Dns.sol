// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Dns {

    address payable public owner;
    constructor() payable {
        owner = payable(msg.sender);
    }

}
