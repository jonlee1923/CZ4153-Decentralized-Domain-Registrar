import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import DnsAbi from "../contractsData/Dns.json";
import DnsAddress from "../contractsData/Dns-address.json";
import std from "../utils/constant.js";
export const DnsContext = React.createContext();

const { ethereum } = window;

// This function is used to instantiate the contract object
const getDnsContract = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts) {
        const signer = provider.getSigner(accounts[0]);

        if (signer) {
            const dnsContract = new ethers.Contract(
                DnsAddress.address,
                DnsAbi.abi,
                signer
            );
            return dnsContract;
        }
    }
};

// This function is used to interact with the smart contract, by providing functions to call functions in the smart contract
export const DnsProvider = ({ children }) => {
    // connected variable to check if a wallet is connected
    const [connected, setCurrentAccount] = useState("");

    //function to check if a wallet is connected and sets the connected variable
    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install Metamask");
            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object");
        }
    };

    // Function to connect the wallet
    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            setCurrentAccount(accounts[0]);
            // window.location.reload();
        } catch (error) {
            // console.log(error);
            throw new Error("No ethereum object");
        }
    };

    //Function to create an auction by calling the smart contract function "startAuction"
    const createAuction = async (name) => {
        try {
            if (!ethereum) return alert("Please install metamask");
            let dnsContract = await getDnsContract();

            // console.log("in createAuction");
            let transaction = await dnsContract.startAuction(name, 180, 180);
            let tx = await transaction.wait();
            // console.log("Transaction events: ", tx.events[0]);
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

    // Function to get the bytecode of the commit contract with a particular set of inputs
    const getBytecode = async (name) => {
        try {
            if (!ethereum) return alert("Please install metamask");
            let dnsContract = await getDnsContract();

            const bytecode = await dnsContract.getBytecode(connected, name);
            return bytecode;
        } catch (err) {
            // console.log(err);
            throw Error(err.message);
        }
    };

    // Function to call the bid function for a user to place a bid
    const bid = async (name, bid, secret) => {
        try {
            if (!ethereum) return alert("Please install metamask");
            let dnsContract = await getDnsContract();

            const bytecode = await dnsContract.getBytecode(connected, name);
            let transaction = await dnsContract.bid(
                bytecode,
                ethers.utils.id(secret),
                name,
                {
                    value: ethers.utils.parseEther(bid),
                }
            );

            let tx = await transaction.wait();
            // console.log("Transaction events: ", tx.events[0]);
        } catch (err) {
            // console.log(err);
            throw Error(err);
        }
    };

    // Function to simultaneously create an auction and place a bid.
    // This function is called when an auction a user tries to start has not been registered before
    // and has no ongoing auction for
    const createAuctionAndBid = async (name, amount, secret) => {
        try {
            if (!ethereum) return alert("Please install metamask");

            await createAuction(name);
            await bid(name, amount, secret);
        } catch (err) {
            // console.log(err);
            throw Error(err.message);
        }
    };

    // This function is used to retrieve the ongoing auctions from the smart contract
    const getAuctions = async () => {
        try {
            if (!ethereum) return alert("Please install metamask");
            let dnsContract = await getDnsContract();
            let auctions = await dnsContract.getAuctions();
            const auctionsMapped = await Promise.all(
                auctions
                    .filter((auction) => !auction.ended)
                    .map(async (i) => {
                        const unixStart = i.start.toNumber();
                        let startDate = new Date(unixStart * 1000);
                        startDate = startDate.toLocaleString();

                        const unixEnd = i.revealEnd.toNumber();
                        let endDate = new Date(unixEnd * 1000);
                        endDate = endDate.toLocaleString();

                        const unixTime = i.biddingEnd.toNumber();
                        let date = new Date(unixTime * 1000);
                        date = date.toLocaleString();

                        let auctionItem = {
                            auctionId: i.auctionId.toNumber(),
                            name: i.name,
                            start: startDate,
                            biddingEnd: date,
                            revealEnd: endDate,
                            ended: i.ended,
                        };
                        return auctionItem;
                    })
            );
            if (!auctionsMapped) {
                return [];
            }
            return auctionsMapped;
        } catch (err) {
            if (err.message === std) {
                return;
            } else {
                throw Error(err.message);
            }
        }
    };

    //Function used to retrieve a users bids that have not been revealed
    const getMyBiddings = async (address) => {
        try {
            if (!ethereum) return alert("Please install metamask");
            let dnsContract = await getDnsContract();
            let data = await dnsContract.getBiddings(address);

            const bidsMapped = await Promise.all(
                // data.filter((bid) => !bid.revealed).map(async (i) => {
                data.map(async (i) => {
                    const unixStart = i.start.toNumber();
                    let startDate = new Date(unixStart * 1000);
                    startDate = startDate.toLocaleString();

                    const unixEnd = i.end.toNumber();
                    let endDate = new Date(unixEnd * 1000);
                    endDate = endDate.toLocaleString();

                    const revealStart = i.revealStart.toNumber();
                    let reveal = new Date(revealStart * 1000);
                    reveal = reveal.toLocaleString();

                    let bidItem = {
                        name: i.name,
                        start: startDate,
                        revealTime: reveal,
                        end: endDate,
                        revealed: i.revealed,
                    };
                    return bidItem;
                })
            );

            if (!bidsMapped) {
                return [];
            }

            return bidsMapped;
        } catch (err) {
            if (err.message === std) {
                return;
            } else {
                throw Error(err.message);
            }
        }
    };

    // Function used by a user to reveal a bid
    const revealBid = async (name, secret) => {
        try {
            if (!ethereum) return alert("Please install metamask");
            let dnsContract = await getDnsContract();
            const bytecode = getBytecode(name);

            const transaction = await dnsContract.reveal(
                bytecode,
                ethers.utils.id(secret), //Hashing is done off chain
                name
            );
            let tx = await transaction.wait();
            // console.log("Transaction events: ", tx.events[0]);
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

    // Function called to check if a auction exists in the contract mappings
    const checkAuctionExists = async (name) => {
        try {
            let dnsContract = await getDnsContract();

            const auctionExists = await dnsContract.checkIfAuctionExists(name);
            console.log("auctionexists: ", auctionExists);
            return auctionExists;
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

    //Function used to retrieve the domains registered to a particular user
    const getDomains = async () => {
        try {
            let dnsContract = await getDnsContract();

            const data = await dnsContract.getMyDomains(connected);
            const mappedNames = await Promise.all(
                data.map(async (i) => {
                    const _name = i.domainName;
                    // const _balance = i.balance.toNumber();
                    const _balance = ethers.utils.formatEther(i.balance);
                    const _value = ethers.utils.formatEther(i.value);

                    let domainName = {
                        name: _name,
                        balance: _balance,
                        value: _value,
                    };

                    return domainName;
                })
            );
            return mappedNames;
        } catch (err) {
            if (err.message === std) {
                return;
            } else {
                throw Error(err.message);
            }
        }
    };

    //Functions used ot retrieve all the domains registered in the DNS
    const getAllDomains = async () => {
        try {
            let dnsContract = await getDnsContract();

            const data = await dnsContract.getAllDomains();
            const mappedNames = await Promise.all(
                data.map(async (i) => {
                    console.log(i.domainName);
                    console.log(i.value);
                    let domainItem = {
                        name: i.domainName,
                    };

                    return domainItem;
                })
            );
            console.log("names: ", mappedNames);
            return mappedNames;
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

    // Function used to send ether to a particular domain name
    const sendDomain = async (name, amount) => {
        try {
            let dnsContract = await getDnsContract();
            const transaction = await dnsContract.sendDomain(name, {
                value: ethers.utils.parseEther(amount),
            });
            let tx = await transaction.wait();
            console.log("Transaction events: ", tx.events[0]);
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

    // Function used to withdraw from a domain name owned by a user
    const withdrawFromDomain = async (name, amount) => {
        try {
            let dnsContract = await getDnsContract();

            const transaction = await dnsContract.withdrawFrmDomain(
                name,
                ethers.utils.parseEther(amount)
            );
            let tx = await transaction.wait();
            console.log("Transaction events: ", tx.events[0]);
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <DnsContext.Provider
            value={{
                connectWallet,
                checkIfWalletIsConnected,
                connected,
                //FUNCTIONS
                createAuction,
                getAuctions,
                bid,
                createAuctionAndBid,
                getMyBiddings,
                getBytecode,
                revealBid,
                checkAuctionExists,
                getDomains,
                getAllDomains,
                sendDomain,
                withdrawFromDomain,
            }}
        >
            {children}
        </DnsContext.Provider>
    );
};
