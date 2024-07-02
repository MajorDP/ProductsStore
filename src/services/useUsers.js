import toast from "react-hot-toast";
import {
  getUserBalance,
  getUserById,
  login as loginAPI,
  logout as logoutAPI,
  updateUser,
  updateUserBalance,
  userPurchase,
} from "../API/apiUsers";
import { register as registerAPI } from "../API/apiUsers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const navigate = useNavigate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }) => loginAPI({ email, password }),
    onSuccess: () => {
      toast.success("Login was successful, welcome.");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { login, isLoading: isPending };
}

export function useRegister() {
  const navigate = useNavigate();

  const { mutate: register, isPending } = useMutation({
    mutationFn: ({ email, password, username }) =>
      registerAPI({ email, password, username }),
    onSuccess: () => {
      toast.success("Successfully registered, welcome.");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { register, isLoading: isPending };
}

export function useLogout() {
  const navigate = useNavigate();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      navigate("/");
      window.location.reload();
    },
    onError: (err) => {},
  });

  return { logout, isLoading };
}

export function useUserById(id) {
  const {
    isLoading,
    data: user,
    error,
  } = useQuery({
    queryKey: ["userById", id],
    queryFn: () => getUserById(id),
  });

  return { user, isLoading };
}

export function usePurchase() {
  const { mutate: purchase, isLoading: isPurchasing } = useMutation({
    mutationFn: ({ ownerUser, currentUser, price }) => {
      userPurchase({ ownerUser, currentUser, price });
    },
    onSuccess: () => {
      toast.success("Purchase was successful.");
    },
    onError: (err) => {
      toast.error("Could not purchase this product.");
    },
  });

  return { purchase, isPurchasing };
}

export function useGetUserBalance(id) {
  const {
    isLoading: isGettingBalance,
    data: userBal,
    error,
  } = useQuery({
    queryKey: ["userBal"],
    queryFn: () => getUserBalance(id),
  });

  return { isGettingBalance, userBal };
}

export function useUpdateUser() {
  const { mutate: update, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, newUser }) => updateUser({ id, newUser }),
    onSuccess: () => toast.success("User updated."),
  });
  return { update, isUpdating };
}

export function useUpdateUserBalance() {
  const { mutate: updateBalance, isLoading: isUpdatingBalance } = useMutation({
    mutationFn: ({ id, balance }) => updateUserBalance({ id, balance }),
    onSuccess: () => toast.success("User updated."),
  });
  return { updateBalance, isUpdatingBalance };
}
