// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

interface IDns {
    struct EthDomain {
        // uint id;
        string domainName;
        address owner;
        uint balance;
        uint value;
    }

    struct Bid {
        string name;
        address bidder;
        bool revealed;
        uint revealedBid;
        uint start;
        uint revealStart;
        uint end;
    }

    struct Auction {
        uint biddingEnd;
        uint revealEnd;
        string name;
        uint auctionId;
        uint highestBid;
        address highestBidder;
        uint start;
        // uint end;
        bool ended;
    }

    function getMyDomains(address ownerAddress)
        external
        view
        returns (EthDomain[] memory);

    function getBiddings(address user) external view returns (Bid[] memory);

    event AuctionEnded(string name, address winner);
    event BidMade(address bidder, string name);
    event BidRevealed(address bidder, string name, uint value, bool revealed);
    event AuctionStarted(string name);
    event DomainRegistered(uint id, string indexed name, address indexed owner);
    event SentToDomain(address sender, string receiver, uint amount);
    event WithdrawnFromDomain(address withdrawer, string name, uint amount);
}
