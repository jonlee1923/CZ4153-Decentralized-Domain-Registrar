const main = async () => {
  const Dns = await hre.ethers.getContractFactory("Dns");
  const dns = await Dns.deploy();

  await dns.deployed();

  console.log("Dns deployed to:", dns.address);
}

const runMain = async() => {
  try{
    await main();
    process.exit(0)
  } catch (error){
    console.log(error);
    process.exit(1);
  }
}

runMain();