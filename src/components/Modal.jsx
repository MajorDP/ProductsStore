import styles from "./Modal.module.css";
function Modal({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export default Modal;
