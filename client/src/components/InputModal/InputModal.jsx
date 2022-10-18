import Card from "../Card/Card";
import Button from "react-bootstrap/esm/Button";
import styles from "./InputModal.module.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";

const Backdrop = (props) => {
  return <div className={styles.backdrop} />;
};

const ModalOverlay = (props) => {
  const [input, setInput] = useState("");
  const inputHandler = (event) => {
    setInput(event.target.value);
  };
  const submitHandler = (event) => {
    event.preventDefault();
    props.onConfirm();
    console.log(props.title + "submitted!");
  };
  return (
    <Card className={styles.modal}>
      <header className={styles.header}>
        <h2>{props.title}</h2>
      </header>
      <form className={styles.content} onSubmit={submitHandler}>
        <label htmlFor="input">{props.label}</label>
        <input
          type={props.type}
          id="input"
          pattern={props.pattern}
          onChange={inputHandler}
          value={input}
          placeholder={props.placeholder}
          className={styles.inputbox}
        />

        <footer className={styles.actions}>
          <Button
            className={`btn btn-light ${styles.btn}`}
            onClick={props.onConfirm}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={`btn btn-primary ${styles.btn}`}
          >
            Confirm
          </Button>
        </footer>
      </form>
    </Card>
  );
};

const InputModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          onConfirm={props.onConfirm}
          title={props.title}
          placeholder={props.placeholder}
          type={props.type}
          pattern={props.pattern}
          label={props.label}
        />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
};

export default InputModal;
