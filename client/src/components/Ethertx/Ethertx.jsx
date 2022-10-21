import React, { useState, useContext } from "react";
import styles from "./Ethertx.module.css";
import { ethers } from "ethers";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "../Card/Card.jsx";
import ErrorModal from "../ErrorModal/ErrorModal";
import InputModal from "../InputModal/InputModal";
import { DnsContext } from "../../context/DnsContext";
import { useEffect } from "react";

const Ethertx = (props) => {
  const dummyBidGroup = [
      {
        name: "JonLee.ens",
        id: 1,
      },
      {
        name: "GeneLum.ens",
        id: 2,
      },
      {
        name: "Chuansong.ens",
        id: 3,
      },
      {
        name: "CatChew.ens",
        id: 4,
      },
      {
        name: "JonLee.ens",
        id: 5,
      },
      {
        name: "GeneLum.ens",
        id: 6,
      },
      {
        name: "CatChew.ens",
        id: 8,
      },
      {
        name: "Chuansong.ens",
        id: 7,
      },
  ];
  const {
    getDomains,
    sendDomain,
    withdrawFromDomain,
  } = useContext(DnsContext);
  
  const [validTransfer, setValidTransfer] = useState(false);
  const [error, setError] = useState(false);

  const [names, setNames] = useState();
  const [loading, setLoading] = useState(false);

  const transferHandler = () => {
    if (error) {
        setValidTransfer(false);
    } else {
        setValidTransfer(!validTransfer);
    }
  };
  return (
    <Container>
      {error && (
        <ErrorModal
          onConfirm={transferHandler}
          title={"Balance Insufficient"}
          message={"Please input an amount below your current balance"}
        />
      )}
      {validTransfer && (
        <InputModal
          onConfirm={transferHandler}
          title="Withdrawal"
          placeholder="Please input transfer amount"
          type="text"
          pattern="^\d*(\.\d{0,6})?$"
          label="Amount:"
        />
      )}
      <h2 className={styles.pagename}>Ether Transfer</h2>
      {dummyBidGroup.map((domain) => {
        return (
          <Col lg={4} md={6} sm={12} xs={12}>
            <Card className={styles.card} key={domain.id}>
              <p>Domain Name: {domain.name}</p>
              <Button className={styles.withdrawbtn} onClick={transferHandler}>
                Transfer Ether
              </Button>
            </Card>
          </Col>
        );
      })}
    </Container>
  );
};

export default Ethertx;
