import styles from "./BrowsePage.module.css";
import { useProducts } from "../services/useProducts";
import Error from "../components/Error";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetUserBalance } from "../services/useUsers";

function BrowsePage() {
  const navigate = useNavigate();
  const { isLoading, products, error } = useProducts();

  const [sortBy, setSortBy] = useState("default");
  const [searchBy, setSearchBy] = useState("");

  //PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const endRange = currentPage * 5;
  const starterRange = endRange - 5;

  let [searchParams, setSearchParams] = useSearchParams();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = JSON.parse(localStorage.getItem("user")).id;

  const { isGettingBalance, userBal } = useGetUserBalance(currentUserId);

  if (isLoading) return <div>Loading</div>;
  if (error) return <Error />;

  let searchedProducts = products.slice(); //default for searchedProducts is all products so that they can be sorted later regardless of wether there are searched or not
  let sortedProducts;

  //searching
  if (searchBy !== "")
    searchedProducts = products
      .slice()
      .filter((product) =>
        product.productName.toLowerCase().includes(searchBy)
      );

  //sorting
  if (searchParams.get("sale") === "true" || sortBy === "onSale") {
    sortedProducts = searchedProducts.sort((a, b) => {
      if (a.onSale === true && b.onSale === false) {
        return -1; // a comes first
      } else if (b.onSale === true && a.onSale === false) {
        return 1; // b comes first
      }
    });
  }
  if (sortBy === "default") sortedProducts = searchedProducts;

  if (sortBy === "alphabetical")
    sortedProducts = searchedProducts.sort((a, b) =>
      a.productName.localeCompare(b.productName)
    );

  if (sortBy.includes("price")) {
    const [sortValue, direction] = sortBy.split("-");
    const modifier = direction === "asc" ? 1 : -1;
    sortedProducts = searchedProducts.sort(
      (a, b) => (a.productPrice - b.productPrice) * modifier
    );
  }

  if (sortBy === "rating")
    sortedProducts = searchedProducts.sort(
      (a, b) => b.productRating - a.productRating
    );

  if (sortBy === "userProds") {
    sortedProducts = searchedProducts.sort((a, b) => {
      if (a.soldBy === currentUserId && b.id !== currentUser) {
        return -1; // a comes first
      } else if (b.soldBy === currentUserId && a.id !== currentUser) {
        return 1; // b comes first
      }
    });
  }

  if (sortBy === "userSales") {
    sortedProducts = searchedProducts.sort((a, b) => {
      // If both products are on sale or both are not on sale, prioritize based on the seller
      if (a.onSale === true) {
        if (a.soldBy === currentUserId && b.id !== currentUser) {
          return -1; // a comes first
        } else if (b.soldBy === currentUserId && a.id !== currentUser) {
          return 1; // b comes first
        }
      } else {
        // If one product is on sale and the other is not, prioritize the on-sale product
        return a.onSale ? -1 : 1;
      }
    });
  }

  //PAGINATION
  //TAKING THE CURRENT AMOUNT OF LISTED PRODUCTS ON THE PAGE
  const currentShown = sortedProducts.filter(
    (el, index) => index >= starterRange && index < endRange
  );

  //CHECKING IF THERE ARE OTHER PRODUCTS TO LIST ON THE NEXT PAGE
  const nextToShow = sortedProducts.filter(
    (el, index) => index >= starterRange + 5 && index < endRange + 5
  );

  return (
    <div className={styles.container}>
      <p>Your current balance: {isGettingBalance ? "Loading..." : userBal}$</p>
      <div className={styles.search}>
        <div>
          <input
            placeholder="Search by name"
            onChange={(e) => {
              setSearchBy(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            onChange={(e) => {
              setSortBy(e.target.value);

              setCurrentPage(1);
            }}
          >
            <option value={"default"}>Sort by default</option>
            <option value={"alphabetical"}>Sort by alphabetical order</option>
            <option value={"price-desc"}>Sort by price (Descending)</option>
            <option value={"price-asc"}>Sort by price (Ascending)</option>
            <option value={"rating"}>Sort by rating (Best)</option>
            <option value={"onSale"}>Products on sale</option>
            <option value={"userProds"}>Your products</option>
            <option value={"userSales"}>Your sales</option>
          </select>
          <Link to="sell">Sell a product</Link>
        </div>
      </div>
      <div className={styles.products}>
        <ul>
          {sortedProducts.map(
            (product, index) =>
              index >= starterRange &&
              index < endRange && (
                <li
                  key={product.id}
                  className={
                    product.soldBy === currentUserId
                      ? styles.ownedByUser
                      : styles.notOwnedByUser
                  }
                  onClick={() => navigate(`/browse/${product.id}`)}
                >
                  <span>
                    <img src={product.productImg} alt="Product" />
                    <h3>{product.productName}</h3>
                  </span>
                  <p
                    className={styles.price}
                    style={product.onSale === true ? { color: "red" } : {}}
                  >
                    💲price: {product.productPrice.toFixed(2)}$
                  </p>
                  <p>⭐rating: {product.productRating}</p>
                  <p className={styles.categories}>
                    categories: {product.productCategories.join(", ")}
                  </p>
                </li>
              )
          )}
        </ul>
        {/* PAGINATION */}
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <p>
            Showing {currentShown.length} out of {sortedProducts.length}{" "}
            products (Page: {currentPage})
          </p>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={nextToShow.length === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default BrowsePage;
