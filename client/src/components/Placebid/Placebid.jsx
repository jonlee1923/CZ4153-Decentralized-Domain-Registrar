// States, styles, etc..
import { useState, useEffect, useContext } from "react";
import styles from "./Placebid.module.css";
import { DnsContext } from "../../context/DnsContext";
import { useLocation, useNavigate } from "react-router-dom";

// Bootstrap components
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";

// React components
import Steps from "./Steps/Steps";
import Input from "./Input/Input";
import LoadingSpinner from "../Loading/LoadingSpinner";
import ErrorModal from "../ErrorModal/ErrorModal";

const Placebid = (props) => {
  // Variables / Constant declaration
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  // States
  const { createAuctionAndBid, checkAuctionExists, bid } =
    useContext(DnsContext);
  const [rentalPrice, setRentalPrice] = useState(""); // State to hold user input's bid amount for bid
  const [domainName, setDomainName] = useState(""); // State to hold user input's domain name for bid
  const [secretInt, setSecretInt] = useState(""); // State to hold user input's secret int for bid
  const [loading, setLoading] = useState(false); // State to trigger loading prompt
  const [error, setError] = useState(false); // State to control ErrorModal prompt

  useEffect(() => {
    if (state) {
      setDomainName(state.name);
    }
  }, [state]);

  // Functions
  const cancelHandler = () => { // Triggers when hits cancel button on placebid page
    navigate("/");
  };

  const domainNameHandler = (event) => { // Sets domain name to value based on user input
    setDomainName(event.target.value);
  };

  const priceHandler = (event) => { // Sets bid amount to value based on user input
    setRentalPrice(event.target.value);
  };

  const secretHandler = (event) => { // Sets secret int to value based on user input
    setSecretInt(event.target.value);
  };

  const submitHandler = (event) => { // Triggers when user hits submit
    event.preventDefault();
    console.log("submitted!");
    pressBidHandler();
  };
  const errorHandler = () => { // Function to control error state
    setError(!error);
  };
  const pressBidHandler = async () => { // Function that checks for bid authentication
    setLoading(true);
    try {
      const result = await checkAuctionExists(domainName);
      if (result === true) {
        await bid(domainName+".ntu", rentalPrice, secretInt);
      } else {
        await createAuctionAndBid(domainName+".ntu", rentalPrice, secretInt);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);      
      setDomainName("");
      setRentalPrice("");
      setSecretInt("");
    }
  };

  return (
    <Container className={styles.placebidbox}>
      {error && (
        <ErrorModal
          title="Error Occurred"
          message="A bid has already been placed / Insufficient balance to place bid!"
          onConfirm={errorHandler}
        />
      )}
      {loading && (
        <LoadingSpinner
          message={"Please wait for your transaction to complete :)"}
        />
      )}
      {!loading && (
        <form className={`${styles.mainpage}`} onSubmit={submitHandler}>
          <Row className={`${styles.topbar}`}>
            <Col lg={4} md={6} sm={12} xs={12} className={styles.newauction}>
              <label htmlFor="nameinput">Domain Name: </label>
              <input
                id="nameinput"
                type="text"
                placeholder="Enter Domain Name"
                onChange={domainNameHandler}
                value={domainName}
                className={styles.nameinput}
              />
              <p className={styles.domain}>&nbsp;.ntu</p>
            </Col>
            <Col lg={4} md={6} sm={12} xs={12}>
              <Input
                id="rentalprice"
                type="text"
                placeholder="Enter Bid"
                pattern="^\d*(\.\d{0,6})?$"
                value={rentalPrice}
                onChange={priceHandler}
                inputClassName={styles.rentalprice}
                label="Bid:"
                divClassName={styles.price}
              />
            </Col>
            <Col lg={4} md={6} sm={12} xs={12}>
              <Input
                id="secret"
                type="password"
                pattern="[a-zA-Z0-9]+"
                placeholder="Enter Secret Int"
                value={secretInt}
                onChange={secretHandler}
                inputClassName={styles.secretInt}
                label="Secret:"
                divClassName={styles.secret}
              />
            </Col>
          </Row>

          <Steps />
          <Row className={`${styles.bottombtn}`}>
            <Col lg={6} md={6} sm={12}>
              <Button
                type="button"
                className={`btn btn-lg ${styles.reqregisterbtn} ${styles.cancelbtn}`}
                onClick={cancelHandler}
                size="sm"
              >
                Cancel
              </Button>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <Button
                type="submit"
                size="sm"
                className={`btn btn-primary btn-lg ${styles.reqregisterbtn} ${styles.regbtn}`}
              >
                Register!
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Container>
  );
};

export default Placebid;
