import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./SellPage.module.css";
import { useForm } from "react-hook-form";
import {
  useDeleteProduct,
  usePostProducts,
  useProductById,
} from "../services/useProducts";
import Select from "react-select";

function EditPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const { usePostProduct, isPosting } = usePostProducts();

  const [searchParams] = useSearchParams();
  const searchId = searchParams.get("id");
  const { isLoading, product, error } = useProductById(searchId);

  const { deleteProductById, isDeleting } = useDeleteProduct();

  if (isLoading) return isLoading;
  //better not to open categoryOptions...
  const categoryOptions = [
    { value: "Fitness", label: "Fitness" },
    { value: "Health", label: "Health" },
    { value: "Electronics", label: "Electronics" },
    { value: "Books", label: "Books" },
    { value: "Clothing", label: "Clothing" },
    { value: "Toys", label: "Toys" },
    { value: "Beauty", label: "Beauty" },
    { value: "Home", label: "Home" },
    { value: "Garden", label: "Garden" },
    { value: "Sports", label: "Sports" },
    { value: "Automotive", label: "Automotive" },
    { value: "Music", label: "Music" },
    { value: "Movies", label: "Movies" },
    { value: "Software", label: "Software" },
    { value: "Art", label: "Art" },
    { value: "Jewelry", label: "Jewelry" },
    { value: "Furniture", label: "Furniture" },
    { value: "Pet Supplies", label: "Pet Supplies" },
    { value: "Tools", label: "Tools" },
    { value: "Office Supplies", label: "Office Supplies" },
    { value: "Groceries", label: "Groceries" },
    { value: "Toys & Games", label: "Toys & Games" },
    { value: "Health & Personal Care", label: "Health & Personal Care" },
    { value: "Industrial & Scientific", label: "Industrial & Scientific" },
    { value: "Baby", label: "Baby" },
    { value: "Video Games", label: "Video Games" },
    { value: "Outdoors", label: "Outdoors" },
    { value: "Travel", label: "Travel" },
    { value: "Crafts", label: "Crafts" },
    { value: "Hardware", label: "Hardware" },
    { value: "Building Supplies", label: "Building Supplies" },
    { value: "Education", label: "Education" },
    { value: "Photography", label: "Photography" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Watches", label: "Watches" },
    { value: "Musical Instruments", label: "Musical Instruments" },
    { value: "Luggage", label: "Luggage" },
    { value: "Handmade", label: "Handmade" },
    { value: "Apps & Games", label: "Apps & Games" },
    { value: "Kitchen", label: "Kitchen" },
    { value: "Appliances", label: "Appliances" },
    { value: "Lighting", label: "Lighting" },
    { value: "Cleaning Supplies", label: "Cleaning Supplies" },
    { value: "Agricultural Supplies", label: "Agricultural Supplies" },
    { value: "Cell Phones & Accessories", label: "Cell Phones & Accessories" },
    { value: "Drones", label: "Drones" },
    { value: "Wearable Technology", label: "Wearable Technology" },
    { value: "3D Printing", label: "3D Printing" },
    { value: "Smart Home", label: "Smart Home" },
    { value: "Collectibles", label: "Collectibles" },
    { value: "Antiques", label: "Antiques" },
    { value: "Holiday & Seasonal", label: "Holiday & Seasonal" },
    { value: "Event Supplies", label: "Event Supplies" },
    { value: "Office Furniture", label: "Office Furniture" },
    { value: "Safety & Security", label: "Safety & Security" },
    { value: "Business", label: "Business" },
    { value: "Insurance", label: "Insurance" },
    { value: "Investments", label: "Investments" },
    { value: "Legal", label: "Legal" },
    { value: "Consulting", label: "Consulting" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Marketing", label: "Marketing" },
    { value: "Retail", label: "Retail" },
    { value: "Accounting", label: "Accounting" },
    { value: "Finance", label: "Finance" },
    { value: "Sales", label: "Sales" },
    { value: "Training", label: "Training" },
    { value: "IT Services", label: "IT Services" },
    { value: "Legal Services", label: "Legal Services" },
    { value: "Media", label: "Media" },
    { value: "Telecommunications", label: "Telecommunications" },
    { value: "Transportation", label: "Transportation" },
    { value: "Public Safety", label: "Public Safety" },
    { value: "Environment", label: "Environment" },
    { value: "Social Services", label: "Social Services" },
    { value: "Government", label: "Government" },
    { value: "Politics", label: "Politics" },
    { value: "Non-Profit", label: "Non-Profit" },
    { value: "Religious", label: "Religious" },
    { value: "Military", label: "Military" },
    { value: "History", label: "History" },
    { value: "Geography", label: "Geography" },
    { value: "Anthropology", label: "Anthropology" },
    { value: "Psychology", label: "Psychology" },
    { value: "Sociology", label: "Sociology" },
    { value: "Philosophy", label: "Philosophy" },
    { value: "Literature", label: "Literature" },
    { value: "Linguistics", label: "Linguistics" },
    { value: "Architecture", label: "Architecture" },
    { value: "Engineering", label: "Engineering" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" },
    { value: "Biology", label: "Biology" },
    { value: "Astronomy", label: "Astronomy" },
    { value: "Meteorology", label: "Meteorology" },
    { value: "Geology", label: "Geology" },
    { value: "Oceanography", label: "Oceanography" },
    { value: "Paleontology", label: "Paleontology" },
    { value: "Space Exploration", label: "Space Exploration" },
    { value: "Adventure", label: "Adventure" },
    { value: "Hobbies", label: "Hobbies" },
    { value: "Luxury", label: "Luxury" },
    { value: "Ethics", label: "Ethics" },
    { value: "Mythology", label: "Mythology" },
    { value: "Folklore", label: "Folklore" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Science Fiction", label: "Science Fiction" },
    { value: "Mystery", label: "Mystery" },
    { value: "Horror", label: "Horror" },
    { value: "Thriller", label: "Thriller" },
    { value: "Comedy", label: "Comedy" },
    { value: "Drama", label: "Drama" },
    { value: "Romance", label: "Romance" },
    { value: "Action", label: "Action" },
    { value: "Biography", label: "Biography" },
    { value: "Autobiography", label: "Autobiography" },
    { value: "Memoir", label: "Memoir" },
    { value: "Travel Writing", label: "Travel Writing" },
    { value: "Self-Help", label: "Self-Help" },
    { value: "Cookbooks", label: "Cookbooks" },
    { value: "Poetry", label: "Poetry" },
    { value: "Essays", label: "Essays" },
    { value: "Anthologies", label: "Anthologies" },
    { value: "Short Stories", label: "Short Stories" },
    { value: "Historical Fiction", label: "Historical Fiction" },
    { value: "Realistic Fiction", label: "Realistic Fiction" },
    { value: "Young Adult", label: "Young Adult" },
    { value: "Children’s", label: "Children’s" },
  ];

  function onSubmit(data) {
    const image = data.productImg[0];
    const categories = data.productCategories.map((option) => option.value);
    console.log(image);
    usePostProduct({
      ...data,
      productImg: image,
      productCategories: categories,
    });
    deleteProductById(searchId);
    navigate("/browse");
  }

  function onError(err) {
    console.log("PRODLEM WITH EDITING: ", err.message);
  }
  return (
    <div className={styles.container}>
      <Link to={-1}>Cancel</Link>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit, onError)}>
        <label htmlFor="name">Edit the name of your product</label>
        <input
          id="name"
          type="text"
          defaultValue={product.productName}
          placeholder="Bench press machine..."
          {...register("productName", {
            required: true,
          })}
        />
        <label htmlFor="price">Edit the price of your product</label>
        <input
          id="price"
          type="text"
          defaultValue={product.productPrice}
          placeholder="254.22..."
          {...register("productPrice", {
            required: true,
            valueAsNumber: true,
          })}
        />
        <label htmlFor="category">
          Choose the new categories of your product
        </label>
        <Select
          isMulti={true}
          options={categoryOptions}
          onChange={(selectedOptions) =>
            setValue("productCategories", selectedOptions)
          }
        />

        {/* <input
          id="category"
          type="text"
          placeholder="Fitness..."
          {...register("productCategory", {
            required: true,
          })}
        /> */}
        <label htmlFor="description">
          Edit the description of your product
        </label>
        <input
          id="description"
          type="text"
          defaultValue={product.productDesc}
          placeholder="Enter product's description"
          {...register("productDesc", {
            required: true,
          })}
        />
        <label htmlFor="image">Enter reference image for your product</label>
        <input
          id="image"
          type="file"
          placeholder=""
          {...register("productImg", {
            required: true,
          })}
        />
        <button type="submit">Release for sale</button>
      </form>
    </div>
  );
}

export default EditPage;
