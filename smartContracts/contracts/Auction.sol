// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./IAuction.sol";

contract Auction is IAuction {
    struct Bid {
        bytes32 blindedBid;
        uint deposit;
    }

    address payable public dns;
    uint public biddingEnd;
    uint public revealEnd;
    bool public ended;
    string public override name;

    mapping(address => Bid) public bids;

    address public highestBidder;
    uint public highestBid;

    // Allowed withdrawals of previous bids
    mapping(address => uint) pendingReturns;

    event AuctionEnded(address winner, uint highestBid);

    modifier onlyBefore(uint _time) {
        require(block.timestamp < _time);
        _;
    }
    modifier onlyAfter(uint _time) {
        require(block.timestamp > _time);
        _;
    }

    constructor(
        uint _biddingTime,
        uint _revealTime,
        address payable _dns,
        string memory _name
    ) {
        name = _name;
        dns = _dns;
        biddingEnd = block.timestamp + _biddingTime;
        revealEnd = biddingEnd + _revealTime;
    }

    /// Place a blinded bid with `_blindedBid` =
    /// keccak256(abi.encodePacked(value, secret)).
    /// The sent ether is only refunded if the bid is correctly
    /// revealed in the revealing phase. The bid is valid if the
    /// ether sent together with the bid is at least "value"

    function _bid(address user, bytes32 _blindedBid, uint bidAmount)
        private
        onlyBefore(biddingEnd)
    {
        // bids[msg.sender] = Bid({blindedbid: _blindedBid, deposit: msg.value});
        bids[user] = Bid({blindedBid: _blindedBid, deposit: bidAmount});
    }

    function bid(address user, uint rawBid, string memory secret) external payable override {
        bytes32 blindedBid = keccak256(abi.encodePacked(rawBid, secret));
        _bid(user, blindedBid, msg.value);
    }

    /// Reveal your blinded bids. You will get a refund for all
    /// correctly blinded invalid bids and for all bids except for
    /// the totally highest.
    function reveal(address _user, uint _value, bytes32 _secret)
        external
        override
        onlyAfter(biddingEnd)
        onlyBefore(revealEnd)
        returns (bool result)
    {
        uint refund;
        Bid storage bidToCheck = bids[_user];
        if (
            bidToCheck.blindedBid !=
            keccak256(abi.encodePacked(_value, _secret))
        ) {
            // Bid was not actually revealed.
            // Do not refund deposit.
            return false;
        }
        if (bidToCheck.deposit >= _value) {
            if (refreshHighestBid(_user, _value)) {
                refund -= _value;
            }
        }
        // Make it impossible for the sender to re-claim
        // the same deposit.
        bidToCheck.blindedBid = bytes32(0);
        if (refund != 0) {
            (bool sent, ) = _user.call{value: refund}("");
            require(sent, "Failed to send Ether");
        }

        // msg.sender.transfer(refund);
    }

    // This is an "internal" function which means that it
    // can only be called from the contract itself (or from
    // derived contracts).
    function refreshHighestBid(address bidder, uint value)
        internal
        returns (bool success)
    {
        if (value <= highestBid) {
            return false;
        }
        if (highestBidder != address(0)) {
            // Refund the previously highest bidder.
            pendingReturns[highestBidder] += highestBid;
        }
        highestBid = value;
        highestBidder = bidder;
        return true;
    }

    /// End the auction and send the highest bid
    /// to the dns.
    function auctionEnd() public onlyAfter(revealEnd) {
        require(!ended);
        emit AuctionEnded(highestBidder, highestBid);
        ended = true;
        dns.transfer(highestBid);
    }
}
