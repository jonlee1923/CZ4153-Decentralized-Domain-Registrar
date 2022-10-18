import React, { useState } from "react";
import styles from "./Mynames.module.css";

import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { NavLink } from "react-router-dom";
import Card from "../Card/Card.jsx";
import ErrorModal from "../ErrorModal/ErrorModal";

const Mynames = (props) => {
  const dummyBidGroup = [
    [
      {
        name: "JonLee.ens",
        value: "20",
        balance:"30",
        id: 1,
      },
      {
        name: "GeneLum.ens",
        value: "30",
        balance:"30",
        id: 2,
      },
      {
        name: "Chuansong.ens",
        value: "40",
        balance:"30",
        id: 3,
      },
    ],
    [
      {
        name: "CatChew.ens",
        value: "40",
        balance:"30",
        id: 4,
      },
      {
        name: "JonLee.ens",
        value: "20",
        balance:"30",
        id: 5,
      },
      {
        name: "GeneLum.ens",
        value: "30",
        balance:"30",
        id: 6,
      },
    ],
    [
      {
        name: "CatChew.ens",
        value: "40",
        balance:"30",
        id: 8,
      },
      {
        name: "Chuansong.ens",
        value: "40",
        balance:"30",
        id: 7,
      },
    ],
  ];

  const [error,setError] = useState(false);

  const withdrawHandler = () =>{
    setError(!error);
  }

  

  let bidPath = "";
  if (props.connected) {
    bidPath = "/placebid";
  } else {
    bidPath = "/connect";
  }
  return (
    <Container>
    {error && <ErrorModal onConfirm={withdrawHandler} title={"Balance Insufficient"} message={"Please input an amount below your current balance"}/>}
    <h2 className={styles.pagename}>My Names</h2>
      {dummyBidGroup.map((dummyBid) => {
        return (
          <Row>
            {dummyBid.map((bid) => {
              return (
                <Col lg={4} md={6} sm={12} xs={12}>
                  <Card className={styles.card} key={bid.id}>
                    <p>Domain Name: {bid.name}</p>
                    <p>Value Purchased: {bid.value} eth</p>
                    <p>Balance: {bid.balance} eth</p>
                    <Button className={styles.withdrawbtn} onClick={withdrawHandler}>Withdraw</Button>
                  </Card>
                </Col>
              );
            })}
          </Row>
        );
      })}
    </Container>
  );
};

export default Mynames;
