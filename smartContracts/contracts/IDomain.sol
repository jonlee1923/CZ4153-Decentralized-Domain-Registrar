// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface of iDomain.sol
 */
interface IDomain {

    event Transfer(address indexed from, address indexed to, uint256 value);

    //TransferOwnership
    function transferOwnership(address recipient) external returns (bool);

    //Transfer eth funds back to owner
    function transferEthToOwner() external payable returns (bool);

    //Transfer eth funds to this domain from owner
    function transferEth() external payable;

    //Transfer eth funds to other domains
    function transferEthTo(address recipient, uint amount) external returns (bool);
}
