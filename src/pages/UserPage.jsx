import { useState } from "react";
import styles from "./UserPage.module.css";
import { useUpdateUser, useUpdateUserBalance } from "../services/useUsers";
import { useNavigate } from "react-router-dom";

function UserPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { update, isUpdating } = useUpdateUser();
  const { updateBalance, isUpdatingBalance } = useUpdateUserBalance();

  const [balance, setBalance] = useState("");
  const id = JSON.parse(localStorage.getItem("user")).id;
  const currentBalance = JSON.parse(localStorage.getItem("user")).balance;

  function handleUpdate(username, email, password) {
    const newUserInfo = [username, email, password];

    const newUser = {};
    newUserInfo.forEach((el, id) => {
      if (el !== "") {
        if (id === 0) newUser["username"] = el;
        if (id === 1) newUser["email"] = el;
        if (id === 2) newUser["password"] = el;
      }
    });

    update({ id, newUser });
    setUsername("");
    setEmail("");
    setPassword("");
  }

  function handleFunds(balance) {
    balance = Number(balance).toFixed(2);
    updateBalance({ id, balance });
    setBalance("");
  }

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <span className={styles.credentials}>
          <p>Update your account:</p>
          <input
            value={username}
            placeholder="New username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            value={email}
            placeholder="New email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            value={password}
            placeholder="New password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            disabled={username === "" && password === "" && email === ""}
            onClick={() => handleUpdate(username, email, password)}
          >
            Save Changes
          </button>
          {/* TODO: turn into a form*/}
        </span>
        <span className={styles.funds}>
          <p>Current wallet: {currentBalance}$</p>
          <input
            value={balance}
            type="number"
            placeholder="Add funds here"
            onChange={(e) => setBalance(e.target.value)}
          />
          <button
            disabled={balance === ""}
            onClick={() => handleFunds(balance)}
          >
            Add funds
          </button>
          {/* TODO: separately from account credentials adds funds, simulating payment*/}
        </span>
      </div>
    </div>
  );
}

export default UserPage;
