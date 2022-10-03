// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./Domain.sol";
import "./IDns.sol";

contract Dns is ERC721URIStorage, IDns {
    address payable public owner;

    // struct EthDomain {
    //     string domainName;
    //     address contractAddress;
    // }

    //Stores the domain to eth address mapping
    mapping(string => address) public domainsToEthAddr;

    //Stores the eth address to domain mapping
    mapping(address => EthDomain[]) public ethAddrToDomain;

    modifier isOwner() {
        require(msg.sender == owner, "User must be owner");
        _;
    }

    //To check if the domain is already registered or not
    modifier notRegistered(string calldata name) {
        require(domainsToEthAddr[name] == address(0));
        _;
    }

    constructor() payable ERC721("NTU domain registrar", "NTU") {
        owner = payable(msg.sender);
        console.log("NTU domain registrar deployed");
    }

    //Pure function In Solidity, a function that doesn't read or modify the variables
    //of the state is called a pure function. It can only use local variables that are
    //declared in the function and the arguments that are passed to the function to compute
    //or return a value.

    function searchDomain(string calldata name) external view override returns (bool){
        return domainsToEthAddr[name] == address(0);
    }

    
    function resolvedomain(string calldata name)
        external
        view
        override
        returns (address)
    {
        return domainsToEthAddr[name];
    }

    function resolveAddr(address name)
        external
        view
        override
        returns (EthDomain[] memory)
    {
        return ethAddrToDomain[name];
    }

    function registerName(string calldata name, address _owner)
        public
        notRegistered(name)
    {
        Domain newEthDomain = new Domain(name);
        address domainEthAddr = address(newEthDomain);
        domainsToEthAddr[name] = owner;

        //Apparently solidity is smart enough to push the struct into an array even tho the array is empty for a new user
        EthDomain memory newDomStruct = EthDomain(name, domainEthAddr);
        ethAddrToDomain[_owner].push(newDomStruct);
    }

    
}
