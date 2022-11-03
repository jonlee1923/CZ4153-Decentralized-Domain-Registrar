require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {version: "0.8.4", settings: { optimizer: { enabled: true, runs: 200 } }},
  networks: {
    goerli:{
      url: "https://eth-goerli.g.alchemy.com/v2/vinPz4TyViMcgfk8bnCHZEL7UEOpZsvm",
      accounts:['']
    }
  }
};

