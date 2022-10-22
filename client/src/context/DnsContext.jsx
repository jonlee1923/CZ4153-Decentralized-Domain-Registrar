import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import DnsAbi from "../contractsData/Dns.json";
import DnsAddress from "../contractsData/Dns-address.json";
export const DnsContext = React.createContext();

const { ethereum } = window;

// const getEthereumContract = () => {

// }

export const DnsProvider = ({ children }) => {
    const [connected, setCurrentAccount] = useState("");
    // const [loading, setLoading] = useState(false);
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const dnsContract = new ethers.Contract(
        DnsAddress.address,
        DnsAbi.abi,
        signer
    );

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
            const bytecode = await dnsContract.getBytecode(connected, name);
            let transaction = await dnsContract.bid(bytecode, secret, name, {
                value: ethers.utils.parseEther(bid),
            });

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
            console.log("testing");
            let auctions = await dnsContract.getAuctions();
            console.log("after fn call ");
            return auctions;
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

    const getMyBiddings = async (address) => {
        try {
            if (!ethereum) return alert("Please install metamask");
            console.log("in context fn");
            let bids = await dnsContract.getBiddings(address);
            // console.log("done context fn");

            return bids;
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

    const revealBid = async (name, secret) => {
        try {
            if (!ethereum) return alert("Please install metamask");
            const bytecode = getBytecode(name);
            const transaction = await dnsContract.check(
                bytecode,
                parseInt(secret),
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
            const data = await dnsContract.getDomains(connected);
            console.log(data);
            return data;
        } catch (err) {
            console.log(err);
            throw Error(err.message);
        }
    };

    const sendDomain = async (name, amount) => {
        try {
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
            const transaction = await dnsContract.withdrawFrmDomain(
                name,
                amount
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
                sendDomain,
                withdrawFromDomain,
            }}
        >
            {children}
        </DnsContext.Provider>
    );
};
