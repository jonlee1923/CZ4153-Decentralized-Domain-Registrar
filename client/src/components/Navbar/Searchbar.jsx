import React, { useState,useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import styles from "./Searchbar.module.css";
import data from "./data.json";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const filterHandler = (event) => {
    setQuery(event.target.value);

  };

  useEffect(()=>{
    const newFilter = data.filter((value) => {
        return value.title.toLowerCase().includes(query.toLowerCase());
      });
  
      if (query === "") {
        setFilteredData([]);
      } else {
        setFilteredData(newFilter);
      }
  },[query]);

  const clearInput = () => {
    setQuery("");
    setFilteredData([]);
  };
  return (
    <React.Fragment>
      <Form.Control
        type="search"
        placeholder="Enter Search"
        className={`me-2 ${styles.searchbar}`}
        aria-label="Search"
        value={query}
        onChange={filterHandler}
      />
      <Button variant="none" className={`${styles.searchbtn}`}>
        Search
      </Button>
      {filteredData.length !== 0 && (
        <div className={styles.result}>
          {filteredData.slice(0, 15).map((value, key) => {
            return <p>{value.title}</p>;
          })}
        </div>
      )}
    </React.Fragment>
  );
};

export default Searchbar;
