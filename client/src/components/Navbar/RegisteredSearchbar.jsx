import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import styles from "./OngoingSearchbar.module.css";
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
  console.log("registered searchbar auctions", props.auctions);
  console.log("registered searchbar names", props.names);
  console.log("registered searchbar filter", filteredData);
  console.log("registered searchbar existfilter", existFilter);
  useEffect(() => {
    const eFilter = props.names.filter((value, key) => {
      return value.name.toLowerCase().includes(query.toLowerCase());
    });
    setExistFilter(eFilter);

    if (query === "") {
      setFilteredData([]);
      setExistFilter([]);
    } else {
    }
  }, [query, props.auctions, props.names]);

  const enterHandler = (event) => {
    const newFilter = props.auctions.filter((value, key) => {
      return value.name.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredData(newFilter);
    if (event.key === "Enter") {
      if (existFilter.length !== 0) {
        props.filterHandler(true);
        setFilteredData([]);
        navigate("/ethertx", { state: { data: existFilter } });
      } else if (filteredData.length !== 0) {
        setError(true);
        console.log("There is an existing bid going on!");
      } else {
        setError(true);
        console.log("Nothing Found!");
      }
    }
  };

  const clickHandler = (event) => {
    props.filterHandler(true);
    navigate("/ethertx", { state: { data: existFilter } });
  };

  const confirmHandler = (event) => {
    setError(!error);
  };
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

      {error && filteredData.length !== 0 && (
        <ErrorModal
          title="Existing Bid"
          message="There is an ongoing bid for the input name. Use the Ongoing Auctions Searchbar to place a bid!"
          onConfirm={confirmHandler}
        />
      )}
      {error && existFilter.length === 0 && filteredData.length === 0 && (
        <ErrorModal
          title="Doesn't exist"
          message="Input name does not exist. Start an auction on the placebid page!"
          onConfirm={confirmHandler}
        />
      )}
      {!error && existFilter.length !== 0 && (
        <div className={styles.result}>
          {existFilter.slice(0, 15).map((value, key) => {
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
