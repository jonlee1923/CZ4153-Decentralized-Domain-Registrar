import styles from './App.module.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar.jsx"
import Sidebar from './components/Sidebar';
import Maincontent from "./components/Maincontent";
import { useContext,useState } from "react";
import { DnsContext } from "./context/DnsContext";

function App() {
  const { connectWallet, connected } = useContext(DnsContext);

  return (
    <div className="App">
      <Navbar connected = {connected} connectWallet = {connectWallet} />
      <Sidebar/>
      <Maincontent/>
    </div>
  );
}
export default App;
