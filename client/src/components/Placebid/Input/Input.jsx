import { checkProperties } from "ethers/lib/utils";
import React from "react";
import styles from "./Input.module.css";

const Input = (props) => {
  return (
    <div className={`${props.divClassName}`}>
      <label htmlFor={props.id}>{props.label} </label>
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        pattern={props.pattern}
        value={props.value}
        onChange={props.onChange}
        className={props.inputClassName}
      />
    </div>
  );
};

export default Input;
