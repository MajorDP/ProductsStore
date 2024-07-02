import { useState } from "react";
import styles from "./RegisterLoginPage.module.css";
import { useRegister } from "../services/useUsers";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const emailRegexp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function RegisterPage() {
  const [email, setEmail] = useState("maj@abv.bg");
  const [username, setUsername] = useState("maj");
  const [password, setPassword] = useState("123");
  const [repass, setRepass] = useState("123");

  const { register, isLoading } = useRegister();
  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !username || !password || !repass) {
      toast.error("Please fill all fields to register.");
      return;
    }

    if (emailRegexp.test(email) === false) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (repass !== password) {
      toast.error("Password and Repeat password must be the same.");
      return;
    }

    register({ email, password, username });
  }
  return (
    <div className={styles.container}>
      <form type="submit" className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Enter your email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="re-password">Repeat password</label>
        <input
          type="password"
          placeholder="Repeat password"
          name="re-password"
          id="re-password"
          value={repass}
          onChange={(e) => setRepass(e.target.value)}
        />
        <Link to="/login">Already have an account?</Link>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Please wait..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
