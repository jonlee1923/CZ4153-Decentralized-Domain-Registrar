// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface IAuction {
    function name() external view returns(string memory domainName);

    function bid(address user, uint rawBid, string memory secret) external payable;

    function reveal(address user, uint _value, bytes32 _secret) external returns (bool result);
}
