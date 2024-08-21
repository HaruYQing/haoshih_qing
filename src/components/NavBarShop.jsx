import styles from "./NavBarShop.module.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const NavBarShop = ({ cartVisible }) => {
  const [productsData, setProductsData] = useState({});
  // console.log("cartVisible",cartVisible);
  const [showLogin, setShowLogin] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // 檢查 localStorage 是否存在指定的 key
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User data from localStorage:", user);
    if (user) {
      setShowLogin(true);
      
    } else {
      setShowLogin(false);
    }
  }, [cartVisible]); // 空陣列表示只在組件掛載時執行一次

  useEffect(() => {
    if (user) {
      const fetchProductsData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3200/carts/${user.uid}`
          );
          setProductsData(response.data);
          // console.log("Products Data:", response.data);
        } catch (error) {
          console.error("Error fetching Products Data:", error);
        }
      };
      fetchProductsData();
    }
  }, [user]);

  const doLogout = async () => {
    try {
      await axios.get("http://localhost:3200/login/logout");
      localStorage.removeItem("user");
      setShowLogin(false);
      window.location.href = "/shop";
    } catch (error) {
      console.error("登出失敗", error);
    }
  };
  // console.log(productsData);
  return (
    <>
      <div className="navBarShop">
        <nav className="navbar navbar-expand p-3 bg-white">
          <div className="container-fluid">
            <a href="/">
              <img
                className={styles.logo}
                src="/images/img/logo.png"
                alt="logo"
              />
            </a>

            <div className="d-flex flex-row bg-white">
              <a className="f-center text-decoration-none" href="/shop">
                <h2 className="c-primary">市</h2>
                <h2 className="c-secondary">集</h2>
                <h2 className="c-lake">商</h2>
                <h2 className="c-pink">城</h2>
              </a>
            </div>
            {showLogin ? (
              <div
                className={`d-flex flex-row justify-content-between align-items-center gap-1`}
              >

              { user.userType === "member" ? (
                <div
                style={{ display: cartVisible ? "visible" : "none" }}
                // style={{ display: "none" }}
              >
                <a
                  className="position-relative text-decoration-none link-dark"
                  href="/ShopCart"
                >
                  <div className="bi bi-cart h2 "></div>
                  <span
                    className={`c-white rounded-circle bg-gray c-black fw-bolder cursor-pointer ${styles.ShopQuantity}`}
                  >
                    {Object.keys(productsData).length}
                  </span>
                </a>
              </div>
              ) : null

              }



                <a
                  className="text-decoration-none c-black"
                  href={`http://localhost:3000/${user.nickname ? "member" : "vendor"}/${user.nickname ? user.uid : user.vid}`}
                  // href="http://localhost:3000/vendor/1"
                >
                  <div className="hover-c-primary fw-bold">
                    {(user.nickname || user.brand_name)+",  你好 !"}
                  </div>
                </a>
                /
                <div
                  className="link-dark text-decoration-none hover-c-red fw-bold cursor-pointer"
                  onClick={doLogout}
                >
                  登出
                </div>
              </div>
            ) : (
              <Link to="/login" style={{ textDecoration: "none" }}>
                <div className={`hover-bg-secondary px-4 ${styles.mallBtn}`}>
                  登入
                </div>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default NavBarShop;
