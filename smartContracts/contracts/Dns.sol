// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
// This solidity version has safemath library built in to protect form overflow and underflow bugs
import "hardhat/console.sol";
import "./IDns.sol";
import "./Commit.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Dns is IDns, ReentrancyGuard {
    using Counters for Counters.Counter;

    address public immutable owner;
    string public registryName;

    // Mappings for Domain Names
    // A counter from openzeppelin is used to ensure accurate counting of ids
    // Each domain struct is mapped to the id to allow for easy linking between user addresses and string names, without duplicate structs
    Counters.Counter private nameCount;
    mapping(address => uint[]) addrToDomainId;
    mapping(string => uint) nameToDomainId;
    mapping(uint => EthDomain) domains;

    // Mappings for Auctions and bids
    // Counters from openzeppelin used to ensure accurate counting of ids
    // Mappings are connected via the id of the bid or auction so as to link domain names or user addresses to the bid/auction structs with ease

    Counters.Counter private bidCount;
    Counters.Counter private auctionCount;

    mapping(string => uint) nameToAuctionId;
    mapping(uint => Auction) auctions;

    mapping(string => uint[]) nameToBidId;
    mapping(address => uint[]) myBiddings;
    mapping(uint => Bid) bids;

    //To check if the domain is already registered or not
    modifier notRegistered(string memory name) {
        require(nameToDomainId[name] == 0, "domain name already exists");
        _;
    }

    //Check for existing bids made by a user for a particular domain name
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

    //Check if a auction for a particular domain names already exists and ensures that has not ended
    //Used for the bid function
    modifier auctionExists(string memory _name) {
        require(nameToAuctionId[_name] != 0, "auction does not exist");
        require(
            auctions[nameToAuctionId[_name]].ended == false,
            "auction has ended"
        );
        _;
    }

    // Check if a function is being called before the end of the bidding phase
    modifier onlyBeforeBiddingEnd(string memory name) {
        require(block.timestamp < auctions[nameToAuctionId[name]].biddingEnd);
        _;
    }

    // Check if a function is being called after the end of the bidding phase
    modifier onlyAfterBidding(string memory name) {
        require(block.timestamp >= auctions[nameToAuctionId[name]].biddingEnd);
        _;
    }

    // Check if a function is being called before the end of the reveal phase
    modifier onlyBeforeRevealEnd(string memory name) {
        require(block.timestamp < auctions[nameToAuctionId[name]].revealEnd);
        _;
    }

    // Check if a function is being called after the reveal phase has ended
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
        //Cache length for gas optimization
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

    // To return the domains owned by a certain user
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

    //Function to return all the existing domains
    function getAllDomains() external view returns (EthDomain[] memory) {
        EthDomain[] memory allDomains = new EthDomain[](nameCount.current());

        uint index = 0;
        uint length = nameCount.current(); //Cache length for gas optimization
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

    // Function to send ETH to a particular domain
    // Carries out appropriate checks to ensure transfer is not done to zero address and that the domain exists
    function sendDomain(string memory _name) external payable {
        require(msg.sender != address(0), "Transfer from the zero address");
        require(nameToDomainId[_name] != 0, "Domain name does not exist");

        EthDomain storage domain = domains[nameToDomainId[_name]];
        domain.balance += msg.value;

        // emit SentToDomain(msg.sender, _name, msg.value);
    }

    //Function to withdraw ETH from a owned domain
    //Uses the nonReentrant modifier from the openzeppelin contract to ensure reentrancy cannot be carried out with this withdraw function
    function withdrawFrmDomain(string memory _name, uint amount)
        external
        nonReentrant
    {
        // Checks are done first to ensure that even if reentrancy is done a attacker cannot continuously withdraw funds from this contract
        require(nameToDomainId[_name] != 0, "Domain name does not exist");
        EthDomain storage domain = domains[nameToDomainId[_name]];
        require(msg.sender == domain.owner, "You do not own these funds");
        require(amount <= domain.balance, "Insufficient funds");
        require(domain.balance > 0);
        domain.balance -= amount;

        payable(domain.owner).transfer(amount);

        // emit WithdrawnFromDomain(msg.sender, _name, amount);
    }

    // Function to register a domain name to a user
    function registerName(
        string memory _name,
        address _owner,
        uint _value
    ) public notRegistered(_name) {
        // increment id count
        nameCount.increment();

        //create new domain name struct
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

    //Function to return all the existing auctions in the dns
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

    //Function to get the address of a particular deployed contract with the create2 function
    function getAddress(bytes memory bytecode, uint _salt)
        public
        view
        returns (address)
    {
        //getting the unique address
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

    //Function that gets the bytecode of a particular contract
    function getBytecode(address _owner, string memory _name)
        public
        pure
        returns (bytes memory)
    {
        bytes memory bytecode = type(Commit).creationCode;

        return abi.encodePacked(bytecode, abi.encode(_owner, _name));
    }

    // Function to start an auction
    // Does appropriate checks to ensure that an auction with the same name does not already exist or owned by a user
    function startAuction(
        string calldata _name,
        uint _bidDuration,
        uint _revealDuration
    ) external notRegistered(_name) {
        require(nameToAuctionId[_name] == 0, "Auction for this already exists");
        require(
            nameToDomainId[_name] == 0,
            "This domain name is already owned"
        );


        //increment id
        auctionCount.increment();
        uint currentCount = auctionCount.current(); //Cache the count value to give a new auction id

        //create a auction struct
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

        // assign to mappings
        nameToAuctionId[_name] = currentCount;
        auctions[currentCount] = newAuction;

        // emit AuctionStarted(_name);
    }

    // Function to end an auction
    // It also carries out refunds to bidders who lost the auction
    function endAuction(string memory _name) public {
        Auction storage auction = auctions[nameToAuctionId[_name]];
        uint[] memory ids = nameToBidId[_name];

        for (uint i = 0; i < ids.length; i++) {
            //skip bid if it has not been revealed
            if (bids[ids[i]].revealed == false) {
                continue;
            } else {

                //if the bidder is not the higest bidder refund the bid
                if (bids[ids[i]].bidder != auction.highestBidder) {
                    payable(bids[ids[i]].bidder).transfer(
                        bids[ids[i]].revealedBid
                    );
                } else { //else register the domain name
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

    // Function to get all existing bids of a user
    function getBiddings(address _user) external view returns (Bid[] memory) {
        uint[] memory ids = myBiddings[_user];
        Bid[] memory myBids = new Bid[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            myBids[i] = bids[ids[i]];
        }

        return myBids;
    }

    //Function to make a bid for a auction
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

    //Private bid function that gives a bid its id
    //And adds the id to the bid mappings as well as the bid struct to the bid mapping
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

    // Function to reveal a bid and checks that the reveal is done after the bidding phase and before the reveal phase ends
    // Uses the secret value input by the user to verify that it is indeed the user who has chosen to reveal his/her bid 
    // This is done with the getAddress function which initialises the commit contract deployed
    // If the correct secret value was input, the domain name will match that of the one being revealed, this is checked by keccak256 hashing the string values 
    function reveal(
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

        // verify the bid by comparing the domain name of the retrieved commit contract and the _name argument
        // valid reveal if they match
        require(bidder == msg.sender, "Failed to verify commit");
        require(
            keccak256(abi.encodePacked(domainName)) ==
                keccak256(abi.encodePacked(_name)),
            "Failed to verify commit"
        );

        // The bids are then updated as revealed and the highest bidder and highest bid amount are updated
        // The value that is locked in the commit address is then returned to the DNS as a locked in value
        for (uint i = 0; i < ids.length; i++) {
            if (bids[ids[i]].bidder == msg.sender) {
                bidToCheck = bids[ids[i]];
                require(
                    bidToCheck.revealed != true,
                    "Bid has already been revealed"
                );
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

    //Function to keep track and update the highest bidder and his/her highest bid amount
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

    //This function is called by chainlink every minute to check what auctions have reached their end time 
    //If so, the auction will be ended by calling the endAuction function which registers the new domainName to the winner and returns funds to the losing bids
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
