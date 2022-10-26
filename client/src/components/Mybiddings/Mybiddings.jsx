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
import LoadingSpinner from "../Loading/LoadingSpinner";
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
    const [revealLoading, setRevealLoading] = useState(false);
    const [bids, setBiddings] = useState([]);
    const [reveal, setReveal] = useState(false);
    const [secret, setSecret] = useState();
    const [name, setName] = useState("");
    const [error, setError] = useState("");

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
                                revealTime:reveal, 
                                end: endDate,
                                revealed: i.revealed,
                            };
                            return bidItem;
                        })
                    ));
                setBiddings(biddingsMapped);

                console.log(bids);
            } catch (err) {
                setError(err.message);
                setReveal(false);
            }
        };
        setLoading(true);
        getBids();
        setLoading(false);
    }, [getMyBiddings]);

    const revealBidSubmit = async () => {
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
        setReveal(!reveal);
    };

    const secretHandler = (event) => {
        setSecret(event.target.value);
    };

    const errorHandler = (event) => {
        setError("");
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
            
                {loading && bids.length === 0 && <LoadingSpinner message={"Loading your bids"}/>}
                {revealLoading && <LoadingSpinner message={"Verifying your reveal, please wait"}/>}
                {!revealLoading && !loading && bids && (
                    <Row>
                        {bids.map((bid) => {
                            return (
                                <Col
                                    lg={4}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                    key={bid.name}
                                >
                                    <Card className={styles.card}>
                                        <p>
                                            Domain Name:{" "}
                                            <span>{bid.name + ".ntu"}</span>
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
                                            Revealed:{" "}
                                            <span>
                                                {bid.revealed.toString()}
                                            </span>
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
