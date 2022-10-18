import styles from "./Placebid.module.css";
import { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import { NavLink, useLocation } from "react-router-dom";
import { Icon1Circle, Icon2Circle, Icon3Circle } from "react-bootstrap-icons";

const Placebid = (props) => {
  const [rentalPrice, setRentalPrice] = useState("");
  const [domainName, setDomainName] = useState("");

  const location = useLocation();
  const { state } = location;
  let existingBid = false;

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

  return (
    <div className={`${styles.mainpage}`}>
      <div className={`${styles.topbar}`}>
        {existingBid && (
          <p>
            Domain Name:{" "}
            <span className={styles.domainname}>
              <em>{state.name}</em>
            </span>
          </p>
        )}
        {!existingBid && (
          <div>
            <label htmlFor="nameinput">Domain Name: </label>
            <input
              id="nameinput"
              type="text"
              placeholder="Enter Domain Name"
              onChange={domainNameHandler}
              value={domainName}
              className={styles.nameinput}
            />
          </div>
        )}
        <div className={`${styles.price}`}>
          <label htmlFor="rentalprice">Bid: </label>
          <input
            id="rentalprice"
            type="text"
            placeholder="0"
            value={rentalPrice}
            onChange={priceHandler}
            className={styles.rentalprice}
          />
        </div>
      </div>
      <div className={styles.middle}>
        <h2>
          Registering a domain name requires you to complete these steps:{" "}
        </h2>
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
              <p>Enter bid for blind auction.<br/><span className={styles.note}><ol>Note:<li>Bid cannot be withdrawn until auction is over</li><li>Bid amount cannot be changed once committed</li></ol></span></p>
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
      </div>
      <div className={`${styles.bottombtn}`}>
        <Button className={`btn btn-light btn-lg ${styles.reqregisterbtn}`}>
          <NavLink to="/" className={styles.cancelbtn}>
            Cancel
          </NavLink>
        </Button>
        <Button
          type="button"
          className={`btn btn-primary btn-lg ${styles.reqregisterbtn}`}
        >
          <NavLink to="/" className={styles.regbtn}>
            Register!
          </NavLink>
        </Button>
      </div>
    </div>
  );
};

export default Placebid;
