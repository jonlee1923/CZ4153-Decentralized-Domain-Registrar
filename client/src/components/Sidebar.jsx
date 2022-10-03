import styles from "./Sidebar.module.css";
import {HeartFill,ArchiveFill,ChatLeftDotsFill} from 'react-bootstrap-icons';
import {useState} from "react";

const Sidebar = () => {

  return (
    <div className={`${styles.sidebar}`}>
      <ul className={`${styles.list}`}>
        <li><ArchiveFill/><a href="#mynames">      My Names</a></li>
        <li><HeartFill/><a href="#fav">      Favorites</a></li>
        <li><ChatLeftDotsFill/><a href="#about">      About</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
