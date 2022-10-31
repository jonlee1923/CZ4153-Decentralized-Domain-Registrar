// States, styles, etc..
import React, { useState } from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

// Bootstrap components
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import { List } from "react-bootstrap-icons";

// React components
import OngoingSearchbar from "./Searchbars/OngoingSearchbar";
import RegisteredSearchbar from "./Searchbars/RegisteredSearchbar";


const Navbar2 = React.forwardRef((props, ref) => {
  // Variable / Constants declaration
  const lumeel = require("../../assets/lumeel.png"); // To get picture from assets folder
  let myNamesPath = "";
  let myBiddingsPath = "";
  let placeBidPath = "";
  let etherTxPath = "";
  const navigate = useNavigate();

  // States
  const [searchChoice, setSearchChoice] = useState("ongoing"); // State to hold current search type

  // Functions 
  if (props.connected) { // Set paths to connect page if wallet is not connected
    myNamesPath = "/mynames";
    myBiddingsPath = "/mybiddings";
    placeBidPath = "/placebid";
    etherTxPath = "/ethertx";
  } else {
    myNamesPath = myBiddingsPath = placeBidPath = etherTxPath = "/";
  }

  const submitHandler = (event) => { // Prevent refresh on submit
    event.preventDefault();
  };
  
  return (
    <Navbar expand="xl" className={styles.navbar2}>
      <Container>
        <Navbar.Brand href="/" className={styles.brandarea}>
          <img src={lumeel} alt="logo pic" className={`${styles.brand}`} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Form className={`d-flex ${styles.form}`} onSubmit={submitHandler}>
              {searchChoice === "ongoing" ? (
                <OngoingSearchbar
                  auctions={props.auctions}
                  names={props.names}
                  filter={props.filter}
                  filterHandler={props.filterHandler}
                  connected = {props.connected}
                />
              ) : (
                <RegisteredSearchbar
                  auctions={props.auctions}
                  names={props.names}
                  filter={props.filter}
                  filterHandler={props.filterHandler}
                  connected = {props.connected}
                />
              )}

              <Form.Select
                className={styles.select}
                value={searchChoice}
                onChange={(event) => {
                  setSearchChoice(event.target.value);
                }}
              >
                <option value="ongoing">Ongoing Auctions</option>
                <option value="registered">Registered Domains</option>
              </Form.Select>
              {props.connected && (
                <Button
                  type="button"
                  className={`btn ${styles.connectwallet} ${styles.successbtn}`}
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
                    navigate("/");
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
              <NavDropdown.Item href="/">Auctions</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href={myBiddingsPath}>
                My Biddings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href={myNamesPath}>My Names</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href={placeBidPath}>
                Place Bids
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href={etherTxPath}>
                Registered Domains
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default Navbar2;
