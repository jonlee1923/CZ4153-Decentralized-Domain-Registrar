import React, { useState, useEffect, useContext } from "react";
import styles from "./Biddinglist.module.css";
import { DnsContext } from "../../context/DnsContext";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
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

  const [auctions, setAuctions] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  let bidPath = "";

  if (props.connected) {
    bidPath = "/placebid";
  } else {
    bidPath = "/connect";
  }

  const { bid, getAuctions, endAuction } = useContext(DnsContext);

  useEffect(() => {
    const getAuctionsHandler = async () => {
      try {
        const data = await getAuctions();

        const auctionsMapped = await Promise.all(
          data.map(async (i) => {
            const unixStart = i.start.toNumber();
            let startDate = new Date(unixStart * 1000);
            startDate = startDate.toUTCString();

            const unixEnd = i.revealEnd.toNumber();
            let endDate = new Date(unixEnd * 1000);
            endDate = endDate.toUTCString();

            const unixTime = i.biddingEnd.toNumber();
            let date = new Date(unixTime * 1000);
            date = date.toUTCString();

            let auctionItem = {
              auctionId: i.auctionId.toNumber(),
              name: i.name,
              start: startDate,
              biddingEnd: date,
              revealEnd: endDate,
              ended: i.ended,
            };
            return auctionItem;
          })
        );
        setLoading(true);
        setAuctions(auctionsMapped);
        setLoading(false);
      } catch (err) {
        setError("Something went wrong!");
      }
    };

    getAuctionsHandler();

    // console.log(auctions);
  }, [getAuctions]);

  const endAuctionHandler = async (name) => {
    try {
      await endAuction(name);
    } catch (err) {
      console.log(err);
    }
  };

  const errorHandler = (event) => {
    setError("");
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
      {loading && !auctions && <p>Loading</p>}

      {!loading && auctions && (
        <Container>
          <h2 className={styles.pagename}>Bidding List</h2>
          <Row>
            {auctions.map((auction) => {
              return (
                <Col lg={4} md={6} sm={12} xs={12}>
                  <Card className={styles.card} key={auction.id}>
                    <p>Domain Name: {auction.name + ".ntu"}</p>
                    <p>Start: {auction.start}</p>
                    <p>Bidding End: {auction.biddingEnd}</p>
                    <p>Reveal End: {auction.revealEnd}</p>
                    <p>Auction Ended: {auction.ended.toString()}</p>
                    <Button
                      className={`btn btn-primary ${styles.bidbtn}`}
                      onClick={() => {
                        navigate(bidPath, {
                          state: { name: auction.name },
                        });
                      }}
                    >
                      Place a Bid!
                    </Button>
                    <Button
                      onClick={() => {
                        endAuctionHandler(auction.name);
                      }}
                    >
                      End
                    </Button>
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
