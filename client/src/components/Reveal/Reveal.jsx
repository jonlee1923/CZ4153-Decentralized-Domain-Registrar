import Card from "../Card/Card";
import Button from "react-bootstrap/esm/Button";
import styles from "./Reveal.module.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";

const Backdrop = (props) => {
  return <div className={styles.backdrop} />;
};

const ModalOverlay = (props) => {
  const [revealTxt, setRevealTxt] = useState("");
  const revealTxtHandler = (event) => {
    setRevealTxt(event.target.value);
  };

  return (
    <Card className={styles.modal}>
      <header className={styles.header}>
        <h2>Reveal</h2>
      </header>
      <div className={styles.content}>
        <input
          type="text"
          onChange={revealTxtHandler}
          value={revealTxt}
          placeholder="Input Reveal String"
        />
      </div>
      <footer className={styles.actions}>
        <Button
          className={`btn btn-light ${styles.btn}`}
          onClick={props.onConfirm}
        >
          Cancel
        </Button>
        <Button
          className={`btn btn-primary ${styles.btn}`}
          onClick={props.onConfirm}
        >
          Confirm
        </Button>
      </footer>
    </Card>
  );
};

const Reveal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay onConfirm={props.onConfirm}/>,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
};

export default Reveal;
