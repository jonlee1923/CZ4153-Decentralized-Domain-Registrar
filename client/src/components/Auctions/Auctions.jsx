// States, styles, etc..
import React, { useState, useEffect } from "react";
import styles from "./Auctions.module.css";
import { useNavigate, useLocation } from "react-router-dom";

// Bootstrap components
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// React components
import Card from "../Card/Card.jsx";
import ErrorModal from "../ErrorModal/ErrorModal";

const Auctions = (props) => {
  // Variable / Constants declaration
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;

  //States
  const [error, setError] = useState(false); // State to control ErrorModal prompt
  const [filteredData, setFilteredData] = useState([]); // State for array of filteredData

  useEffect(() => {
    if (state && props.filter) {
      // If there is a filter, set filteredData to data
      setFilteredData(state.data);
    }
  }, [state, props.filter]);

  // Functions
  if (!props.connected) {
    // If unconnected, block access and navigate to Connect page
    navigate("/connect");
  }
  const errorHandler = (event) => {
    // To control error state
    setError(!error);
  };

  const removeFilterHandler = () => {
    // To control filter state
    setFilteredData([]);
    props.filterHandler(false);
  };

  return (
    <Container>
      {error && (
        <ErrorModal
          title="Error occurred"
          message="Something went wrong!"
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

export default Auctions;
