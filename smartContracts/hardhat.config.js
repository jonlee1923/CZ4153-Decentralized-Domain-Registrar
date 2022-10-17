require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

// module.exports = {
//   solidity: "0.8.4",
//   networks: {
//     goerli:{
//       url: "https://eth-goerli.g.alchemy.com/v2/vinPz4TyViMcgfk8bnCHZEL7UEOpZsvm",
//       accounts:['fcde2f83061645a218fc5f883d4df43a7a7e40c1d4bdd22fe366e384797670e9']
//     }
//   }
// };

module.exports = {
  solidity: {version: "0.8.4", settings: { optimizer: { enabled: true, runs: 200 } }},
  networks: {
    goerli:{
      url: "https://eth-goerli.g.alchemy.com/v2/vinPz4TyViMcgfk8bnCHZEL7UEOpZsvm",
      accounts:['fcde2f83061645a218fc5f883d4df43a7a7e40c1d4bdd22fe366e384797670e9']
    }
  }
};

