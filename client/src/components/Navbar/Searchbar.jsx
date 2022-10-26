import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import styles from "./Searchbar.module.css";
import data from "./data.json";
import { useNavigate } from "react-router-dom";
import { CodeSlash } from "react-bootstrap-icons";
import ErrorModal from "../ErrorModal/ErrorModal";

const Searchbar = (props) => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [existFilter, setExistFilter] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const filterHandler = (event) => {
    setQuery(event.target.value);
  };
  console.log("searchbar auctions", props.auctions);
  console.log("searchbar filter", filteredData);
  console.log("searchbar existfilter", existFilter);
  useEffect(() => {
    const newFilter = props.auctions.filter((value, key) => {
      return value.name.toLowerCase().includes(query.toLowerCase());
    });

    if (query === "") {
      setFilteredData([]);
      setExistFilter([]);
    } else {
      setFilteredData(newFilter);
    }
  }, [query, props.auctions, props.names]);

  const enterHandler = (event) => {
    const eFilter = props.names.filter((value, key) => {
      return value.name.toLowerCase().includes(query.toLowerCase());
    });
    setExistFilter(eFilter);
    if (event.key === "Enter") {
      if (existFilter.length !== 0) {
        setError(true);
        console.log("Name already exists!");
      } else if (filteredData.length === 0) {
        setError(true);
        console.log("Nothing Found!");
      } else {
        props.filterHandler(true);
        navigate("/", { state: { data: filteredData } });
      }
    }
  };

  const clickHandler = (event) => {
    props.filterHandler(true);
    navigate("/", { state: { data: filteredData } });
  };

  const confirmHandler = (event) => {
    setError(!error);
  }
  return (
    <div className={styles.search}>
      <Form.Control
        type="search"
        placeholder="Enter Search"
        className={`me-2 ${styles.searchbar}`}
        aria-label="Search"
        value={query}
        onChange={filterHandler}
        onKeyDown={enterHandler}
      />

      {error && existFilter.length !== 0 && <ErrorModal title="Owned name" message="Input name is already owned by another user!" onConfirm={confirmHandler}/>}
      {error && filteredData.length === 0 && <ErrorModal title="Doesn't exist" message="Input name does not exist. Start an auction on the placebid page!" onConfirm={confirmHandler}/>}
      {!error && filteredData.length !== 0 && (
        <div className={styles.result}>
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <p
                key={key}
                className={styles.resultentry}
                onClick={() => {
                  setQuery(value.name);
                  clickHandler();
                }}
              >
                {value.name}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
