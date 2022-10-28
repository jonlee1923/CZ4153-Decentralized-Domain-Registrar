// States, styles, etc..
import React, { useState, useContext, useEffect } from "react";
import styles from "./Mynames.module.css";
import { DnsContext } from "../../context/DnsContext";

// Boostrap components
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// React components
import Card from "../Card/Card.jsx";
import ErrorModal from "../ErrorModal/ErrorModal";
import InputModal from "../InputModal/InputModal";
import LoadingSpinner from "../Loading/LoadingSpinner";

const Mynames = (props) => {
  // States
  const { getDomains, withdrawFromDomain } = useContext(DnsContext);
  const [balanceError, setBalanceError] = useState(false); // State to control ErrorModal prompt
  const [validWithdraw, setValidWithdraw] = useState(false); // State for valid withdraw
  const [amount, setAmount] = useState(0); // State to hold user input's transfer amount
  const [name, setDomainName] = useState(""); // State to hold withdrawal target's domain name
  const [names, setNames] = useState(); // State to hold user's registered domain names
  const [loading, setLoading] = useState(false); // State to trigger loading prompt
  const [withdrawLoading, setWithdrawLoading] = useState(false); // State to trigger loading prompt

  useEffect(() => {
    const getMyNames = async () => {
      const data = await getDomains();
      setNames(data);
    };
    setLoading(true);
    getMyNames();
    setLoading(false);
  }, [getDomains]);

  // Functions
  const withdrawHandler = () => {
    // Function to control withdraw and modal states
    if (balanceError) {
      setValidWithdraw(false);
      setBalanceError(false);
    } else {
      setValidWithdraw(!validWithdraw);
    }
  };

  const withdrawDomain = async () => {
    // Function to control withdrawal from target domain name
    try {
      setWithdrawLoading(true);
      await withdrawFromDomain(name, amount);
    } catch (err) {
      setBalanceError(true);
    } finally {
      setWithdrawLoading(false);
      setNames(await getDomains());
    }
  };

  return (
    <Container>
      {withdrawLoading && (
        <LoadingSpinner
          message={"Please wait for your transaction to complete :)"}
        />
      )}
      {balanceError && (
        <ErrorModal
          onConfirm={withdrawHandler}
          title={"Balance Insufficient"}
          message={"Please input an amount below your current balance"}
        />
      )}
      {validWithdraw && (
        <InputModal
          onConfirm={() => {
            withdrawHandler();
            withdrawDomain();
          }}
          onChange={(event) => {
            setAmount(event.target.value);
          }}
          title="Withdrawal"
          placeholder="Please input withdraw amount"
          type="text"
          pattern="^\d*(\.\d{0,6})?$"
          label="Amount:"
          onCancel={withdrawHandler}
        />
      )}
      <h2 className={styles.pagename}>My Names</h2>
      <Row>
        {!loading && !withdrawLoading && names && (
          <Row>
            {names.map((domain) => {
              return (
                <Col lg={4} md={6} sm={12} xs={12} key={domain.name}>
                  <Card className={styles.card}>
                    <p>
                      Domain Name: <span>{domain.name}</span>
                    </p>
                    <p>
                      Value Purchased: <span>{domain.value} eth</span>
                    </p>
                    <p>
                      Balance: <span>{domain.balance} eth</span>
                    </p>
                    <Button
                      className={styles.withdrawbtn}
                      onClick={() => {
                        setDomainName(domain.name);
                        withdrawHandler();
                      }}
                    >
                      Withdraw
                    </Button>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Row>
    </Container>
  );
};

export default Mynames;
