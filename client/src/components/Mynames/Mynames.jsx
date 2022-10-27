import React, { useState, useContext } from "react";
import styles from "./Mynames.module.css";
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
import LoadingSpinner from "../Loading/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const Mynames = (props) => {
  const { getDomains, sendDomain, withdrawFromDomain } = useContext(DnsContext);
  const [balanceError, setBalanceError] = useState(false);
  const [validWithdraw, setValidWithdraw] = useState(false);
  const [amount, setAmount] = useState(0);
  const [name, setDomainName] = useState(0);
  const [names, setNames] = useState();
  const [loading, setLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  useEffect(() => {
    const getMyNames = async () => {
      const data = await getDomains();
      // console.log(data);
      setNames(data);
    };
    setLoading(true);
    getMyNames();
    setLoading(false);
  }, [getDomains]);

  // if(reload){
  //     // window.location.reload(false);
  //     setReload(false);
  // }
  const withdrawHandler = () => {
    if (balanceError) {
      setValidWithdraw(false);
      setBalanceError(false);
    } else {
      setValidWithdraw(!validWithdraw);
    }
  };

  const withdrawDomain = async () => {
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
