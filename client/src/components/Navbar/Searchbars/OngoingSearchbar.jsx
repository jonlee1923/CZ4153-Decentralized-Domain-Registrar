// States, styles, etc..
import React, { useState, useEffect } from "react";
import styles from "./OngoingSearchbar.module.css";
import { useNavigate } from "react-router-dom";

// Bootstrap components
import Form from "react-bootstrap/Form";

// React components
import ErrorModal from "../../ErrorModal/ErrorModal";

const Searchbar = (props) => {
  // Variables / Constant declaration
  const navigate = useNavigate();

  // States
  const [query, setQuery] = useState(""); // State to hold user's query
  const [filteredData, setFilteredData] = useState([]); // State to hold array of filtered data
  const [existFilter, setExistFilter] = useState([]); // State to hold array of existing registered domain names
  const [error, setError] = useState(false); // State to control ErrorModal prompt

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

  // Functions
  const filterHandler = (event) => {
    // Set query based on user input
    setQuery(event.target.value);
  };
  const enterHandler = (event) => {
    // Actions that occur when enter key is pressed
    const eFilter = props.names.filter((value, key) => {
      return value.name.toLowerCase().includes(query.toLowerCase());
    });
    setExistFilter(eFilter);
    if (event.key === "Enter") {
      if (!props.connected) {
        setError(true);
        console.log("Not connected!");
      } else if (query === "") {
        setFilteredData([]);
        setExistFilter([]);
      } else if (filteredData.length !== 0) {
        props.filterHandler(true);
        setExistFilter([]);
        navigate("/", { state: { data: filteredData } });
      } else if (existFilter.length !== 0) {
        setError(true);
        console.log("Name already exists!");
      } else {
        setError(true);
        console.log("Nothing Found!");
      }
    }
  };

  const clickHandler = (event) => {
    // Actions that occur when filtered data is clicked
    props.filterHandler(true);
    navigate("/", { state: { data: filteredData } });
  };

  const confirmHandler = (event) => {
    // To control error state
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
      {error && !props.connected && (
        <ErrorModal
          title="Not Connected"
          message="Please connect to your MetaMask wallet before making a search!"
          onConfirm={confirmHandler}
        />
      )}
      {error && existFilter.length !== 0 && props.connected && (
        <ErrorModal
          title="Owned name"
          message="Input name is already owned by another user!"
          onConfirm={confirmHandler}
        />
      )}
      {error &&
        filteredData.length === 0 &&
        existFilter.length === 0 &&
        props.connected && (
          <ErrorModal
            title="Doesn't exist"
            message="Input name does not exist. Start an auction on the placebid page!"
            onConfirm={confirmHandler}
          />
        )}
      {!error && filteredData.length !== 0 && props.connected && (
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
