import React from 'react';
import styles from "./Steps.module.css";
import { Icon1Circle, Icon2Circle, Icon3Circle } from "react-bootstrap-icons";

const Steps = (props) => {
  return (
    <div className={styles.middle}>
        <h2>
          Registering a domain name requires you to complete these steps:{" "}
        </h2>
        {props.existingBid && (
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
  )
}

export default Steps