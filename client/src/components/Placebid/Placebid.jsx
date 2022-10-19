import styles from "./Placebid.module.css";
import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { DnsContext } from "../../context/DnsContext";
import Button from "react-bootstrap/Button";
import {useLocation,useNavigate } from "react-router-dom";
import { Icon1Circle, Icon2Circle, Icon3Circle } from "react-bootstrap-icons";

const Placebid = (props) => {
  const [rentalPrice, setRentalPrice] = useState("");
  const [domainName, setDomainName] = useState("");
  const [secretInt, setSecretInt] = useState("");

  const location = useLocation();
  const { state } = location;
  let existingBid = false;
  const navigate = useNavigate();
  console.log("this is state",state);
  const cancelHandler = () => {
    navigate("/");
  }

  const {
    // connectWallet,
    // checkIfWalletIsConnected,
    // connected,
    loading,
    createAuctionAndBid,
  } = useContext(DnsContext);

  if (!state) {
    existingBid = false;
  } else {
    existingBid = true;
  }

  const domainNameHandler = (event) => {
    setDomainName(event.target.value);
  };

  const priceHandler = (event) => {
    setRentalPrice(event.target.value);
  };

  const secretHandler = (event) => {
    setSecretInt(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("submitted!");
  };
  return (
    <form className={`${styles.mainpage}`} onSubmit={submitHandler}>
      <div className={`${styles.topbar}`}>
        {existingBid && (
          <p>
            Domain Name:{" "}
            <span className={styles.domainname}>
              <em>{state.name}.ntu</em>
            </span>
          </p>
        )}
        {!existingBid && (
          <div className={styles.newauction}>
            <label htmlFor="nameinput">Domain Name: </label>
            <input
              id="nameinput"
              type="text"
              placeholder="Enter Domain Name"
              onChange={domainNameHandler}
              value={domainName}
              className={styles.nameinput}
            />
            <p className={styles.domain}>.ntu</p>
          </div>
        )}
        <div className={`${styles.price}`}>
          <label htmlFor="rentalprice">Bid: </label>
          <input
            id="rentalprice"
            type="text"
            placeholder="0"
            pattern="^\d*(\.\d{0,6})?$"
            value={rentalPrice}
            onChange={priceHandler}
            className={styles.rentalprice}
          />
        </div>
        <div className={`${styles.secret}`}>
          <label htmlFor="secret">Secret: </label>
          <input
            id="secret"
            type="password"
            pattern="\d*"
            value={secretInt}
            onChange={secretHandler}
            className={styles.secretInt}
          />
        </div>
      </div>
      <div className={styles.middle}>
        <h2>
          Registering a domain name requires you to complete these steps:{" "}
        </h2>
        {existingBid && (
          <div className={styles.steps}>
            <div className={styles.step}>
              <Icon1Circle size={50} />
              <span>
                <h4>New Auction</h4>
                <p>Enter domain name to check for availability </p>
              </span>
            </div>
            <div className={styles.step}>
              <Icon2Circle size={50} />
              <span>
                <h4>Bidding Amount</h4>
                <p>
                  Enter bid for blind auction.
                  <br />
                </p>
                <span className={styles.note}>
                  <ol>
                    Note:<li>Bid cannot be withdrawn</li>
                    <li>Bid amount cannot be changed once committed</li>
                  </ol>
                </span>
              </span>
            </div>
            <div className={styles.step}>
              <Icon3Circle size={50} />
              <span>
                <h4>Register</h4>
                <p>Hit the register button to commit your bid! </p>
              </span>
            </div>
          </div>
        )}
      </div>
      <div className={`${styles.bottombtn}`}>
        <Button className={`btn btn-light btn-lg ${styles.reqregisterbtn}`} onClick={cancelHandler}>
            Cancel
        </Button>
        {loading ? (
          <p>Loading</p>
        ) : (
          <Button
            type="submit"
            className={`btn btn-primary btn-lg ${styles.reqregisterbtn}`}
            onClick={() => {
              createAuctionAndBid(domainName, rentalPrice, secretInt);
            }}
          >
            Register!
          </Button>
        )}
      </div>
    </form>
  );
};

export default Placebid;
