import React,{useRef,useState,useEffect} from 'react';
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
  const { connected, connectWallet, bid, getAuctions, endAuction  } = useContext(DnsContext);
  const [auctions,setAuctions] = useState([]);
  const scrollRef = useRef();
  const executeScroll = () => {
    scrollRef.current.scrollIntoView();
  }  
  useEffect(() => {
    const getAuctionsHandler = async () => {
      try {
        const data = await getAuctions();

        const auctionsMapped = await Promise.all(
          data.map(async (i) => {
            const unixStart = i.start.toNumber();
            let startDate = new Date(unixStart * 1000);
            startDate = startDate.toUTCString();

            const unixEnd = i.revealEnd.toNumber();
            let endDate = new Date(unixEnd * 1000);
            endDate = endDate.toUTCString();

            const unixTime = i.biddingEnd.toNumber();
            let date = new Date(unixTime * 1000);
            date = date.toUTCString();

            let auctionItem = {
              auctionId: i.auctionId.toNumber(),
              name: i.name,
              start: startDate,
              biddingEnd: date,
              revealEnd: endDate,
              ended: i.ended,
            };
            return auctionItem;
          })
        );
        // setLoading(true);
        setAuctions(auctionsMapped);
        // setLoading(false);
        console.log("app auctions",auctions);
      } catch (err) {
        console.log("Something went wrong!");
      }
    };

    getAuctionsHandler();

    // console.log(auctions);
  }, [getAuctions]);


  return (
    <BrowserRouter>
      <Navbar2 connected={connected} connectWallet={connectWallet} scrollRef={scrollRef} auctions={auctions}/>
      <Routes>
        <Route path="/" element={<BiddingList connected={connected} auctions={auctions}/>}/>
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
