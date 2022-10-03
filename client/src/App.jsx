import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar.jsx"
import Sidebar from './components/Sidebar';
import Mainpage from "./components/Mainpage";
import { useContext } from 'react';
import { DnsContext } from './context/DnsContext';

function App() {
  const {connected, connectWallet} = useContext(DnsContext);

  return (
    <div className="App">
      <Navbar connected = {connected} connectWallet={connectWallet}/>
      <Sidebar/>
      <Mainpage/>
    </div>
  );
}
export default App;
