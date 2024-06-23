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

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginAPI({ email, password }),
    onSuccess: () => {
      navigate("/");
    },
    onError: (err) => {
      console.log("ERROR ", err);
    },
  });

  return { login, isLoading };
}

export function useRegister() {
  const navigate = useNavigate();

  const { mutate: register, isLoading } = useMutation({
    mutationFn: ({ email, password, username }) =>
      registerAPI({ email, password, username }),
    onSuccess: () => {
      navigate("/");
    },
    onError: (err) => {
      console.log("ERROR ", err);
    },
  });

  return { register, isLoading };
}

export function useLogout() {
  const navigate = useNavigate();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      navigate("/");
      window.location.reload();
    },
    onError: (err) => {
      console.log("ERROR ", err);
    },
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
      alert("Purchase was successful.");
    },
    onError: (err) => {
      console.log(err.message);
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
    onSuccess: () => alert("User updated."),
  });
  return { update, isUpdating };
}

export function useUpdateUserBalance() {
  const { mutate: updateBalance, isLoading: isUpdatingBalance } = useMutation({
    mutationFn: ({ id, balance }) => updateUserBalance({ id, balance }),
    onSuccess: () => alert("User updated."),
  });
  return { updateBalance, isUpdatingBalance };
}
