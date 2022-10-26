import styles from "./Placebid.module.css";
import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { DnsContext } from "../../context/DnsContext";
import Button from "react-bootstrap/Button";
import { useLocation, useNavigate } from "react-router-dom";
import Steps from "./Steps/Steps";
import Input from "./Input/Input";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import LoadingSpinner from "../Loading/LoadingSpinner";

const Placebid = (props) => {
    const [rentalPrice, setRentalPrice] = useState("");
    const [domainName, setDomainName] = useState("");
    const [secretInt, setSecretInt] = useState("");
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();

  const cancelHandler = () => {
    navigate("/");
  };
  const { createAuctionAndBid, checkAuctionExists, bid } =
    useContext(DnsContext);

    // if (state) {
    //     setDomainName(state.name);
    //     console.log("this is domainname",domainName);
    // }
    useEffect(() => {
        if (state) {
            setDomainName(state.name);
        }
    }, [state]);
    const domainNameHandler = (event) => {
        setDomainName(event.target.value);
    };

    const priceHandler = (event) => {
        setRentalPrice(event.target.value);
    };

    const secretHandler = (event) => {
        setSecretInt(event.target.value);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        console.log("submitted!");
        pressBidHandler();
    };

    const pressBidHandler = async () => {
        setLoading(true);
        try {
            const result = await checkAuctionExists(domainName);
            if (result === true) {
                await bid(domainName, rentalPrice, secretInt);
            } else {
                await createAuctionAndBid(domainName, rentalPrice, secretInt);
            }
        } catch (err) {
        } finally {
            setLoading(false);
            setDomainName("");
            setRentalPrice("");
            setSecretInt("");
        }
    };

    return (
        <Container className={styles.placebidbox}>
            {loading && <LoadingSpinner message={"Please wait for your transaction to complete :)"}/>}
            {!loading && (
                <form className={`${styles.mainpage}`} onSubmit={submitHandler}>
                    <Row className={`${styles.topbar}`}>
                        <Col
                            lg={4}
                            md={6}
                            sm={12}
                            xs={12}
                            className={styles.newauction}
                        >
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
                                pattern="\d*"
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
