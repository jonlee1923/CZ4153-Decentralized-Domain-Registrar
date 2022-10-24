import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import styles from "./Searchbar.module.css";
import data from "./data.json";
import { useNavigate } from "react-router-dom";
import { CodeSlash } from "react-bootstrap-icons";

const Searchbar = (props) => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const filterHandler = (event) => {
    setQuery(event.target.value);
  };
  console.log("searchbar auctions", props.auctions);
  console.log("searchbar filter", filteredData);
  useEffect(() => {
    const newFilter = props.auctions.filter((value, key) => {
      return value.name.toLowerCase().includes(query.toLowerCase());
    });
    if (query === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  }, [query, props.auctions]);

  const clearInput = () => {
    setQuery("");
    setFilteredData([]);
  };

  const enterHandler = (event) => {
    if (event.key === "Enter") {
      if (filteredData.length === 0) {
        console.log("Nothing Found!");
      } else {
        navigate("/", { state: { data: filteredData } });
      }
    }
  };

  const clickHandler = (event) => {
    navigate("/", { state: { data: filteredData } });
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
      {/* <Button variant="none" className={`${styles.searchbtn}`}>
        Search
      </Button> */}
      {filteredData.length !== 0 && (
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
