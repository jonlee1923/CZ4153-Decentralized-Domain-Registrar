// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "./IDns.sol";
import "./Commit.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Dns is IDns, ReentrancyGuard {
    using Counters for Counters.Counter;

    address public immutable owner;
    string public registryName;

    Counters.Counter private nameCount;
    mapping(address => uint[]) addrToDomainId;
    mapping(string => uint) nameToDomainId;
    mapping(uint => EthDomain) domains;

    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////

    Counters.Counter private bidCount;
    Counters.Counter private auctionCount;

    mapping(string => uint) nameToAuctionId;
    mapping(uint => Auction) auctions;

    mapping(string => uint[]) nameToBidId;
    mapping(address => uint[]) myBiddings;
    mapping(uint => Bid) bids;

    modifier isOwner() {
        require(msg.sender == owner, "User must be owner");
        _;
    }

    //To check if the domain is already registered or not
    modifier notRegistered(string memory name) {
        require(nameToDomainId[name] == 0, "domain name already exists");
        _;
    }

    modifier existingBid(string memory _name, address bidder) {
        for (uint i = 0; i < myBiddings[bidder].length; i++) {
            require(
                keccak256(abi.encodePacked(bids[myBiddings[bidder][i]].name)) !=
                    keccak256(abi.encodePacked(_name)),
                "Bid already exists"
            );
        }
        _;
    }

    modifier auctionExists(string memory _name) {
        require(nameToAuctionId[_name] != 0, "auction does not exist");
        _;
    }

    modifier onlyBeforeBiddingEnd(string memory name) {
        require(block.timestamp < auctions[nameToAuctionId[name]].biddingEnd);
        _;
    }

    modifier onlyAfterBidding(string memory name) {
        require(block.timestamp >= auctions[nameToAuctionId[name]].biddingEnd);
        _;
    }

    modifier onlyBeforeRevealEnd(string memory name) {
        require(block.timestamp < auctions[nameToAuctionId[name]].revealEnd);
        _;
    }

    modifier onlyAfterReveal(string memory name) {
        require(block.timestamp >= auctions[nameToAuctionId[name]].revealEnd);
        _;
    }

    constructor() {
        registryName = "NTU domain registrar";
        owner = msg.sender;
        console.log("NTU domain registrar deployed");
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    //To check if the domain is already registered or not
    function checkIfAuctionExists(string memory _name)
        external
        view
        returns (bool)
    {
        uint length = auctionCount.current();

        for (uint i = 1; i <= length; i++) {
            if (
                keccak256(abi.encodePacked(auctions[i].name)) ==
                keccak256(abi.encodePacked(_name))
            ) {
                return true;
            }
        }
        return false;
    }

    function getMyDomains(address _user)
        external
        view
        returns (EthDomain[] memory)
    {
        uint[] memory ids = addrToDomainId[_user];
        EthDomain[] memory myDomains = new EthDomain[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            myDomains[i] = domains[ids[i]];
        }

        return myDomains;
    }

    function getAllDomains() external view returns (EthDomain[] memory) {
        EthDomain[] memory allDomains = new EthDomain[](nameCount.current());

        uint index = 0;
        uint length = nameCount.current();
        for (uint i = 1; i <= length; i++) {
            allDomains[index] = domains[i];
            index++;
        }
        return allDomains;
    }

    //Resolve someones eth address along with a particular domain name
    function resolveDomainName(string memory _name)
        public
        view
        returns (address)
    {
        return domains[nameToDomainId[_name]].owner;
    }

    function sendDomain(string memory _name) external payable {
        require(msg.sender != address(0), "Transfer from the zero address");
        require(nameToDomainId[_name] != 0, "Domain name does not exist");

        EthDomain storage domain = domains[nameToDomainId[_name]];
        domain.balance += msg.value;

        // emit SentToDomain(msg.sender, _name, msg.value);
    }

    function withdrawFrmDomain(string memory _name, uint amount)
        external
        nonReentrant
    {
        require(nameToDomainId[_name] != 0, "Domain name does not exist");

        EthDomain storage domain = domains[nameToDomainId[_name]];
        require(msg.sender == domain.owner, "You do not own these funds");
        require(amount <= domain.balance, "Insufficient funds");
        require(domain.balance > 0);
        domain.balance -= amount;

        payable(domain.owner).transfer(amount);

        // emit WithdrawnFromDomain(msg.sender, _name, amount);
    }

    function registerName(
        string memory _name,
        address _owner,
        uint _value
    ) public notRegistered(_name) {
        nameCount.increment();
        EthDomain memory newEthDomain = EthDomain({
            domainName: _name,
            owner: _owner,
            balance: 0,
            value: _value
        });

        //cache value to save gas
        uint currentCount = nameCount.current();

        addrToDomainId[_owner].push(currentCount);
        nameToDomainId[_name] = currentCount;
        domains[currentCount] = newEthDomain;
        emit DomainRegistered(currentCount, _name, _owner);
    }

    function getAuctions() external view returns (Auction[] memory) {
        uint currentCount = auctionCount.current();

        Auction[] memory allAuctions = new Auction[](currentCount);
        uint index = 0;
        for (uint i = 1; i <= currentCount; i++) {
            allAuctions[index] = auctions[i];
            index += 1;
        }
        return allAuctions;
    }

    function getAddress(bytes memory bytecode, uint _salt)
        public
        view
        returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                _salt,
                keccak256(bytecode)
            )
        );

        return address(uint160(uint(hash)));
    }

    function getBytecode(address _owner, string memory _name)
        public
        pure
        returns (bytes memory)
    {
        bytes memory bytecode = type(Commit).creationCode;

        return abi.encodePacked(bytecode, abi.encode(_owner, _name));
    }

    function startAuction(
        string calldata _name,
        uint _bidDuration,
        uint _revealDuration
    ) external {
        require(
            nameToAuctionId[_name] == 0,
            "Auction for this already exists"
        );
        require(
            nameToDomainId[_name] == 0,
            "This domain name is already owned"
        );

        auctionCount.increment();
        uint currentCount = auctionCount.current();

        Auction memory newAuction = Auction({
            biddingEnd: block.timestamp + _bidDuration,
            revealEnd: block.timestamp + _bidDuration + _revealDuration,
            name: _name,
            auctionId: currentCount,
            highestBid: 0,
            highestBidder: address(0),
            start: block.timestamp,
            ended: false
        });

        nameToAuctionId[_name] = currentCount;
        console.log(currentCount);
        auctions[currentCount] = newAuction;

        emit AuctionStarted(_name);
    }

    function endAuction(string memory _name) public {
        Auction storage auction = auctions[nameToAuctionId[_name]];
        uint[] memory ids = nameToBidId[_name];

        for (uint i = 0; i < ids.length; i++) {
            if (bids[ids[i]].revealed == false) {
                continue;
            } else {
                if (bids[ids[i]].bidder != auction.highestBidder) {
                    payable(bids[ids[i]].bidder).transfer(
                        bids[ids[i]].revealedBid
                    );
                } else {
                    registerName(
                        _name,
                        bids[ids[i]].bidder,
                        bids[ids[i]].revealedBid
                    );
                    // emit AuctionEnded(_name, bids[ids[i]].bidder);
                }
            }
        }
        auction.ended = true;
    }

    function getBiddings(address _user)
        external
        view
        returns (Bid[] memory)
    {
        uint[] memory ids = myBiddings[_user];
        Bid[] memory myBids = new Bid[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            myBids[i] = bids[ids[i]];
        }

        return myBids;
    }

    function bid(
        bytes memory bytecode,
        uint _salt,
        string memory _name // string memory _name
    )
        public
        payable
        auctionExists(_name)
        existingBid(_name, msg.sender)
        onlyBeforeBiddingEnd(_name)
    {
        address addr;
        assembly {
            addr := create2(
                callvalue(), // wei sent with current call
                // Actual code starts after skipping the first 32 bytes
                add(bytecode, 0x20),
                mload(bytecode), // Load the size of code contained in the first 32 bytes
                _salt // Salt from function arguments
            )

            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        _bid(msg.sender, _name);
        // emit BidMade(msg.sender, _name);
    }

    function _bid(address user, string memory _name) private {
        bidCount.increment();
        uint currentCount = bidCount.current();

        bids[currentCount] = Bid({
            name: _name,
            bidder: user,
            revealed: false,
            revealedBid: 0,
            start: auctions[nameToAuctionId[_name]].start,
            revealStart: auctions[nameToAuctionId[_name]].biddingEnd,
            end: auctions[nameToAuctionId[_name]].revealEnd
        });

        nameToBidId[_name].push(currentCount);
        myBiddings[user].push(currentCount);
    }

    function check(
        bytes memory bytecode,
        uint _salt,
        string memory _name
    ) public onlyAfterBidding(_name) onlyBeforeRevealEnd(_name) {
        Bid storage bidToCheck;

        uint[] memory ids = nameToBidId[_name];

        address addr = getAddress(bytecode, _salt);
        Commit commit = Commit(addr);
        address bidder = commit.bidder();
        string memory domainName = commit.name();
        uint balance = commit.getBalance();

        require(bidder == msg.sender, "Failed to verify commit");
        require(
            keccak256(abi.encodePacked(domainName)) ==
                keccak256(abi.encodePacked(_name)),
            "Failed to verify commit"
        );

        for (uint i = 0; i < ids.length; i++) {
            if (bids[ids[i]].bidder == msg.sender) {
                bidToCheck = bids[ids[i]];
                require(bidToCheck.revealed != true, "Bid has already been revealed");
                bidToCheck.revealed = true;

                bidToCheck.revealedBid = balance;
                commit.withdraw();
                refreshHighestBid(_name, msg.sender, bidToCheck.revealedBid);

                // emit BidRevealed(
                //     bidder,
                //     domainName,
                //     bidToCheck.revealedBid,
                //     bidToCheck.revealed
                // );
                break;
            }
        }
    }

    function refreshHighestBid(
        string memory _name,
        address bidder,
        uint _value
    ) internal returns (bool success) {
        Auction storage auction = auctions[nameToAuctionId[_name]];

        if (_value <= auction.highestBid) {
            return false;
        } else {
            auction.highestBid = _value;
            auction.highestBidder = bidder;
            return true;
        }
    }

    function checkAuctionsToEnd() public {
        require(auctionCount.current() != 0, "No auctions created");

        uint currentCount = auctionCount.current();
        for (uint i = 1; i <= currentCount; i++) {
            if (block.timestamp < auctions[i].revealEnd || auctions[i].ended) {
                continue;
            } else {
            endAuction(auctions[i].name);
            }
        }
    }

    receive() external payable {}
}
