import toast from "react-hot-toast";
import supabase, { supabaseUrl } from "./supabase";

export async function getProducts() {
  let { data, error } = await supabase.from("products").select("*");

  if (error) {
    throw error;
  }
  return data;
}

export async function postProduct(newProduct) {
  const imageName = `${Math.random()}-${newProduct.productImg.name}`.replaceAll(
    "/",
    ""
  ); // Randomized image name for productImages storage bucket

  const imagePath = `${supabaseUrl}/storage/v1/object/public/productImages/${imageName}`; //Needed when posting a product into products table to reference the picture of the product from productImages bucket in storage
  const userId = JSON.parse(localStorage.getItem("user")).id;

  const { error: storageError } = await supabase.storage
    .from("productImages")
    .upload(imageName, newProduct.productImg); //posting image

  if (storageError) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", data.id);

    throw storageError;
  }

  const { data, error } = await supabase
    .from("products")
    .insert([{ ...newProduct, productImg: imagePath, soldBy: userId }]); //POST query for the product if image was uploaded successfully

  if (error) throw error;
}

export async function getProductById(id) {
  let { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return product;
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function putProductOnSale({ id, currentPrice, onSale }) {
  try {
    let query = supabase.from("products");

    if (onSale === true) {
      const newPrice = currentPrice / (1 - 0.15).toFixed(2);
      query = query
        .update({ productPrice: newPrice, onSale: false })
        .eq("id", id);
    } else {
      const newPrice = Number((currentPrice - currentPrice * 0.15).toFixed(2));
      query = query
        .update({ productPrice: newPrice, onSale: true })
        .eq("id", id);
    }

    const { data, error } = await query.select().single();

    // Check for errors
    if (error && onSale === true) {
      toast.error("Product could not be taken off sale.");
      throw error;
    } else if (error && onSale === false) {
      toast.error("Product could not be listed on sale.");
      throw error;
    } else if (!error && onSale === true) {
      toast.success("Product was successfully taken off sale.");
    } else if (!error && onSale === false) {
      toast.success("Product was successfully listed on sale.");
    }
  } catch (error) {
    console.error("Error updating product price:", error.message);
    throw error;
  }
}

export async function getRating(id) {
  let { data: rating, error } = await supabase
    .from("products")
    .select("productRating")
    .eq("id", id)
    .single();

  return rating;
}

export async function handleVote({ id, currentRating, vote }) {
  const newRating = currentRating + vote; //vote can be positive or negative

  const { data, error } = await supabase
    .from("products")
    .update({ productRating: newRating })
    .eq("id", id)
    .select();
}

export async function getUserProducts(id) {
  let { data: productsOfUser, error } = await supabase
    .from("products")
    .select("*")
    .eq("soldBy", id);

  if (error) {
    alert("Could not get user's products!");
  }
  return productsOfUser;
}
