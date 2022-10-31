// States, styles, etc..
import React, { useRef, useState, useEffect,useContext } from "react";
import styles from "./App.module.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { DnsContext } from "./context/DnsContext";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// React components
import Navbar2 from "./components/Navbar/Navbar.jsx";
import Auctions from "./components/Auctions/Auctions.jsx";
import Mybiddings from "./components/Mybiddings/Mybiddings";
import Connectpage from "./components/Connectpage/Connectpage";
import Placebid from "./components/Placebid/Placebid";
import DomainNames from "./components/DomainNames/DomainNames";
import Mynames from "./components/Mynames/Mynames";


function App() {
  // States
  const {
    connected,
    connectWallet,
    getAuctions,
    getAllDomains,
  } = useContext(DnsContext);

  const [auctions, setAuctions] = useState([]); // State for array of ongoing auctions
  const [names, setNames] = useState([]); // State for array of registered domain names
  const [filter, setFilter] = useState(false); // State for checking if any searches occurred
  const scrollRef = useRef(); 
  
  useEffect(() => { 
    const getAuctionsHandler = async () => { // Get current ongoing auctions
      try {
        const mappedData = await getAuctions();
        setAuctions(mappedData);
      } catch (err) {
        console.log("Something went wrong!");
      }
    };

    const getAllNamesHandler = async () => { // Get registered domain names
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

  // Functions 
  const executeScroll = () => { // For onClick's scrolling effect
    scrollRef.current.scrollIntoView();
  };

  const filterHandler = (check) => { // To set filter
    setFilter(check);
  };

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
            <Auctions
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
          element={
            <DomainNames
              connected={connected}
              names={names}
              filterHandler={filterHandler}
              filter={filter}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
