import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProduct,
  getProductById,
  getProducts,
  getRating,
  handleVote,
  postProduct,
  putProductOnSale,
} from "../API/apiProducts";

export function useProducts() {
  const {
    isLoading,
    data: products,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  return { isLoading, products, error };
}

export function usePostProducts() {
  const { mutate: usePostProduct, isLoading: isPosting } = useMutation({
    mutationFn: (data) => postProduct(data),
    onSuccess: () => {
      alert("posted");
      window.location.reload();
    },
    onError: (err) => {
      alert(
        "There was an error with either the product's details or image, please double check before posting!"
      );
    },
  });

  return { usePostProduct, isPosting };
}

export function useProductById(id) {
  const {
    isLoading,
    data: product,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  return { isLoading, product, error };
}

export function useDeleteProduct() {
  const { mutate: deleteProductById, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      alert(`Product was deleted successfully!`);
      window.location.reload();
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  return { deleteProductById, isDeleting };
}

export function usePutProductOnSale() {
  const queryClient = useQueryClient();

  const { mutate: updateSale, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, currentPrice, onSale }) =>
      putProductOnSale({ id, currentPrice, onSale }),
    onSuccess: () => queryClient.invalidateQueries("product"),
    onError: () => alert("failed"),
  });

  return { updateSale, isUpdating };
}

//RATING QUERIES
export function useGetRating(id) {
  const {
    isLoading,
    data: rating,
    error,
  } = useQuery({
    queryKey: ["currentProdRating"],
    queryFn: () => getRating(id),
  });

  return { rating, isLoading, error };
}

export function useHandleVote() {
  const queryClient = useQueryClient();

  const { mutate: updateVote, isLoading: isVoting } = useMutation({
    mutationFn: ({ id, currentRating, vote }) =>
      handleVote({ id, currentRating, vote }),
    onSuccess: () => {
      queryClient.invalidateQueries("currentProdRating");
      alert("Voted Successfully");
    },
    onError: () => console.log("FAIL"),
  });

  return { updateVote, isVoting };
}
