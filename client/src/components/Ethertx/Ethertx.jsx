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
    const { getDomains, sendDomain, withdrawFromDomain } =
        useContext(DnsContext);

    const [validTransfer, setValidTransfer] = useState(false);
    const [error, setError] = useState();

    const [names, setNames] = useState();
    const [nameToSend, setNameToSend] = useState();
    const [amountToSend, setAmountToSend] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getAllNamesHandler = async () => {
            try {
                const data = await getDomains();

                const mappedNames = await Promise.all(
                    data.map(async (i) => {
                        let domainItem = {
                            name: i.domainName,
                            value: i.value.toNumber(),
                        };

                        return domainItem;
                    })
                );

                setNames(mappedNames);
            } catch (err) {
                setError("Something went wrong!");
            }
        };
        setLoading(true);

        getAllNamesHandler();
        setLoading(false);
    }, [getDomains]);

    const transferHandler = () => {
        // if (error) {
        //     setValidTransfer(false);
        // } else {
        setValidTransfer(!validTransfer);
        // }
    };

    const sendDomainHandler = async (name, amount) => {
        try {
            await sendDomain(name, amount);
            transferHandler();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container>
            {error && (
                <ErrorModal
                    // onConfirm={transferHandler}
                    title={"Balance Insufficient"}
                    message={error}
                />
            )}
            {validTransfer && (
                <InputModal
                    onConfirm={(amount) => {
                        setAmountToSend(amount);
                        setAmountToSend();
                        sendDomainHandler(nameToSend, amountToSend);
                    }}
                    title="Withdrawal"
                    placeholder="Please input transfer amount"
                    type="text"
                    pattern="^\d*(\.\d{0,6})?$"
                    label="Amount:"
                />
            )}
            <h2 className={styles.pagename}>Ether Transfer</h2>
            {loading && <p>Loading</p>}
            {!loading &&
                names &&
                names.map((domain) => {
                    return (
                        <Col lg={4} md={6} sm={12} xs={12}>
                            <Card className={styles.card} key={domain.id}>
                                <p>Domain Name: {domain.name}</p>
                                <Button
                                    className={styles.withdrawbtn}
                                    onClick={() => {
                                        sendDomainHandler(domain.name);

                                        transferHandler();
                                    }}
                                >
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
