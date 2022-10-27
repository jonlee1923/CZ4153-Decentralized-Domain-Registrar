import React, { useState, useEffect, useContext } from "react";
import styles from "./Auctions.module.css";
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
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;
  console.log("biddinglist state", state);
  console.log("biddinglist filterstate", props.filter);
  useEffect(() => {
    if (state && props.filter) {
      setFilteredData(state.data);
    }
  }, [state, props.filter]);

  if (!props.connected) {
    navigate("/connect");
  }
  console.log("connected prop",props.connected);

  const errorHandler = (event) => {
    setError("");
  };

  const removeFilterHandler = () => {
    setFilteredData([]);
    props.filterHandler(false);
  };

  return (
    <Container>
      {error && (
        <ErrorModal
          title="Error occurred"
          message={error}
          onConfirm={errorHandler}
        />
      )}
      <div className={styles.toprow}>
        <h2 className={styles.pagename}>Auctions</h2>
        {filteredData.length !== 0 && (
          <Button className={styles.removefilter} onClick={removeFilterHandler}>
            Remove Filter
          </Button>
        )}
      </div>

      {filteredData.length !== 0 && (
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
                        navigate("/placebid", {
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
      )}

      {filteredData.length === 0 && props.auctions && (
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
                        navigate("/placebid", {
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
      )}
    </Container>
  );
};

export default BiddingList;
