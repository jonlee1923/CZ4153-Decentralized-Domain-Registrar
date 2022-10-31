// States, styles, etc..
import React from "react";
import ReactDOM from "react-dom";
import styles from "./InputModal.module.css";

// Bootstrap components
import Button from "react-bootstrap/esm/Button";

//React components
import Card from "../Card/Card";

const Backdrop = (props) => {
  return <div className={styles.backdrop} />;
};

const ModalOverlay = (props) => {
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
          onChange={props.onChange}
          value={props.value}
          placeholder={props.placeholder}
          className={styles.inputbox}
        />

        <footer className={styles.actions}>
          <Button
            className={`btn ${styles.btn} ${styles.cancelbtn}`}
            onClick={props.onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={`btn ${styles.btn} ${styles.confirmbtn}`}
            onClick={props.onConfirm}
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
          value={props.value}
          onChange={props.onChange}
          onCancel={props.onCancel}
        />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
};

export default InputModal;
