// States, styles, etc..
import React from "react";
import styles from "./Connectpage.module.css";

// Bootstrap components
import { ArrowUp } from "react-bootstrap-icons";

const Connectpage = (props) => {
  // Variable / Constants declaration
  const connectpagebg = require("../../assets/connectpage.jpg"); // To get image stored in assets folder
  return (
    <div className={styles.connectpage}>
      <img src={connectpagebg} alt="background" />
      <div className={styles.connectbox}>
        <ArrowUp
          size={84}
          className={styles.arrow}
          onClick={props.executeScroll}
        />
        <p className={styles.connectmsg}>
          Connect your metamask wallet to get started!
        </p>
      </div>
    </div>
  );
};

export default Connectpage;
