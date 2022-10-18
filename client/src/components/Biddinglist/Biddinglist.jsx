import React, { useState } from "react";
import styles from "./Biddinglist.module.css";

import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { NavLink } from "react-router-dom";
import Card from "../Card/Card.jsx";

const BiddingList = (props) => {
  const dummyBidGroup = [
    [
      {
        name: "JonLee.ens",
        start:"20/10/22 18:30",
        end:"20/10/22 19:30",
        id: 1,
      },
      {
        name: "GeneLum.ens",
        start:"19/10/22 16:30",
        end:"19/10/22 17:30",
        id: 2,
      },
      {
        name: "Chuansong.ens",
        start:"10/10/22 01:00",
        end:"10/10/22 02:00",
        id: 3,
      },
    ],
    [
      {
        name: "CatChew.ens",
        start:"09/09/22 18:30",
        end:"09/09/22 19:30",
        id: 4,
      },
      {
        name: "JonLee.ens",
        start:"09/09/22 18:30",
        end:"09/09/22 19:30",
        id: 5,
      },
      {
        name: "GeneLum.ens",
        start:"09/09/22 18:30",
        end:"09/09/22 19:30",
        id: 6,
      },
    ],
    [
      {
        name: "CatChew.ens",
        start:"09/09/22 18:30",
        end:"09/09/22 19:30",
        id: 8,
      },
      {
        name: "Chuansong.ens",
        start:"09/09/22 18:30",
        end:"09/09/22 19:30",
        id: 7,
      },
    ],
  ];

  let bidPath = "";
  if (props.connected) {
    bidPath = "/placebid";
  } else {
    bidPath = "/connect";
  }
  return (
    <Container>
    <h2 className={styles.pagename}>Bidding List</h2>
      {dummyBidGroup.map((dummyBid) => {
        return (
          <Row>
            {dummyBid.map((bid) => {
              return (
                <Col lg={4} md={6} sm={12} xs={12}>
                  <Card className={styles.card} key={bid.id}>
                    <p>Domain Name: {bid.name}</p>
                    <p>Start: {bid.start}</p>
                    <p>End: {bid.end}</p>
                    <Button className={`btn btn-primary ${styles.bidbtn}`}>
                      <NavLink
                        to={bidPath}
                        state={{name:`${bid.name}`}}
                        className={styles.bidlink}
                      >
                        Place a Bid!
                      </NavLink>
                    </Button>
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

export default BiddingList;
