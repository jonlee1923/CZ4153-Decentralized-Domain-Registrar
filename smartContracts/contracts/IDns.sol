// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

// This contract stores the events and structs of the DNS contract
interface IDns {

    // Domain struct
    // Contains: 
    // - The name of the domain
    // - The owner of the domain
    // - The balance in the domain
    // - The value of the domain it was won at
    struct EthDomain {
        // uint id;
        string domainName;
        address owner;
        uint balance;
        uint value;
    }

    // Bid struct
    // Contains:
    // - The domain the bid is for
    // - The bidder of this bid
    // - The boolean value for whether the bidder has revealed the bid
    // - The value of the bid
    // - Strart time of the auction
    // - The start time of the auction's reveal phase
    // - The end time of the auction
    struct Bid {
        string name;
        address bidder;
        bool revealed;
        uint revealedBid;
        uint start;
        uint revealStart;
        uint end;
    }

    // Auction struct
    // Contains:
    // - The end of the commit/bidding phase
    // - The end of the reveal phase/ end of the auction
    // - The domain name the auction is for
    // - The id for the auction
    // - The highest bid value
    // - The address of the highest bidder
    struct Auction {
        uint start;
        uint biddingEnd;
        uint revealEnd;
        string name;
        uint auctionId;
        uint highestBid;
        address highestBidder;
        // uint end;
        bool ended;
    }

    event AuctionEnded(string name, address winner);
    event BidMade(address bidder, string name);
    event BidRevealed(address bidder, string name, uint value, bool revealed);
    event AuctionStarted(string name);
    event DomainRegistered(uint id, string indexed name, address indexed owner);
    // event SentToDomain(address sender, string receiver, uint amount);
    event WithdrawnFromDomain(address withdrawer, string name, uint amount);
}
