/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import Services from "../components/Services";
import styles from "./MainPage.module.css";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getUserProducts } from "../API/apiProducts";

function MainPage() {
  const [username, setUsername] = useState("");
  const [userProducts, setUserProducts] = useState([]);

  useEffect(function () {
    //CHECKING IF THERE IS A USER LOGGED IN TO DETERMINE THE VIEW OF THE MAIN PAGE
    async function userProds(id) {
      const userProducts = await getUserProducts(user.id);
      setUserProducts(userProducts);
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (user === null) setUsername("");
    else if (user.username) {
      setUsername(user.username);
      userProds(user.id);
    }
  }, []);

  //PIE CHART DATA

  //GETTING THE AMOUNT OF PRODUCTS SOLD BY USER THAT ARE ON AND OFF SALE
  const onSaleByUser = userProducts.filter(
    (product) => product.onSale === true
  );

  const notOnSaleByUser = userProducts.filter(
    (product) => product.onSale === false
  );

  //PROCESSING DATA TO BE USEABLE BY THE PIE CHART COMPONENT
  const processedUserProductData = [
    {
      name: `Current balance: ${
        JSON.parse(localStorage.getItem("user"))?.balance
      }$`,
      value: 0,
      color: "goldenrod",
    },
    {
      name: "Products not on sale",
      value: notOnSaleByUser.length,
      color: "#003f5c",
    },
    { name: "Products on Sale", value: onSaleByUser.length, color: "#bc5090" },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="80%"
      >
        {`${
          processedUserProductData[index].value === 0
            ? ""
            : processedUserProductData[index].value
        }`}
      </text>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <div className={styles.info}>
          <h2>
            {/* IF THERE IS A USER LOGGED IN, THE WELCOME MESSAGE AND A PIE CHART ON SOLD PRODUCTS BY THE USER IS SHOWN (ONLY IF HE HAS ANY), OTHERWISE JUST PLAIN TEXT */}
            {username !== ""
              ? `Welcome, ${
                  username.charAt(0).toUpperCase() + username.slice(1)
                }`
              : "Welcome to our store!"}
          </h2>

          {username !== "" && userProducts.length !== 0 ? (
            <div className={styles.chart}>
              <PieChart width={600} height={300}>
                <Pie
                  data={processedUserProductData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  innerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={true}
                >
                  {processedUserProductData.map((entry) => (
                    <Cell fill={entry.color} key={entry.name} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="center"
                  align="right"
                  layout="vertical"
                />
              </PieChart>
            </div>
          ) : (
            <p>
              Your one-stop destination for all things, ranging from phone
              accessories to outdoors equipment. Dive into a world of premium
              quality, unparalleled variety, and unbeatable prices. Whether
              you're seeking the latest trends or timeless classics, we've
              curated the perfect collection just for you.
            </p>
          )}
        </div>
        <img src="../../public/2649213.png" className={styles.img} />
      </div>
      <Services />
    </div>
  );
}

export default MainPage;
