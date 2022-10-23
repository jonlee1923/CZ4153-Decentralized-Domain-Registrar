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
  const { getDomains, sendDomain, withdrawFromDomain, getAllDomains } =
    useContext(DnsContext);

  const [validTransfer, setValidTransfer] = useState(false);
  const [error, setError] = useState(false);

  const [names, setNames] = useState();
  const [nameToSend, setNameToSend] = useState();
  const [loading, setLoading] = useState(false);
  const [xfer, setXfer] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const getAllNamesHandler = async () => {
      try {
        const data = await getAllDomains();

        const mappedNames = await Promise.all(
          data.map(async (i) => {
            console.log(i.domainName);
            console.log(i.value);
            let domainItem = {
              name: i.domainName,
              value: i.value.toNumber(),
            };

            return domainItem;
          })
        );

        setNames(mappedNames);
      } catch (err) {
        setError(err);
      }
    };
    setLoading(true);

    getAllNamesHandler();
    setLoading(false);
  }, [getDomains]);

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
      await sendDomain(name, amount);
      transferCancelHandler();
    } catch (err) {
      setError(err);
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
      <Row>
        {loading && <p>Loading</p>}
        {!loading &&
          names &&
          names.map((domain) => {
            return (
              <Col lg={4} md={6} sm={12} xs={12} key={domain.name}>
                <Card className={styles.card}>
                  <p>
                    Domain Name: <span>{domain.name + ".ntu"}</span>
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
