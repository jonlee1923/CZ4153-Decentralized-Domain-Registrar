// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

interface ICommit {
    function withdraw() external;
    function bidder() external returns(address);
    // function name() external returns(string memory);
    function balance() external returns(uint);
}