import React, { useContext } from "react";
import { DnsContext } from "../context/DnsContext";

export default function Navbar() {
    const { connectWallet, currentAccount } = useContext(DnsContext);

    return (
        <div className="navbar">
            <div className="container">
                <div className="d-flex">
                    {!currentAccount && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={connectWallet}
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
