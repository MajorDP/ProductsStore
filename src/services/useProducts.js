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
import toast from "react-hot-toast";

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
  const { mutate: usePostProduct, isPending: isPosting } = useMutation({
    mutationFn: (data) => postProduct(data),
    onSuccess: () => {
      toast.success(`Your product was succesfully listed for sale.`);
    },
    onError: (err) => {
      toast.error(
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
  const { mutate: deleteProductById, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      toast.success(`Product was removed successfully.`);
    },
    onError: (err) => {
      toast.error(`Product could not be removed.`);
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
    onError: () => toast.error("Product could not be listed on sale."),
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
      toast.success("Vote placed successfully");
    },
    onError: () => toast.error("Couldn't place vote."),
  });

  return { updateVote, isVoting };
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  const { mutate: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, newProduct }) => updateProduct({ id, newProduct }),
    onSuccess: () => {
      queryClient.invalidateQueries("products");
      toast.success("Product updated successfully.");
    },
    onError: () => toast.error("Couldn't update product."),
  });

  return { updateProduct, isUpdating };
}
