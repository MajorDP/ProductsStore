import { useUserById } from "../services/useUsers";
import styles from "./SoldBy.module.css";

function SoldBy({ soldBy }) {
  const { user, isLoading: isGettingUser, error } = useUserById(soldBy);
  if (isGettingUser) return <div>Loading...</div>;
  if (error) {
    return <h3>Error getting user</h3>;
  }

  const soldByUser = user.user.username;
  return (
    <h3 className={styles.error}>
      Sold by: {soldByUser.charAt(0).toUpperCase() + soldByUser.slice(1)}
    </h3>
  );
}

export default SoldBy;
