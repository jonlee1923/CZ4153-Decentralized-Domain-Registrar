// States, styles, etc..
import React, { useState, useContext, useEffect } from "react";
import styles from "./DomainNames.module.css";
import { DnsContext } from "../../context/DnsContext";
import { useLocation } from "react-router-dom";

// Bootstrap components
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// React components
import ErrorModal from "../ErrorModal/ErrorModal";
import InputModal from "../InputModal/InputModal";
import Card from "../Card/Card.jsx";
import LoadingSpinner from "../Loading/LoadingSpinner";

const DomainNames = (props) => {
  // States
  const { sendDomain } = useContext(DnsContext);

  const [validTransfer, setValidTransfer] = useState(false); // State for valid transfer
  const [error, setError] = useState(false); // State to control ErrorModal prompt
  const [filteredData, setFilteredData] = useState([]); // State for array of filteredData
  const [nameToSend, setNameToSend] = useState(); // State to hold recipient's address / domain name
  const [sendLoading, setSendLoading] = useState(false); // State to trigger loading prompt
  const [xfer, setXfer] = useState(0); // State to hold transfer amount

  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state && props.filter) {
      setFilteredData(state.data);
    }
  }, [state, props.filter]);

  // Functions
  const removeFilterHandler = () => {
    // To control filter state
    setFilteredData([]);
    props.filterHandler(false);
  };

  const transferCancelHandler = () => {
    // Function to control transfer and modal states
    if (error) {
      setValidTransfer(false);
    } else {
      setValidTransfer(!validTransfer);
    }
    setXfer(0);
  };

  const sendDomainHandler = async (name, amount) => {
    // Function that handles a valid transfer
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
      <div className={styles.toprow}>
        <h2 className={styles.pagename}>Ether Transfer</h2>
        {filteredData.length !== 0 && (
          <Button className={styles.removefilter} onClick={removeFilterHandler}>
            Remove Filter
          </Button>
        )}
      </div>
      {sendLoading && (
        <LoadingSpinner
          message={"Please wait for your transaction to complete :)"}
        />
      )}
      <Row>
        {filteredData &&
          !sendLoading &&
          filteredData.map((domain) => {
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
        {filteredData.length === 0 &&
          props.names &&
          !sendLoading &&
          props.names.map((domain) => {
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
export default DomainNames;
