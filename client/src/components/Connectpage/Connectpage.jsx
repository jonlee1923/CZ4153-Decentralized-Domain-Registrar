import React,{useRef} from 'react';
import styles from "./Connectpage.module.css";

import {ArrowUp} from "react-bootstrap-icons";


const Connectpage = (props) => {
  const connectpagebg = require("../../assets/connectpage.jpg");

  
  return (
    <div className={styles.connectpage}>
      <img src={connectpagebg} alt="background" />
      <div className={styles.connectbox}>
        <ArrowUp size={84} className={styles.arrow} onClick={props.executeScroll} />
        <p className={styles.connectmsg}>Connect your metamask wallet to get started!</p>
      </div>
    </div>

  )
}

export default Connectpage