import React,{useRef} from 'react';
import styles from "./App.module.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import Navbar2 from "./components/Navbar/Navbar.jsx";
import BiddingList from "./components/Biddinglist/Biddinglist.jsx";
import Mybiddings from "./components/Mybiddings/Mybiddings";
import Connectpage from "./components/Connectpage/Connectpage";
import Placebid from "./components/Placebid/Placebid";
import Ethertx from "./components/Ethertx/Ethertx";
import Mynames from "./components/Mynames/Mynames";
import InputModal from './components/InputModal/InputModal';

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
  const { connected, connectWallet } = useContext(DnsContext);
  const scrollRef = useRef();
  const executeScroll = () => {
    scrollRef.current.scrollIntoView();
  }


  return (
    <BrowserRouter>
      <Navbar2 connected={connected} connectWallet={connectWallet} scrollRef={scrollRef}/>
      <Routes>
        <Route path="/" element={<BiddingList connected={connected} />}/>
        <Route path="/connect" element={<Connectpage executeScroll={executeScroll} />}/>
        <Route path="/placebid" element={<Placebid connected={connected} />}/>
        <Route path="/mynames" element={<Mynames connected={connected} />}/>
        <Route path="/mybiddings" element={<Mybiddings connected={connected} />}/>
        <Route path="/ethertx" element={<Ethertx connected={connected} />}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
