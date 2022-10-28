// States, styles, etc..
import React, { useState, useEffect, useContext } from "react";
import styles from "./Mybiddings.module.css";
import { DnsContext } from "../../context/DnsContext";

// Bootstrap components
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// React components
import Card from "../Card/Card.jsx";
import InputModal from "../InputModal/InputModal";
import ErrorModal from "../ErrorModal/ErrorModal";
import LoadingSpinner from "../Loading/LoadingSpinner";

const Mybiddings = (props) => {
  // States
  const { revealBid, getMyBiddings } = useContext(DnsContext);
  const [loading, setLoading] = useState(false); // State to trigger loading prompt
  const [revealLoading, setRevealLoading] = useState(false); // State to trigger loading prompt
  const [bids, setBiddings] = useState([]); // State to hold array of ongoing bids from user
  const [reveal, setReveal] = useState(false); // State to prompt reveal modal when triggered
  const [secret, setSecret] = useState(); // State to hold secret int entered
  const [name, setName] = useState(""); // State to hold domain name currently on auction
  const [error, setError] = useState(false); // State to control ErrorModal prompt

  useEffect(() => {
    const getBids = async () => {
      try {
        const data = await getMyBiddings(props.connected);

        const biddingsMapped =
          data &&
          (await Promise.all(
            data.map(async (i) => {
              const unixStart = i.start.toNumber();
              let startDate = new Date(unixStart * 1000);
              startDate = startDate.toLocaleString();

              const unixEnd = i.end.toNumber();
              let endDate = new Date(unixEnd * 1000);
              endDate = endDate.toLocaleString();

              //changing to
              const revealStart = i.revealStart.toNumber();
              // const revealStart = i.revealEnd.toNumber();
              let reveal = new Date(revealStart * 1000);
              reveal = reveal.toLocaleString();

              let bidItem = {
                name: i.name,
                start: startDate,
                revealTime: reveal,
                end: endDate,
                revealed: i.revealed,
              };
              return bidItem;
            })
          ));
        setBiddings(biddingsMapped);
      } catch (err) {
        setError(true);
        setReveal(false);
      }
    };
    setLoading(true);
    getBids();
    setLoading(false);
  }, [getMyBiddings]);

  // Functions
  const revealBidSubmit = async () => {
    // Function to handle bid revealing phase
    try {
      setRevealLoading(true);
      await revealBid(name, secret);

      revealHandler();
    } catch (err) {
      setError(true);
      setReveal(false);
    } finally {
      setRevealLoading(false);
    }
  };

  const revealHandler = (event) => {
    // Function to control reveal state
    setReveal(!reveal);
  };

  const secretHandler = (event) => {
    // Function to set secret int based on user input
    setSecret(event.target.value);
  };

  const errorHandler = (event) => {
    // Function to control error state
    setError(false);
  };

  return (
    <Container>
      {error && (
        <ErrorModal
          title="Error occurred"
          message="You have already revealed this bid"
          onConfirm={errorHandler}
        />
      )}
      {reveal && (
        <InputModal
          onConfirm={() => {
            revealBidSubmit();
            revealHandler();
          }}
          title="Reveal"
          placeholder="Please input secret integer"
          type="password"
          pattern="\d*"
          label="Secret:"
          onChange={secretHandler}
          value={secret}
          onCancel={revealHandler}
        />
      )}
      <h2 className={styles.pagename}>My Biddings</h2>

      {loading && bids.length === 0 && (
        <LoadingSpinner message={"Loading your bids"} />
      )}
      {revealLoading && (
        <LoadingSpinner message={"Verifying your reveal, please wait"} />
      )}
      {!revealLoading && !loading && bids && (
        <Row>
          {bids.map((bid) => {
            return (
              <Col lg={4} md={6} sm={12} xs={12} key={bid.name}>
                <Card className={styles.card}>
                  <p>
                    Domain Name: <span>{bid.name + ".ntu"}</span>
                  </p>
                  <p>
                    Start: <span>{bid.start}</span>
                  </p>
                  <p>
                    Reveal Time: <span>{bid.revealTime}</span>
                  </p>
                  <p>
                    End: <span>{bid.end}</span>
                  </p>
                  <p>
                    Revealed: <span>{bid.revealed.toString()}</span>
                  </p>
                  <Button
                    className={`btn btn-primary ${styles.bidbtn}`}
                    onClick={() => {
                      setName(bid.name);
                      revealHandler();
                    }}
                  >
                    Check status
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default Mybiddings;
