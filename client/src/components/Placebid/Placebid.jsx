import styles from "./Placebid.module.css";
import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { DnsContext } from "../../context/DnsContext";
import Button from "react-bootstrap/Button";
import {useLocation,useNavigate } from "react-router-dom";
import Steps from "./Steps/Steps";
import Input from "./Input/Input";

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
          <Input
            id="rentalprice"
            type="text"
            placeholder="0"
            pattern="^\d*(\.\d{0,6})?$"
            value={rentalPrice}
            onChange={priceHandler}
            inputClassName={styles.rentalprice}
            label="Bid:"
            divClassName={styles.price}
          />
          <Input
            id="secret"
            type="password"
            pattern="\d*"
            value={secretInt}
            onChange={secretHandler}
            inputClassName={styles.secretInt}
            label="Secret:"
            divClassName={styles.secret}
          />
      </div>
      <Steps/>
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
