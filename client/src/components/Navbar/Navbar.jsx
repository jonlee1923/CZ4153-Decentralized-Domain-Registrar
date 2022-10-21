import React, { useState, useEffect, useContext } from "react";
import styles from "./Navbar.module.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import { List } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const Navbar2 = React.forwardRef((props, ref) => {
  // const { connectWallet, checkIfWalletIsConnected, connected } = useContext(DnsContext);
  const lumeel = require("../../assets/lumeel.png");
  const navigate = useNavigate();
  const [newPath, setNewPath] = useState("/");

  useEffect(()=>{
    
  },[props.connected])

  let myNamesPath = "";
  let myBiddingsPath = "";
  let placeBidPath = "";
  let etherTxPath = "";

  if (props.connected) {
    myNamesPath = "/mynames";
    myBiddingsPath = "/mybiddings";
    placeBidPath = "/placebid";
    etherTxPath = "/ethertx";
  } else {
    myNamesPath = myBiddingsPath = placeBidPath = etherTxPath = "/connect";
  }

  return (
    <Navbar bg="light" expand="xl" className={styles.navbar}>
      <Container>
        <Navbar.Brand href="/">
          <img src={lumeel} alt="logo pic" className={`${styles.brand}`} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Form className={`d-flex ${styles.form}`}>
              <Form.Control
                type="search"
                placeholder="Search"
                className={`me-2 ${styles.searchbar}`}
                aria-label="Search"
              />
              <Button
                variant="outline-success"
                className={`${styles.searchbtn}`}
              >
                Search
              </Button>
              {props.connected && (
                <Button
                  type="button"
                  className={`btn btn-secondary ${styles.connectwallet}`}
                  disabled={true}
                >
                  Connected!
                </Button>
              )}
              {!props.connected && (
                <Button
                  type="button"
                  className={`btn btn-primary ${styles.connectwallet}`}
                  onClick={() => {
                    props.connectWallet();
                    navigate(newPath);
                  }}
                  ref={props.scrollRef}
                >
                  Connect Wallet
                </Button>
              )}
            </Form>
            <NavDropdown
              title={<List size={40} />}
              id="basic-nav-dropdown"
              className={styles.dropdown}
            >
              <NavDropdown.Item href="/">Bidding List</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                // href={myBiddingsPath}
                onClick={() => {
                  navigate(myBiddingsPath);
                  setNewPath("/mybiddings");
                }}
              >
                My Biddings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  navigate(myNamesPath);
                  setNewPath("/mynames");
                }}
              >
                My Names
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  navigate(placeBidPath);
                  setNewPath("/placebid");
                }}
              >
                Place Bids
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  navigate(etherTxPath);
                  setNewPath("/ethertx");
                }}
              >
                Ether Transaction
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default Navbar2;
