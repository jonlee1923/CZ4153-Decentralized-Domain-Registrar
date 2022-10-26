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
import { computePublicKey } from "ethers/lib/utils";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Loading/LoadingSpinner";

const Ethertx = (props) => {
    const { getDomains, sendDomain, withdrawFromDomain, getAllDomains } =
        useContext(DnsContext);

    const [validTransfer, setValidTransfer] = useState(false);
    const [error, setError] = useState(false);

    const [nameToSend, setNameToSend] = useState();
    const [loading, setLoading] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const [xfer, setXfer] = useState(0);

    const navigate = useNavigate();

    const transferCancelHandler = () => {
        if (error) {
            setValidTransfer(false);
        } else {
            setValidTransfer(!validTransfer);
        }
        setXfer(0);
    };

    const sendDomainHandler = async (name, amount) => {
        try {
            setSendLoading(true);
            await sendDomain(name, amount);
            transferCancelHandler();
        } catch (err) {
            setError(err);
        } finally {
            setSendLoading(false);
        }
    };

    return (
        <Container>
            {error && (
                <ErrorModal
                    onConfirm={transferCancelHandler}
                    title={"Balance Insufficient"}
                    message={error}
                />
            )}
            {validTransfer && (
                <InputModal
                    onConfirm={() => {
                        sendDomainHandler(nameToSend, xfer);
                        transferCancelHandler();
                    }}
                    title="Transfer Ether"
                    placeholder="Please input transfer amount"
                    type="text"
                    pattern="^\d*(\.\d{0,6})?$"
                    label="Amount:"
                    onChange={(event) => {
                        setXfer(event.target.value);
                    }}
                    value={xfer}
                    onCancel={transferCancelHandler}
                />
            )}
            <h2 className={styles.pagename}>Ether Transfer</h2>
            {sendLoading && (
                <LoadingSpinner
                    message={"Please wait for your transaction to complete :)"}
                />
            )}
            <Row>
                {props.names &&
                    !sendLoading &&
                    props.names.map((domain) => {
                        return (
                            <Col
                                lg={4}
                                md={6}
                                sm={12}
                                xs={12}
                                key={domain.name}
                            >
                                <Card className={styles.card}>
                                    <p>
                                        Domain Name:{" "}
                                        <span>{domain.name + ".ntu"}</span>
                                    </p>
                                    <Button
                                        className={styles.transferbtn}
                                        onClick={() => {
                                            setNameToSend(domain.name);
                                            setValidTransfer(true);
                                            transferCancelHandler();
                                        }}
                                    >
                                        Transfer Ether
                                    </Button>
                                </Card>
                            </Col>
                        );
                    })}
            </Row>
        </Container>
    );
};

export default Ethertx;
