import styles from "./Mainpage.module.css";
import Button from "react-bootstrap/Button";
import { useState } from "react";

const Mainpage = () => {
  const [rentalPeriod, setRentalPeriod] = useState(1);

  const randomtxt =
    "Breastfeeding is good for babies and moms. Infants that are breastfed get antibodies from their mothers against common illnesses. Breastfed babies have less chance of being obese as an adult. Breastfeeding a baby lets the infant-mother pair bond in a very unique way. Mother’s who breastfeed lower their chances of developing breast cancer. Usually, mothers who breastfeed lose their pregnancy weight more quickly and easily. The benefits of breastfeeding are numerous.";
  return (
    <div className={`${styles.mainpage}`}>
      <div className={`${styles.topbar}`}>
        <p>Yourname.eth</p>
        <p>Available</p>
        <Button className={`${styles.registerbtn}`}>Register</Button>
      </div>
      <div className={`${styles.rentalprice}`}>
        <div className={`${styles.rental}`}>
          <p>Rental Period:</p>
          <Button
            type="button"
            className={`btn btn-secondary btn-sm ${styles.plusminusbtn}`}
            onClick={() => {
              setRentalPeriod(rentalPeriod - 1);
            }}
          >
            -
          </Button>
          <p>{rentalPeriod}</p>

          <Button
            type="button"
            className={`btn btn-secondary btn-sm ${styles.plusminusbtn}`}
            onClick={() => {
              setRentalPeriod(rentalPeriod + 1);
            }}
          >
            +
          </Button>
        </div>
        <p>Price per amount:</p>
      </div>
      <div className={`${styles.steps}`}>
        <p>{randomtxt}</p>
        <p>{randomtxt}</p>
        <p>{randomtxt}</p>
      </div>
      <div className={`${styles.bottombtn}`}>
        <Button type="button" className={`btn btn-light ${styles.cancelbtn}`}>
          Cancel
        </Button>
        <Button
          type="button"
          className={`btn btn-primary ${styles.reqregisterbtn}`}
        >
          Request to Register
        </Button>
      </div>
    </div>
  );
};

export default Mainpage;
