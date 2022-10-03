// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IDns {
    struct EthDomain {
        string domainName;
        address contractAddress;
    }

    function resolvedomain(string calldata name) external view returns (address);

    function resolveAddr(address name)
        external
        view
        returns (EthDomain[] memory);

    function searchDomain(string calldata name) external view returns (bool);
}
