import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import { DnsContext } from "../context/DnsContext";
import styles from "./Navbar.module.css";

const Navbar2 = () => {
  const { connectWallet, currentAccount } = useContext(DnsContext);
  const lumeel = require("../assets/lumeel.jpg");
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home" ><img src = {lumeel} alt = "logo pic" className = {`${styles.brand}`}/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Form className={`d-flex ${styles.form}`}>
              <Form.Control
                type="search"
                placeholder="Search"
                className= {`me-2 ${styles.searchbar}`}
                aria-label="Search"
              />
              <Button variant="outline-success" className = {`${styles.searchbtn}`}>Search</Button>
              <Button
                type="button"
                className= {`btn btn-primary ${styles.connectwallet}`}
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbar2;
