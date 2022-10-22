const { expect } = require("chai");
describe("ENS", function () {
    let owner;
    let acct1;
    let acct2;
    let Ens;
    let ens;


    beforeEach(async function () {
        [owner, acct1, acct2] = await ethers.getSigners();

        Ens = await ethers.getContractFactory("Dns");
        ens = await Ens.deploy();

        console.log("Contract deployed to:", ens.address);
    });

    describe("Deployment", function () {
        it("Owner of ens should be the same as owner address", async function () {
            expect(await ens.owner()).to.equal(owner.address);
        });
    });

    // describe("Testing", function () {
    //     it("testing tester contract", async function () {
    //         const Factory = await ethers.getContractFactory("FactoryAssembly");
    //         const factory = await Factory.deploy();
    //         const bytecode = await factory
    //             .connect(acct1)
    //             .getBytecode(acct1.address, "jon");

    //         await factory.connect(acct1).deploy(bytecode, 123456, {
    //             value: ethers.utils.parseEther("2"),
    //         });

    //         await factory.connect(acct1).check(bytecode, 123456);
    //     });
    // });

    describe("Starting an auction", function () {
        it("Check the name and address for the domain being auctioned", async function () {
            //Start auction
            // await expect(ens.connect(acct1).startAuction("jon", 180, 180))
            //     .to.emit(ens, "AuctionStarted")
            //     .withArgs("jon");
            let transaction = await ens.connect(acct1).startAuction("jon", 180, 180);
            let tx = await transaction.wait();
            console.log("Transaction events: ", tx.events[0]);

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

            // Verify contract
            // await expect(ens.connect(acct1).check(bytecode, 123456, "jon"))
            //     .to.emit(ens, "BidRevealed")
            //     .withArgs(
            //         acct1.address,
            //         "jon",
            //         ethers.utils.parseEther("2"),
            //         true
            //     );
            transaction = await ens.connect(acct1).check(bytecode, 123456, "jon");
            tx = await transaction.wait();
            console.log("Transaction events: ", tx.events);

            console.log(ethers.utils.formatEther(await acct1.getBalance()));
            console.log(ethers.utils.formatEther(await ens.connect(acct1).getBalance()));
            
            console.log("testing auction ended");
            await ens.connect(acct1).endAuction("jon");
            // expect(await ens.nameToDomainId("jon")).to.equal(1);
            // expect(await ens.addrToDomainId("jon")).to.equal(1);
            console.log(await ens.nameToDomainId("jon"));
            console.log(await ens.domains[1]);
            console.log("checking my names");
            const myNames = await ens.connect(acct1).getDomains(acct1.address);
            console.log("owned names", myNames);


            transaction = await ens.connect(acct2).sendDomain("jon", {
                value: ethers.utils.parseEther("2"),
            });
            tx = await transaction.wait();
            console.log("Transaction events: ", tx.events);

            transaction = await ens.connect(acct1).withdrawFrmDomain("jon", 1);
            tx = await transaction.wait();
            console.log("Transaction events: ", tx.events);
        });
    });
});
