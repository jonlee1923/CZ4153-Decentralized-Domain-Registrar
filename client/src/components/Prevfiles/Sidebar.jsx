import styles from "./Sidebar.module.css";
import {CardList,ArchiveFill,ListColumns} from 'react-bootstrap-icons';

const Sidebar = (props) => {

  return (
    <div className={`${styles.sidebar} ${!props.connected && styles.notconnected}`}>
      <ul className={`${styles.list}`}>
        <li><ArchiveFill/><a href="#mynames">      My Names</a></li>
        <li><CardList/><a href="#fav">      My Biddings</a></li>
        <li><ListColumns/><a href="#about">      Bidding List</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
