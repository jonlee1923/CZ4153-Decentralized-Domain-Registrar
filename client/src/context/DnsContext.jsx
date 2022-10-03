import React, {useEffect, useState} from 'react';
// import {ethers} from 'ethers';
// import {contractABI, contractAddress} from '../utils/constants';
export const DnsContext = React.createContext();

const {ethereum} = window;

// const getEthereumContract = () => {
//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const signer = provider.getSigner();
//     const dnsContract = new ethers.Contract(contractAddress, contractABI, signer);

//     return dnsContract;
// }

export const DnsProvider = ({children}) => {
    const[connected, setCurrentAccount] = useState("")

    const checkIfWalletIsConnected = async() => {
        try{
            if (!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({method: 'eth_accounts'});

            if(accounts.length){
                setCurrentAccount(accounts[0]);
            }else{
                console.log("No accounts found");
            }

        }catch(error){
            console.log(error);
            throw new Error("No ethereum object");
        }
    }

    const connectWallet = async () => {
        try{
            if(!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({method: "eth_requestAccounts",});

            setCurrentAccount(accounts[0]);
            // window.location.reload();
        }catch (error){
            console.log(error);
            throw new Error("No ethereum object");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return(
        <DnsContext.Provider value={{connectWallet, checkIfWalletIsConnected, connected}}>
            {children}
        </DnsContext.Provider>
    )
}
