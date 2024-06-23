import { Link } from "react-router-dom";
import styles from "./Services.module.css";
function Services() {
  return (
    <div className={styles.container}>
      <h1>Services:</h1>
      <p>Please, take your time to see what our website has to offer!</p>
      <ul>
        <li>
          <Link to="/browse">Browse</Link>
          <p>Browse our wide variety of products</p>
        </li>
        <li>
          <Link to="/browse/sell">Sell</Link>
          <p>List a product for sale</p>
        </li>
        <li>
          <Link to="/browse?sale=true">Sale</Link>{" "}
          {/*TODO: MAKE SALE FUNCTIONALITY */}
          <p>Check out our current sales!</p>
        </li>
      </ul>
    </div>
  );
}

export default Services;
