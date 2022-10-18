const { expect } = require("chai");

describe("ENS", function () {
    let owner;
    let acct1;
    let acct2;
    let Ens;
    let ens;
    let Auction;
    let auction;

    beforeEach(async function () {
        [owner, acct1, acct2] = await ethers.getSigners();

        Ens = await ethers.getContractFactory("Dns");
        ens = await Ens.deploy();
        Auction = await ethers.getContractFactory("Auction");

        console.log("Contract deployed to:", ens.address);
    });

    describe("Deployment", function () {
        it("Owner of ens should be the same as owner address", async function () {
            expect(await ens.owner()).to.equal(owner.address);
        });
    });

    describe("Testing", function () {
        it("testing tester contract", async function () {
            const Factory = await ethers.getContractFactory("FactoryAssembly");
            const factory = await Factory.deploy();
            const bytecode = await factory
                .connect(acct1)
                .getBytecode(acct1.address, "jon");

            await factory.connect(acct1).deploy(bytecode, 123456, {
                value: ethers.utils.parseEther("2"),
            });

            await factory.connect(acct1).check(bytecode, 123456);
        });
    });

    describe("Starting an auction", function () {
        it("Check the name and address for the domain being auctioned", async function () {
            //Start auction
            await expect(ens.connect(acct1).startAuction("jon", 180, 180))
                .to.emit(ens, "AuctionStarted")
                .withArgs("jon");
            const auctions = await ens.connect(acct1).getAuctions();
            console.log("Auctions returned: ", auctions);

            //Start bid
            console.log("Starting a bid");
            const bytecode = await ens
                .connect(acct1)
                .getBytecode(acct1.address, "jon");

            console.log(ethers.utils.formatEther(await acct1.getBalance()));

            await ens.connect(acct1).bid(bytecode, 123456, "jon", {
                value: ethers.utils.parseEther("2"),
            });

            console.log("commit contract deployed");

            //Verify contract
            await expect(ens.connect(acct1).check(bytecode, 123456, "jon"))
                .to.emit(ens, "BidRevealed")
                .withArgs(
                    acct1.address,
                    "jon",
                    ethers.utils.parseEther("2"),
                    true
                );

            console.log(ethers.utils.formatEther(await acct1.getBalance()));
            console.log(ethers.utils.formatEther(await ens.connect(acct1).getBalance()));
            // await expect(ens.connect(acct1).reveal(bytecode, "jon", 123456))
            //     .to.emit(ens, "BidRevealed")
            //     .withArgs(acct1.address, "jon", 2, true);

            // console.log("Checking bids");
            // const bids = await ens.connect(acct1).getBiddings(acct1.address);
            // console.log("Bids made by acct1: ", bids);
        });
    });

    describe("Registering domain", function () {
        it("domain should be owned by the registered owner", async function () {
            await expect(ens.connect(acct1).registerName("jon", acct1.address))
                .to.emit(ens, "DomainRegistered")
                .withArgs("jon", acct1.address);

            expect(await ens.domainsToEthAddr("jon")).to.equal(acct1.address);
        });
    });
});
