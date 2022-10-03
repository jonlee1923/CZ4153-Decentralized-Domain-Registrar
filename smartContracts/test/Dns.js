const { expect } = require("chai");

describe("Token contract", function () {
  it("Owner of dns should be the same as owner address", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Dns");

    const hardhatToken = await Token.deploy();
    console.log("Contract deployed to:", hardhatToken.address);

    expect(await hardhatToken.owner()).to.equal(owner.address);
  });
});
