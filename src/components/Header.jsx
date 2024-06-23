import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useLogout } from "../services/useUsers";
import { useEffect, useState } from "react";

function Header() {
  const { logout, isLoading } = useLogout();

  const [username, setUsername] = useState(null);
  useEffect(function () {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user === null) setUsername(null);
    else if (user.username) setUsername(user.email);
  });

  return (
    <nav className={styles.nav}>
      <Link to="/">
        <img
          src="../../public/StoreIcon.png"
          alt="Store pic"
          className={styles.img}
        />
      </Link>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {username !== null ? (
          <>
            <li>
              <Link to="browse">Browse</Link>
            </li>
            <li>
              <Link to="user">User</Link>
            </li>
            <li>
              <Link onClick={logout}>Log out</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Log in</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Header;
