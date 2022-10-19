import React from "react";
import styles from "./Steps.module.css";
import {
  Icon1Circle,
  Icon2Circle,
  Icon3Circle,
  Icon4Circle,
} from "react-bootstrap-icons";

const Steps = (props) => {
  return (
    <div className={styles.middle}>
      <h2>Registering a domain name requires you to complete these steps: </h2>
      <div className={styles.steps}>
        <div className={styles.step}>
          <Icon1Circle size={50} />
          <span>
            <h4>Enter Domain name</h4>
            <p>Ensure desired domain name is displayed correctly</p>
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
                <b>Note:</b><li>Bid cannot be withdrawn</li>
                <li>Bid amount cannot be changed once committed</li>
              </ol>
            </span>
          </span>
        </div>
        <div className={styles.step}>
          <Icon3Circle size={50} />
          <span>
            <h4>Secret Number</h4>
            <p>
              Enter a secret number which will be required to reveal the results
              of the auction
            </p>
          </span>
        </div>
        <div className={styles.step}>
          <Icon4Circle size={50} />
          <span>
            <h4>Register</h4>
            <p>Hit the register button to commit your bid!</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Steps;
