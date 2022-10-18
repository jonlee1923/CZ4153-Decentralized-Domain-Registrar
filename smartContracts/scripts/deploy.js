// const main = async () => {
//   const Dns = await hre.ethers.getContractFactory("Dns");
//   const dns = await Dns.deploy();

//   await dns.deployed();

//   console.log("Dns deployed to:", dns.address);
// }

// const runMain = async() => {
//   try{
//     await main();
//     process.exit(0)
//   } catch (error){
//     console.log(error);
//     process.exit(1);
//   }
// }

// runMain();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  // Get the ContractFactories and Signers here.
  const DNS = await ethers.getContractFactory("Dns");
  // const Marketplace = await ethers.getContractFactory("Marketplace");
  // deploy contracts
  const dns = await DNS.deploy();

  console.log("Dns deployed at: " + dns.address);


  // Save copies of each contracts abi and address to the frontend.
  saveFrontendFiles(dns , "Dns");
  // saveFrontendFiles(nft , "NFT");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../client/src/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });