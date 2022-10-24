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

const Mynames = (props) => {
  const dummyBidGroup = [
    [
      {
        name: "JonLee.ens",
        value: "20",
        balance: "30",
        id: 1,
      },
      {
        name: "GeneLum.ens",
        value: "30",
        balance: "30",
        id: 2,
      },
      {
        name: "Chuansong.ens",
        value: "40",
        balance: "30",
        id: 3,
      },
    ],
    [
      {
        name: "CatChew.ens",
        value: "40",
        balance: "30",
        id: 4,
      },
      {
        name: "JonLee.ens",
        value: "20",
        balance: "30",
        id: 5,
      },
      {
        name: "GeneLum.ens",
        value: "30",
        balance: "30",
        id: 6,
      },
    ],
    [
      {
        name: "CatChew.ens",
        value: "40",
        balance: "30",
        id: 8,
      },
      {
        name: "Chuansong.ens",
        value: "40",
        balance: "30",
        id: 7,
      },
    ],
  ];
  const { getDomains, sendDomain, withdrawFromDomain } = useContext(DnsContext);
  const [balanceError, setBalanceError] = useState(false);
  const [validWithdraw, setValidWithdraw] = useState(false);
  const [error, setError] = useState(false);
  const [amount, setAmount] = useState(0);
  const [name, setDomainName] = useState(0);
  const [names, setNames] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMyNames = async () => {
      const data = await getDomains();
      console.log(data);

      const mappedNames =
        data &&
        (await Promise.all(
          data.map(async (i) => {
            const _name = i.domainName;
            // const _balance = i.balance.toNumber();
            const _balance = ethers.utils.formatEther(i.balance);
            const _value = ethers.utils.formatEther(i.value);

            let domainName = {
              name: _name,
              balance: _balance,
              value: _value,
            };

            return domainName;
          })
        ));

      setNames(mappedNames);
          
    };
    setLoading(true);
    getMyNames();
    setLoading(false);
  }, [getDomains]);

  const withdrawHandler = () => {
    if (error) {
      setValidWithdraw(false);
    } else {
      setValidWithdraw(!validWithdraw);
    }
  };

  const withdrawDomain = async () => {
    try {
      await withdrawFromDomain(name, amount);
    } catch (err) {}
  };

  return (
    <Container>
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
        {!loading && names && (
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
