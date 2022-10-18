// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

interface IDns {
    struct EthDomain {
        string domainName;
        address contractAddress;
    }

    struct Bid {
        string name;
        address bidder;
        bool revealed;
        uint revealedBid;
    }

    struct Auction {
        uint biddingEnd;
        uint revealEnd;
        string name;
        uint auctionId;
        uint highestBid;
        address highestBidder;
    }

    function getDomains(address ownerAddress)
        external
        view
        returns (EthDomain[] memory);

    function getBiddings(address user) external view returns (Bid[] memory);

}
