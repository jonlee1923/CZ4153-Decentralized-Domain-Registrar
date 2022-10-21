// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IDns.sol";
import "./ICommit.sol";
import "./Commit.sol";
import "./Create2.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//it was inheriting erc721 but i removed it
contract Dns is IDns {
    address public owner;
    string public registryName;

    Counters.Counter private nameCount;
    mapping(address => uint[]) public addrToDomainId;
    mapping(string => uint) public nameToDomainId;
    mapping(uint => EthDomain) public domains;

    // //Stores the domain to eth address mapping
    // mapping(string => address) public domainsToEthAddr;

    // //Stores the eth address to domain mapping
    // mapping(address => EthDomain[]) public ethAddrToDomain;

    // mapping(string => EthDomain) public nameToDomain;

    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    using Counters for Counters.Counter;

    Counters.Counter private bidCount;
    Counters.Counter private auctionCount;

    mapping(string => uint) nameToAuctionId;
    mapping(uint => Auction) public auctions;

    mapping(string => uint[]) nameToBidId;
    mapping(address => uint[]) myBiddings;
    mapping(uint => Bid) bids;

    //domain name to auction structs
    // mapping(string => Auction) public auctions;

    // Auction[] public auctionsArray;

    // mapping(string => Bid[]) public biddingsForAuctions;

    // //owner to bids
    // mapping(address => Bid[]) public myBiddings;

    modifier isOwner() {
        require(msg.sender == owner, "User must be owner");
        _;
    }

    //To check if the domain is already registered or not
    modifier notRegistered(string memory name) {
        require(nameToDomainId[name] == 0);
        _;
    }

    // modifier existingBid(string memory _name, address bidder) {
    //     Bid[] memory _bids = myBiddings[bidder];
    //     for (uint i = 0; i < _bids.length; i++) {
    //         require(
    //             keccak256(abi.encodePacked(_bids[i].name)) !=
    //                 keccak256(abi.encodePacked(_name)),
    //             "Bid already exists"
    //         );
    //     }
    //     _;
    // }

    // constructor() ERC721("NTU domain registrar", "NTU") {
    constructor() {
        registryName = "NTU domain registrar";
        owner = msg.sender;
        console.log("NTU domain registrar deployed");
    }

    //To check if the domain is already registered or not
    function checkIfAuctionExists(string memory _name)
        external
        view
        returns (bool)
    {
        for (uint i = 1; i <= auctionCount.current(); i++) {
            if (
                keccak256(abi.encodePacked(auctions[i].name)) ==
                keccak256(abi.encodePacked(_name))
            ) {
                return true;
            }
        }
        return false;
    }

    //used to get names
    function getDomains(address ownerAddress)
        external
        view
        override
        returns (EthDomain[] memory)
    {
        uint index = 0;
        EthDomain[] memory names = new EthDomain[](
            addrToDomainId[ownerAddress].length
        );

        for (uint i = 0; i < addrToDomainId[ownerAddress].length; i++) {
            names[index] = domains[addrToDomainId[ownerAddress][i]];
        }

        return names;
    }

    //Resolve someones eth address along with a particular domain name
    // function resolveAddress(address ownerAddress, string memory name)
    //     public
    //     view
    //     returns (address)
    // {
    //     for (uint i = 0; i < ethAddrToDomain[ownerAddress].length; i++) {
    //         string memory _name = ethAddrToDomain[ownerAddress][i].domainName;

    //         if (
    //             (keccak256(abi.encodePacked(_name)) ==
    //                 keccak256(abi.encodePacked(name)))
    //         ) {
    //             return ethAddrToDomain[ownerAddress][i].owner;
    //         }
    //     }

    //     return address(0);
    // }

    function sendDomain(string memory _name) external payable {
        require(msg.sender != address(0), "Transfer from the zero address");
        require(nameToDomainId[_name] != 0, "Domain name does not exist");

        EthDomain storage domain = domains[nameToDomainId[_name]];
        domain.balance += msg.value;

        emit SentToDomain(msg.sender, _name, msg.value);
    }

    function withdrawFrmDomain(string memory _name, uint amount) external {
        require(nameToDomainId[_name] != 0, "Domain name does not exist");

        EthDomain storage domain = domains[nameToDomainId[_name]];
        require(msg.sender == domain.owner, "You do not own these funds");
        require(amount <= domain.balance, "Insufficient funds");
        domain.balance -= amount;

        emit WithdrawnFromDomain(msg.sender, _name, amount);
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

        // nameToDomain[_name] = newEthDomain;
        // domainsToEthAddr[_name] = _owner;
        // ethAddrToDomain[_owner].push(newEthDomain);

        addrToDomainId[_owner].push(nameCount.current());
        nameToDomainId[_name] = nameCount.current();
        domains[nameCount.current()] = newEthDomain;
        emit DomainRegistered(nameCount.current(), _name, _owner);
    }

    function getAuctions() external view returns (Auction[] memory) {
        Auction[] memory allAuctions = new Auction[](auctionCount.current());
        uint index = 0;
        for (uint i = 1; i <= auctionCount.current(); i++) {
            allAuctions[index] = auctions[i];
            index += 1;
        }
        return allAuctions;
    }

    // function getBidding(string memory _name, address user)
    //     public
    //     view
    //     returns (Bid memory)
    // {
    //     Bid[] memory bids = biddingsForAuctions[_name];

    //     for (uint i = 0; i < bids.length; i++) {
    //         if (bids[i].bidder == user) {
    //             return bids[i];
    //         }
    //     }

    //     revert("Not found");
    // }

    function getBiddings(address _user)
        external
        view
        override
        returns (Bid[] memory)
    {
        uint[] memory ids = myBiddings[_user];
        Bid[] memory myBids = new Bid[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            myBids[i] = bids[ids[i]];
        }

        return myBids;
        // return myBiddings[_user];
    }

    function startAuction(
        string calldata _name,
        uint _bidDuration,
        uint _revealDuration
    ) external {
        require(
            // auctions[_name].auctionId == 0,
            nameToAuctionId[_name] == 0,
            "Auction for this already exists"
        );
        require(
            nameToDomainId[_name] == 0,
            "This domain name is already owned"
        );

        auctionCount.increment();

        Auction memory newAuction = Auction({
            biddingEnd: block.timestamp + _bidDuration,
            revealEnd: block.timestamp + _bidDuration + _revealDuration,
            name: _name,
            auctionId: auctionCount.current(),
            highestBid: 0,
            highestBidder: address(0),
            start: block.timestamp,
            end: block.timestamp + _bidDuration + _revealDuration
        });

        nameToAuctionId[_name] = auctionCount.current();
        console.log(auctionCount.current());
        auctions[auctionCount.current()] = newAuction;

        // auctions[_name] = newAuction;

        // auctionsArray.push(newAuction);

        emit AuctionStarted(_name);
    }

    function endAuction(string memory _name) external {
        // Auction memory auction = auctions[_name];
        // Bid[] memory bids = biddingsForAuctions[_name];

        // for (uint i = 0; i < bids.length; i++) {
        //     if (bids[i].revealed == false) {
        //         continue;
        //     } else {
        //         if (bids[i].bidder != auction.highestBidder) {
        //             payable(bids[i].bidder).transfer(bids[i].revealedBid);
        //         } else {
        //             registerName(_name, bids[i].bidder);
        //             emit AuctionEnded(_name, bids[i].bidder);
        //         }
        //     }
        // }

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
                    emit AuctionEnded(_name, bids[ids[i]].bidder);
                }
            }
        }
    }

    modifier onlyBeforeBidding(string memory name) {
        require(block.timestamp < auctions[nameToAuctionId[name]].biddingEnd);
        _;
    }

    modifier onlyBeforeReveal(string memory name) {
        require(block.timestamp < auctions[nameToAuctionId[name]].revealEnd);
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
    ) public payable {
        // require(auctions[_name].start != 0, "auction does not exist");
        require(nameToAuctionId[_name] != 0, "auction does not exist");

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
        // require(auctions[_name].start != 0, "auction does not exist");
        require(nameToAuctionId[_name] != 0, "auction does not exist");

        uint startTime = auctions[nameToAuctionId[_name]].start;
        uint endTime = auctions[nameToAuctionId[_name]].end;
        bidCount.increment();

        bids[bidCount.current()] = Bid({
            name: _name,
            bidder: user,
            revealed: false,
            revealedBid: 0,
            start: startTime,
            end: endTime
        });

        nameToBidId[_name].push(bidCount.current());
        myBiddings[user].push(bidCount.current());

        // myBiddings[user].push(
        //     Bid({
        //         name: _name,
        //         bidder: user,
        //         revealed: false,
        //         revealedBid: 0,
        //         start: startTime,
        //         end: endTime
        //     })
        // );
        // biddingsForAuctions[_name].push(
        //     Bid({
        //         name: _name,
        //         bidder: user,
        //         revealed: false,
        //         revealedBid: 0,
        //         start: startTime,
        //         end: endTime
        //     })
        // );
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
        // Bid[] storage bids = biddingsForAuctions[_name];
        Bid storage bidToCheck;

        uint[] memory ids = nameToBidId[_name];

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

        for (uint i = 0; i < ids.length; i++) {
            if (bids[ids[i]].bidder == msg.sender) {
                bidToCheck = bids[ids[i]];
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
                break;
            }
        }

        // for (uint i = 0; i < bids.length; i++) {
        //     if (bids[i].bidder == msg.sender) {
        //         bidToCheck = bids[i];
        //         bidToCheck.revealed = true;

        //         bidToCheck.revealedBid = balance;
        //         test.withdraw();
        //         refreshHighestBid(_name, msg.sender, bidToCheck.revealedBid);

        //         emit BidRevealed(
        //             bidder,
        //             domainName,
        //             bidToCheck.revealedBid,
        //             bidToCheck.revealed
        //         );
        //         break;
        //     }
        // }

        //
        //test this
        //

        // Bid[] storage usersBids = myBiddings[msg.sender];
        // // Bid storage bidToUpdate;

        // for (uint i = 0; i < usersBids.length; i++) {
        //     if (
        //         keccak256(abi.encodePacked(usersBids[i].name)) ==
        //         keccak256(abi.encodePacked(_name))
        //     ) {
        //         usersBids[i].revealed = true;
        //         usersBids[i].revealedBid = balance;
        //         break;
        //     }
        // }
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
        // if (_value <= auctions[_name].highestBid) {
        //     return false;
        // } else {
        //     auctions[_name].highestBid = _value;
        //     auctions[_name].highestBidder = bidder;
        //     return true;
        // }
        Auction storage auction = auctions[nameToAuctionId[_name]];

        if (_value <= auction.highestBid) {
            return false;
        } else {
            auction.highestBid = _value;
            auction.highestBidder = bidder;
            return true;
        }
    }

    event AuctionEnded(string name, address winner);
    event BidMade(address bidder, string name);
    event BidRevealed(address bidder, string name, uint value, bool revealed);
    event AuctionStarted(string name);
    event DomainRegistered(uint id, string indexed name, address indexed owner);
    event SentToDomain(address sender, string receiver, uint amount);
    event WithdrawnFromDomain(address withdrawer, string name, uint amount);
}
