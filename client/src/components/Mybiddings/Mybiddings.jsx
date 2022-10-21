import React, { useState, useEffect, useContext } from "react";
import styles from "./Mybiddings.module.css";
import { DnsContext } from "../../context/DnsContext";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "../Card/Card.jsx";
import InputModal from "../InputModal/InputModal";
import ErrorModal from "../ErrorModal/ErrorModal";
// import { useEffect } from "react";

const Mybiddings = (props) => {
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

  const {
    // connectWallet,
    // checkIfWalletIsConnected,
    // connected,
    // createAuction,
    // loading,
    revealBid,
    getMyBiddings,
  } = useContext(DnsContext);
  const [loading, setLoading] = useState(false);
  const [bids, setBiddings] = useState();

  let errorMsg = "";
  useEffect(() => {
    const getBids = async () => {
      try {
        const data = await getMyBiddings(props.connected);
        const biddingsMapped = await Promise.all(
          data.map(async (i) => {
            const unixStart = i.start.toNumber();
            let startDate = new Date(unixStart * 1000);
            startDate = startDate.toUTCString();

            const unixEnd = i.end.toNumber();
            let endDate = new Date(unixEnd * 1000);
            endDate = endDate.toUTCString();
            let bidItem = {
              name: i.name,
              start: startDate,
              end: endDate,
              revealed: i.revealed,
            };
            return bidItem;
          })
        );

        setBiddings(biddingsMapped);

        console.log(bids);
      } catch (err) {
        setError(true);
        setReveal(false);
        errorMsg = err.msg;
      }
    };
    setLoading(true);
    getBids();
    setLoading(false);
  }, [getMyBiddings]);

  const [reveal, setReveal] = useState(false);
  const [secret, setSecret] = useState();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  const revealBidSubmit = async () => {
    console.log("secret ", secret, " name ", name);

    await revealBid(name, secret);
    revealHandler();
  };

  const revealHandler = (event) => {
    setReveal(!reveal);
  };

  const secretHandler = (event) => {
    setSecret(event.target.value);
  };

  const errorHandler = (event) => {
    setError(!error);
  };

  return (
    <Container>
      {error && (
        <ErrorModal
          title="Error occurred"
          message={errorMsg}
          onConfirm={errorHandler}
        />
      )}
      {reveal && (
        <InputModal
          onConfirm={() => {
            revealBidSubmit();
          }}
          title="Reveal"
          placeholder="Please input secret integer"
          type="password"
          pattern="\d*"
          label="Secret:"
          onChange={secretHandler}
          value={secret}
        />
      )}
      <h2 className={styles.pagename}>My Biddings</h2>
      <Row>
        {loading && !bids && <p>Loading</p>}
        {!loading && bids && (
          <div>
            {bids.map((bid) => {
              return (
                <Col lg={4} md={6} sm={12} xs={12}>
                  <Card className={styles.card} key={bid.id}>
                    <p>Domain Name: {bid.name}</p>
                    <p>Start: {bid.start}</p>
                    <p>End: {bid.end}</p>
                    <p>Revealed: {bid.revealed.toString()}</p>
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
          </div>
        )}
      </Row>
    </Container>
  );
};

export default Mybiddings;
