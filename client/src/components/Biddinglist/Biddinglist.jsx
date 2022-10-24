import React, { useState, useEffect, useContext } from "react";
import styles from "./Biddinglist.module.css";
import { DnsContext } from "../../context/DnsContext";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../Card/Card.jsx";
import ErrorModal from "../ErrorModal/ErrorModal";

const BiddingList = (props) => {
  const dummyBidGroup = [
    [
      {
        name: "JonLee.ens",
        start: "20/10/22 18:30",
        end: "20/10/22 19:30",
        id: 1,
      },
      {
        name: "GeneLum.ens",
        start: "19/10/22 16:30",
        end: "19/10/22 17:30",
        id: 2,
      },
      {
        name: "Chuansong.ens",
        start: "10/10/22 01:00",
        end: "10/10/22 02:00",
        id: 3,
      },
    ],
    [
      {
        name: "CatChew.ens",
        start: "09/09/22 18:30",
        end: "09/09/22 19:30",
        id: 4,
      },
      {
        name: "JonLee.ens",
        start: "09/09/22 18:30",
        end: "09/09/22 19:30",
        id: 5,
      },
      {
        name: "GeneLum.ens",
        start: "09/09/22 18:30",
        end: "09/09/22 19:30",
        id: 6,
      },
    ],
    [
      {
        name: "CatChew.ens",
        start: "09/09/22 18:30",
        end: "09/09/22 19:30",
        id: 8,
      },
      {
        name: "Chuansong.ens",
        start: "09/09/22 18:30",
        end: "09/09/22 19:30",
        id: 7,
      },
    ],
  ];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filteredData,setFilteredData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;
  console.log("biddinglist state", state);

  useEffect(()=>{
    setFilteredData(state.data);
  },[state]);

  let bidPath = "";
  if (props.connected) {
    bidPath = "/placebid";
  } else {
    bidPath = "/connect";
  }

  const errorHandler = (event) => {
    setError("");
  };

  
  const removeFilterHandler = () => {
    setFilteredData([]);
  };

  return (
    <div>
      {error && (
        <ErrorModal
          title="Error occurred"
          message={error}
          onConfirm={errorHandler}
        />
      )}
      {filteredData.length !== 0 && (
        <Container>
          <div className={styles.toprow}>
            <h2 className={styles.pagename}>Bidding List</h2>
            <Button
              className={styles.removefilter}
              onClick={removeFilterHandler}
            >
              Remove Filter
            </Button>
          </div>
          <Row>
            {filteredData.map((auction) => {
              return (
                <Col lg={6} md={6} sm={12} xs={12} key={auction.auctionId}>
                  <Card className={styles.card}>
                    <p>
                      Domain Name: <span>{auction.name + ".ntu"}</span>
                    </p>
                    <p>
                      Start: <span>{auction.start}</span>
                    </p>
                    <p>c
                      Bidding End: <span>{auction.biddingEnd}</span>
                    </p>
                    <p>
                      Reveal End: <span>{auction.revealEnd}</span>
                    </p>
                    <p>
                      Auction Ended: <span>{auction.ended.toString()}</span>
                    </p>
                    <div className={styles.buttons}>
                      <Button
                        className={`btn ${styles.bidbtn} ${styles.btmbutton}`}
                        onClick={() => {
                          navigate(bidPath, {
                            state: { name: auction.name },
                          });
                        }}
                      >
                        Place a Bid!
                      </Button>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      )}

      {filteredData.length===0 && props.auctions && (
        <Container>
          <h2 className={styles.pagename}>Bidding List</h2>
          <Row>
            {props.auctions.map((auction) => {
              return (
                <Col lg={6} md={6} sm={12} xs={12} key={auction.auctionId}>
                  <Card className={styles.card}>
                    <p>
                      Domain Name: <span>{auction.name + ".ntu"}</span>
                    </p>
                    <p>
                      Start: <span>{auction.start}</span>
                    </p>
                    <p>
                      Bidding End: <span>{auction.biddingEnd}</span>
                    </p>
                    <p>
                      Reveal End: <span>{auction.revealEnd}</span>
                    </p>
                    <p>
                      Auction Ended: <span>{auction.ended.toString()}</span>
                    </p>
                    <div className={styles.buttons}>
                      <Button
                        className={`btn ${styles.bidbtn} ${styles.btmbutton}`}
                        onClick={() => {
                          navigate(bidPath, {
                            state: { name: auction.name },
                          });
                        }}
                      >
                        Place a Bid!
                      </Button>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      )}
    </div>
  );
};

export default BiddingList;
