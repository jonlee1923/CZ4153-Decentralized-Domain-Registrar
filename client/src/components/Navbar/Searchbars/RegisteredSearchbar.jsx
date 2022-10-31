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
    const eFilter = props.names.filter((value, key) => {
      return value.name.toLowerCase().includes(query.toLowerCase());
    });

    if (query === "") {
      setFilteredData([]);
      setExistFilter([]);
    } else {
      setExistFilter(eFilter);
    }
  }, [query, props.auctions, props.names]);

  // Functions
  const filterHandler = (event) => {
    // Set query based on user input
    setQuery(event.target.value);
  };

  const enterHandler = (event) => {
    // Actions that occur when enter key is pressed
    const newFilter = props.auctions.filter((value, key) => {
      return value.name.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredData(newFilter);
    if (event.key === "Enter") {
      if (!props.connected) {
        setError(true);
        console.log("Not connected!");
      } else if (existFilter.length !== 0) {
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
    // Actions that occur when filtered data is clicked
    props.filterHandler(true);
    navigate("/ethertx", { state: { data: existFilter } });
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
      {error && filteredData.length !== 0 && props.connected && (
        <ErrorModal
          title="Existing Bid"
          message="There is an ongoing bid for the input name. Use the Ongoing Auctions Searchbar to place a bid!"
          onConfirm={confirmHandler}
        />
      )}
      {error &&
        existFilter.length === 0 &&
        filteredData.length === 0 &&
        props.connected && (
          <ErrorModal
            title="Doesn't exist"
            message="Input name does not exist. Start an auction on the placebid page!"
            onConfirm={confirmHandler}
          />
        )}
      {!error && existFilter.length !== 0 && props.connected && (
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
