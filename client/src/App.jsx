import styles from './App.module.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar.jsx"
import Sidebar from './components/Sidebar';
import Maincontent from "./components/Maincontent";
import { useContext } from 'react';
import { DnsContext } from './context/DnsContext';

function App() {
  const {connected, connectWallet} = useContext(DnsContext);

  return (
    <div className={`${styles.App}`}>
      <Navbar connected = {connected} connectWallet={connectWallet}/>
      <Sidebar/>
      <Maincontent/>
    </div>
  );
}
export default App;
