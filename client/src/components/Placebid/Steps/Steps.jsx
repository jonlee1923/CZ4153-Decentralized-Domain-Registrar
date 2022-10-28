// States, styles, etc..
import React from "react";
import styles from "./Steps.module.css";

// Bootstrap components
import {
  Icon1Circle,
  Icon2Circle,
  Icon3Circle,
  Icon4Circle,
} from "react-bootstrap-icons";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";

const Steps = (props) => {
  return (
    <Container className={styles.middle}>
      <h2>Registering a domain name requires you to complete these steps: </h2>
      <Row className={styles.steps}>
        <Col lg={3} md={12} sm={12} className={styles.step}>
          <Icon1Circle size={50} />
          <span>
            <h5>Enter Domain name</h5>
            <p>Ensure desired domain name is displayed correctly</p>
          </span>
        </Col>
        <Col lg={3} md={12} sm={12} className={styles.step}>
          <Icon2Circle size={50} />
          <span>
            <h5>Bidding Amount</h5>
            <p>
              Enter bid for blind auction.
              <br />
            </p>
          </span>
        </Col>
        <Col lg={3} md={12} sm={12} className={styles.step}>
          <Icon3Circle size={50} />
          <span>
            <h5>Secret Number</h5>
            <p>
              Enter a secret number which will be required to reveal the results
              of the auction
            </p>
          </span>
        </Col>
        <Col lg={3} md={12} sm={12} className={styles.step}>
          <Icon4Circle size={50} />
          <span>
            <h5>Register</h5>
            <p>Hit the register button to commit your bid!</p>
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default Steps;
