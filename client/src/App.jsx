import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar.jsx"
import Sidebar from './components/Sidebar';
import Mainpage from "./components/Mainpage";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Sidebar/>
      <Mainpage/>
    </div>
  );
}
export default App;
