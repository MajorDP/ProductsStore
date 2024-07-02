import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProduct,
  useGetRating,
  useHandleVote,
  useProductById,
  usePutProductOnSale,
} from "../services/useProducts";
import styles from "./ProductInfo.module.css";
import SoldBy from "../components/SoldBy";
import { getUserBalance, getUserById } from "../API/apiUsers";
import { usePurchase } from "../services/useUsers";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "../components/Modal";

function ProductInfo() {
  const queryClient = useQueryClient();
  const [isOpenSale, setIsOpenSale] = useState(false);
  const { updateSale, isUpdating } = usePutProductOnSale();

  const navigate = useNavigate();
  const { id } = useParams();

  const { isLoading, product, error } = useProductById(id);

  const {
    rating: currentRating,
    isLoading: isGettingRating,
    error: ratingError,
  } = useGetRating(id);

  const { deleteProductById, isDeleting } = useDeleteProduct();

  const { purchase, isPurchasing } = usePurchase();

  const { updateVote, isVoting } = useHandleVote();

  if (isLoading) return <div>Loading...</div>;

  const productOwnerId = product.soldBy;

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser.id;
  const userBalance = currentUser.balance;

  function handleDelete(id) {
    deleteProductById(id);
    navigate("/browse");
  }

  function openSaleModule() {
    setIsOpenSale(true);
  }

  function handleSale(id, onSale) {
    const currentPrice = product.productPrice;

    updateSale({ id, currentPrice, onSale });
    setIsOpenSale(false);
  }

  async function handlePurchase(productOwnerId, currentUserId) {
    const ownerUser = await getUserById(productOwnerId);
    const price = product.productPrice;

    purchase(
      { ownerUser, currentUser, price },
      {
        onSettled: () => {
          queryClient.invalidateQueries("userBal");
          getUserBalance(currentUserId);
          navigate("/browse");
        },
      }
    );
  }

  function handleVote(id, currentRating, vote) {
    currentRating = currentRating.productRating;

    updateVote({ id, currentRating, vote });
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <h3>{product.productName}</h3>
        <img src={product.productImg} />
        {!isGettingRating && <p> ⭐Rating: {currentRating.productRating}</p>}
        <div>
          {productOwnerId !== currentUserId ? (
            <>
              <button
                disabled={isVoting}
                onClick={() => handleVote(id, currentRating, -0.1)}
              >
                Downvote
              </button>
              <button
                disabled={isVoting}
                onClick={() => handleVote(id, currentRating, +0.1)}
              >
                Upvote
              </button>
            </>
          ) : (
            <Link to={`/browse/edit?id=${id}`} className={styles.editBtn}>
              Edit
            </Link>
          )}
        </div>
      </div>
      <div className={styles.rightSide}>
        <SoldBy soldBy={product.soldBy} />
        <p>
          Description:{" "}
          {product.productDesc !== null
            ? product.productDesc
            : "No description yet"}
        </p>
        {isOpenSale && (
          <Modal>
            <h3>
              {product.onSale === true ? (
                <>
                  Remove <span>{product.productName}</span> from sale?
                </>
              ) : (
                <>
                  Place <span>{product.productName}</span> on sale?
                </>
              )}
            </h3>

            {product.onSale == true ? (
              <>
                <p>
                  Are you sure you want to remove{" "}
                  <span>{product.productName}</span>'s <span>15% sale</span>{" "}
                  (this sale can be reverted at any time)?
                </p>
                <button onClick={() => handleSale(id, true)}>Yes</button>
              </>
            ) : (
              <>
                <p>
                  Are you sure you want to place{" "}
                  <span>{product.productName}</span> on <span>15% sale</span>
                  (this sale can be reverted at any time)?
                </p>
                <button
                  disabled={isUpdating}
                  onClick={() => handleSale(id, false)}
                >
                  Yes
                </button>
              </>
            )}
            <button disabled={isUpdating} onClick={() => setIsOpenSale(false)}>
              No
            </button>
          </Modal>
        )}
        {/*TODO: ADD DESCRIPTION IN DATABASE AND IN SELLPRODUCT.JSX */}
        <p>💲Price: {product.productPrice.toFixed(2)}$</p>
        {product.soldBy === currentUserId ? (
          <div className={styles.ownerButtons}>
            <button disabled={isDeleting} onClick={() => handleDelete(id)}>
              Remove from store
            </button>
            <button onClick={() => openSaleModule()}>
              {product.onSale === true
                ? "Remove from sale (15%)"
                : "Place on sale (15%)"}
            </button>
          </div>
        ) : userBalance < product.productPrice ? (
          <p>Not enough funds</p>
        ) : (
          <button
            disabled={isPurchasing}
            onClick={() => handlePurchase(productOwnerId, currentUserId)}
          >
            Buy
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductInfo;
