import supabase from "./supabase";

export async function register({ email, password, username }) {
  console.log(email, password, username);
  const { data, error } = await supabase
    .from("userAccounts")
    .insert([
      {
        email,
        password,
        balance: 100,
        username,
      },
    ])
    .select()
    .single();

  console.log(data);
  if (error) throw new Error(error.message);

  localStorage.setItem("user", JSON.stringify(data));

  return data;
}

export async function login({ email, password }) {
  let { data: userAccount, error } = await supabase
    .from("userAccounts")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error) console.log(error.message);

  localStorage.setItem("user", JSON.stringify(userAccount));
}

export async function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("userBalance");
}

export async function getUserById(id) {
  let { data, error } = await supabase
    .from("userAccounts")
    .select("*")
    .eq("id", id);

  if (error) {
    console.log(error.message);
  }
  const user = data[0];
  return { user };
}

export async function userPurchase({ ownerUser, currentUser, price }) {
  try {
    const ownerUserId = ownerUser.user.id;
    const currentUserId = currentUser.id;

    const ownerUserObj = {
      ...ownerUser.user,
    };

    const currentUserObj = {
      ...currentUser,
      balance: Number((currentUser.balance - price).toFixed(2)),
    };

    const { error: ownerBalanceError } = await supabase
      .from("userAccounts")
      .update({ balance: ownerUserObj.balance + price })
      .eq("id", ownerUserId);

    const { data, error: currentUserBalanceError } = await supabase
      .from("userAccounts")
      .update({ balance: currentUserObj.balance })
      .eq("id", currentUserId)
      .select();

    if (ownerBalanceError || currentUserBalanceError) {
      throw ownerBalanceError || currentUserBalanceError;
    } else {
      console.log("Balance updated successfully");
    }
  } catch (error) {
    console.error("Error updating balance:", error.message);
  }
}

export async function getUserBalance(id) {
  let { data: userBalance, error: userBalanceError } = await supabase
    .from("userAccounts")
    .select("balance")
    .eq("id", id);

  let balance = userBalance[0].balance;

  let user = JSON.parse(localStorage.getItem("user"));
  user.balance = balance;

  localStorage.setItem("user", JSON.stringify(user));
  if (userBalanceError) {
    console.log(userBalanceError.message);
  }

  return balance;
}

export async function updateUser({ id, newUser }) {
  const { data, error } = await supabase
    .from("userAccounts")
    .update({ ...newUser })
    .eq("id", id)
    .select()
    .single();
  localStorage.setItem("user", JSON.stringify(data));
}

export async function updateUserBalance({ id, balance }) {
  const currentBalance = await getUserBalance(id);
  const newBalance = currentBalance + Number(balance);

  const { data, error } = await supabase
    .from("userAccounts")
    .update({ balance: newBalance })
    .eq("id", id)
    .select()
    .single();

  localStorage.setItem("user", JSON.stringify(data));
}
