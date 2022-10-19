// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Domain.sol";
import "./IDns.sol";
import "./ICommit.sol";
import "./Commit.sol";
import "./Create2.sol";

contract Dns is IDns, ERC721 {
    address public owner;

    //Stores the domain to eth address mapping
    mapping(string => address) public domainsToEthAddr;

    //Stores the eth address to domain mapping
    mapping(address => EthDomain[]) public ethAddrToDomain;

    //domain name to auction structs
    mapping(string => Auction) public auctions;
    Auction[] public auctionsArray;

    //auction to bids
    // mapping(uint => Bid[]) public biddingsForAuctions;
    // mapping(string => mapping(address => Bid)) public biddingsForAuctions;
    mapping(string => Bid[]) public biddingsForAuctions;

    //owner to bids
    mapping(address => Bid[]) public myBiddings;

    uint auctionCount = 0;

    modifier isOwner() {
        require(msg.sender == owner, "User must be owner");
        _;
    }

    //To check if the domain is already registered or not
    modifier notRegistered(string memory name) {
        require(domainsToEthAddr[name] == address(0));
        _;
    }

    modifier existingBid(string memory _name, address bidder) {
        Bid[] memory bids = myBiddings[bidder];
        for (uint i = 0; i < bids.length; i++) {
            require(
                keccak256(abi.encodePacked(bids[i].name)) !=
                    keccak256(abi.encodePacked(_name)),
                "Bid already exists"
            );
        }
        _;
    }

    constructor() ERC721("NTU domain registrar", "NTU") {
        owner = msg.sender;
        console.log("NTU domain registrar deployed");
    }

    //Pure function In Solidity, a function that doesn't read or modify the variables
    //of the state is called a pure function. It can only use local variables that are
    //declared in the function and the arguments that are passed to the function to compute
    //or return a value.

    //To check if the domain is already registered or not
    function checkIfAuctionExists(string memory name)
        external
        view
        returns (bool)
    {
        if (domainsToEthAddr[name] == address(0)) {
            return false;
        } else {
            return true;
        }
    }

    function getDomains(address ownerAddress)
        external
        view
        override
        returns (EthDomain[] memory)
    {
        return ethAddrToDomain[ownerAddress];
    }

    //Resolve someones eth address along with a particular domain name
    function resolveAddress(address ownerAddress, string memory name)
        public
        view
        returns (address)
    {
        for (uint i = 0; i < ethAddrToDomain[ownerAddress].length; i++) {
            string memory _name = ethAddrToDomain[ownerAddress][i].domainName;

            if (
                (keccak256(abi.encodePacked(_name)) ==
                    keccak256(abi.encodePacked(name)))
            ) {
                return ethAddrToDomain[ownerAddress][i].contractAddress;
            }
        }

        return address(0);
    }

    function registerName(string memory name, address _owner)
        public
        notRegistered(name)
        returns (address domainEthAddr)
    {
        Domain newEthDomain = new Domain(name, _owner);
        domainEthAddr = address(newEthDomain);
        domainsToEthAddr[name] = _owner;

        //Apparently solidity is smart enough to push the struct into an array even tho the array is empty for a new user
        EthDomain memory newDomStruct = EthDomain(name, domainEthAddr);
        ethAddrToDomain[_owner].push(newDomStruct);
        emit DomainRegistered(name, _owner);
    }

    function getAuctions() external view returns (Auction[] memory) {
        return auctionsArray;
    }

    function getBidding(string memory _name, address user)
        public
        view
        returns (Bid memory)
    {
        Bid[] memory bids = biddingsForAuctions[_name];

        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].bidder == user) {
                return bids[i];
            }
        }

        revert("Not found");
    }

    function getBiddings(address _user)
        external
        view
        override
        returns (Bid[] memory)
    {
        return myBiddings[_user];
    }

    // function getAuctions() external returns (Auction[]){
    //     return auctionsArray
    // }

    function startAuction(
        string calldata _name,
        uint _bidDuration,
        uint _revealDuration
    ) external {
        require(
            auctions[_name].auctionId == 0,
            "Auction for this already exists"
        );
        require(
            domainsToEthAddr[_name] == address(0),
            "This domain name is already owned"
        );

        auctionCount++;

        Auction memory newAuction = Auction({
            biddingEnd: block.timestamp + _bidDuration,
            revealEnd: block.timestamp + _bidDuration + _revealDuration,
            name: _name,
            auctionId: auctionCount,
            highestBid: 0,
            highestBidder: address(0),
            start: block.timestamp,
            end: block.timestamp + _bidDuration + _revealDuration
        });

        auctions[_name] = newAuction;

        auctionsArray.push(newAuction);

        emit AuctionStarted(_name);
    }

    function endAuction(string memory _name) internal {
        Auction memory auction = auctions[_name];
        Bid[] memory bids = biddingsForAuctions[_name];

        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].revealed == false) {
                continue;
            } else {
                if (bids[i].bidder != auction.highestBidder) {
                    payable(bids[i].bidder).transfer(bids[i].revealedBid);
                } else {
                    registerName(_name, bids[i].bidder);
                }
            }
        }
    }

    modifier onlyBeforeBidding(string memory name) {
        require(block.timestamp < auctions[name].biddingEnd);
        _;
    }

    modifier onlyBeforeReveal(string memory name) {
        require(block.timestamp < auctions[name].revealEnd);
        _;
    }

    function getBytecode(address _owner, string memory _name)
        public
        pure
        returns (bytes memory)
    {
        // bytes memory bytecode = type(Commit).creationCode;
        bytes memory bytecode = type(TestContract).creationCode;

        return abi.encodePacked(bytecode, abi.encode(_owner, _name));
    }

    function bid(
        bytes memory bytecode,
        uint _salt,
        string memory _name // string memory _name
    ) public payable notRegistered(_name) {
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
        emit BidMade(msg.sender, _name);
    }

    function _bid(address user, string memory _name) private {
        uint startTime = auctions[_name].start;
        uint endTime = auctions[_name].end;
        myBiddings[user].push(
            Bid({
                name: _name,
                bidder: user,
                revealed: false,
                revealedBid: 0,
                start: startTime,
                end: endTime
            })
        );
        biddingsForAuctions[_name].push(
            Bid({
                name: _name,
                bidder: user,
                revealed: false,
                revealedBid: 0,
                start: startTime,
                end: endTime
            })
        );
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

        // NOTE: cast last 20 bytes of hash to address
        return address(uint160(uint(hash)));
    }

    function check(
        bytes memory bytecode,
        uint salt,
        string memory _name
    ) public {
        Bid[] storage bids = biddingsForAuctions[_name];
        Bid storage bidToCheck;

        address addr = getAddress(bytecode, salt);
        TestContract test = TestContract(addr);
        address bidder = test.bidder();
        string memory domainName = test.name();
        uint balance = test.getBalance();

        require(bidder == msg.sender, "Failed to verify commit");
        require(
            keccak256(abi.encodePacked(domainName)) ==
                keccak256(abi.encodePacked(_name)),
            "Failed to verify commit"
        );

        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].bidder == msg.sender) {
                bidToCheck = bids[i];
                bidToCheck.revealed = true;

                bidToCheck.revealedBid = balance;
                test.withdraw();
                refreshHighestBid(_name, msg.sender, bidToCheck.revealedBid);

                emit BidRevealed(
                    bidder,
                    domainName,
                    bidToCheck.revealedBid,
                    bidToCheck.revealed
                );
            }
        }
    }

    receive() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function refreshHighestBid(
        string memory _name,
        address bidder,
        uint _value
    ) internal returns (bool success) {
        if (_value <= auctions[_name].highestBid) {
            return false;
        } else {
            auctions[_name].highestBid = _value;
            auctions[_name].highestBidder = bidder;
            return true;
        }
        // if (highestBidder != address(0)) {
        //     // Refund the previously highest bidder.
        //     pendingReturns[highestBidder] += highestBid;
        // }
    }

    event AuctionEnded(string name);
    event BidMade(address bidder, string name);
    event BidRevealed(address bidder, string name, uint value, bool revealed);
    event AuctionStarted(string name);
    event DomainRegistered(string indexed name, address indexed owner);
}
