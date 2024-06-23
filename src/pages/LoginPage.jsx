import { useState } from "react";
import styles from "./RegisterLoginPage.module.css";
import { useLogin } from "../services/useUsers";
import Header from "../components/Header";
import { Link } from "react-router-dom";
function LoginPage() {
  const [email, setEmail] = useState("asura@abv.bg");
  const [password, setPassword] = useState("123");

  const { login, isLoading } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;

    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
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
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to="/register">Don't have an account yet?</Link>
        <button type="submit" disabled={isLoading}>
          Log in
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
