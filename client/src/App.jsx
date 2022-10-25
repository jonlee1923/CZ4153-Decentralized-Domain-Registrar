import React, { useRef, useState, useEffect } from "react";
import styles from "./App.module.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import Navbar2 from "./components/Navbar/Navbar.jsx";
import BiddingList from "./components/Biddinglist/Biddinglist.jsx";
import Mybiddings from "./components/Mybiddings/Mybiddings";
import Connectpage from "./components/Connectpage/Connectpage";
import Placebid from "./components/Placebid/Placebid";
import Ethertx from "./components/Ethertx/Ethertx";
import Mynames from "./components/Mynames/Mynames";
import InputModal from "./components/InputModal/InputModal";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import { useContext } from "react";
import { DnsContext } from "./context/DnsContext";

function App() {
  const {
    connected,
    connectWallet,
    bid,
    getAuctions,
    endAuction,
    getAllDomains,
  } = useContext(DnsContext);
  const [auctions, setAuctions] = useState([]);
  const [names, setNames] = useState([]);
  const [filter, setFilter] = useState(false);
  const scrollRef = useRef();
  const executeScroll = () => {
    scrollRef.current.scrollIntoView();
  };

  console.log("appfilter",filter);
  useEffect(() => {
    const getAuctionsHandler = async () => {
      try {
        const mappedData = await getAuctions();
        setAuctions(mappedData);
      } catch (err) {
        console.log("Something went wrong!");
      }
    };

    const getAllNamesHandler = async () => {
      try {
        const mappedNames = await getAllDomains();
        setNames(mappedNames);
      } catch (err) {
        console.log("Something went wrong!");
      }
    };
    getAuctionsHandler();
    getAllNamesHandler();
  }, [getAuctions, getAllDomains]);

  const filterHandler = (check) => {
    setFilter(check);
  };
  console.log("app names", names);
  console.log("app auctions", auctions);

  return (
    <BrowserRouter>
      <Navbar2
        connected={connected}
        connectWallet={connectWallet}
        scrollRef={scrollRef}
        auctions={auctions}
        names={names}
        filter={filter}
        filterHandler={filterHandler}
      />
      <Routes>
        <Route
          path="/"
          element={
            <BiddingList
              connected={connected}
              auctions={auctions}
              filterHandler={filterHandler}
              filter={filter}
            />
          }
        />
        <Route
          path="/connect"
          element={<Connectpage executeScroll={executeScroll} />}
        />
        <Route path="/placebid" element={<Placebid connected={connected} />} />
        <Route path="/mynames" element={<Mynames connected={connected} />} />
        <Route
          path="/mybiddings"
          element={<Mybiddings connected={connected} />}
        />
        <Route
          path="/ethertx"
          element={<Ethertx connected={connected} names={names} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
