import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import DnsAbi from "../contractsData/Dns.json";
import DnsAddress from "../contractsData/Dns-address.json";
import std from "../utils/constant.js";
export const DnsContext = React.createContext();

const { ethereum } = window;

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

export const DnsProvider = ({ children }) => {
    const [connected, setCurrentAccount] = useState("");

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

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            setCurrentAccount(accounts[0]);
            // window.location.reload();
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object");
        }
    };

    const createAuction = async (name) => {
        try {
            if (!ethereum) return alert("Please install metamask");
            let dnsContract = await getDnsContract();

            console.log("in createAuction");
            let transaction = await dnsContract.startAuction(name, 180, 180);
            let tx = await transaction.wait();
            console.log("Transaction events: ", tx.events[0]);
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

    const getBytecode = async (name) => {
        try {
            if (!ethereum) return alert("Please install metamask");
            let dnsContract = await getDnsContract();

            const bytecode = await dnsContract.getBytecode(connected, name);
            return bytecode;
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

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
            console.log("Transaction events: ", tx.events[0]);
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

    const createAuctionAndBid = async (name, amount, secret) => {
        try {
            if (!ethereum) return alert("Please install metamask");

            await createAuction(name);
            await bid(name, amount, secret);
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

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

    const getMyBiddings = async (address) => {
        try {
            if (!ethereum) return alert("Please install metamask");
            let dnsContract = await getDnsContract();
            await checkIfWalletIsConnected();

            let bids = await dnsContract.getBiddings(address);

            return bids;
        } catch (err) {
            if (err.message === std) {
                return;
            } else {
                throw Error(err.message);
            }
        }
    };

    const revealBid = async (name, secret) => {
        try {
            if (!ethereum) return alert("Please install metamask");
            let dnsContract = await getDnsContract();
            const bytecode = getBytecode(name);

            console.log("calling check");
            const transaction = await dnsContract.check(
                bytecode,
                // parseInt(secret), //used to be this <-
                ethers.utils.id(secret),
                name
            );
            let tx = await transaction.wait();
            console.log("Transaction events: ", tx.events[0]);
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

    const endAuction = async (name) => {
        try {
            if (!ethereum) return alert("Please install metamask");
            let dnsContract = await getDnsContract();

            const transaction = await dnsContract.endAuction(name);
            let tx = await transaction.wait();
            console.log("Transaction events: ", tx.events[0]);
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

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

    const getDomains = async () => {
        try {
            let dnsContract = await getDnsContract();

            //changing to
            const data = await dnsContract.getMyDomains(connected);
            // const data = await dnsContract.getDomains(connected);
            return data;
        } catch (err) {
            if (err.message === std) {
                return;
            } else {
                throw Error(err.message);
            }
        }
    };

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
                endAuction,
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
