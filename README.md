# CZ4153-Decentralized-Domain-Registrar

Lumeel is a Web3 Domain Name Registrar that allows the public to bid for .ntu domain names 

![alt text](https://github.com/jonlee1923/CZ4153-Decentralized-Domain-Registrar/blob/main/SS1.png)
![alt text](https://github.com/jonlee1923/CZ4153-Decentralized-Domain-Registrar/blob/main/SS2.png)
![alt text](https://github.com/jonlee1923/CZ4153-Decentralized-Domain-Registrar/blob/main/SS3.png)

## Adding Goerli testnet to metamask
1. Start from step 4 of this blogpost https://blog.cryptostars.is/goerli-g%C3%B6rli-testnet-network-to-metamask-and-receiving-test-ethereum-in-less-than-2-min-de13e6fe5677 
2. Otherwise here is a quick youtube video on how to do it https://www.youtube.com/watch?v=SFl8Cxrxuuk
3. Obtain some goerliEth from these links 
- https://goerli-faucet.pk910.de/
- https://goerlifaucet.com/

### Installation:
1. Run `git clone https://github.com/jonlee1923/CZ4153-Decentralized-Domain-Registrar.git`
2. Run `npm install` in the client folder and smartContracts folder individually
3. In the smartContracts folder also insert your private key from metamask in the hardhat.config.js file in 

module.exports = {
  solidity: {version: "0.8.4", settings: { optimizer: { enabled: true, runs: 200 } }},
  networks: {
    goerli:{
      url: "---------------------------------------------------------------------",
      accounts:['Your private key']
    }
  }
};

4. Change directory to client folder 
5. Run `npm start` to launch frontend

## Functionalities
- Bid for domain names through an auction
- Send Ether to domain names
- Withdraw from domain names
- Search for registered domain names and ongoing auctions


