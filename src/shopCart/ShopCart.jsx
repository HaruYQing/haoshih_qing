import { Button } from "react-bootstrap";
import MemberSideBar from "../components/MemberSideBar";
import NavBarShop from "../components/NavBarShop";
import SubTitleYellow from "../components/SubTitleYellow";
import ShopCartForm from "./ShopCartForm";
import Footer from "../components/Footer";
import { turnPrice } from "../utils/turnPrice";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShopCart = () => {
  const [productsData, setProductsData] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const cartVisible = true;
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const response = await axios.get(`http://localhost:3200/carts/${user.uid}`);
        setProductsData(response.data);
        // console.log("Products Data:", response.data);
      } catch (error) {
        console.error("Error fetching Products Data:", error);
      }
    };
    fetchProductsData();
  }, []);

  useEffect(() => {
    if (productsData) {
      const newTotal = productsData
        .filter((product) => selectedProducts.has(product.pid))
        .reduce((total, product) => total + product.amount * product.price, 0);
      setTotalPrice(newTotal);
    }
  }, [productsData, selectedProducts]);

  const handleProductCheckChange = (pid, checked) => {
    setSelectedProducts((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (checked) {
        newSelected.add(pid);
      } else {
        newSelected.delete(pid);
      }
      return newSelected;
    });
  };

  const handleProductAmountChange = (pid, newAmount) => {
    setProductsData((prevData) =>
      prevData.map((product) =>
        product.pid === pid ? { ...product, amount: newAmount } : product
      )
    );
  };

  const handleProductDelete = (pid) => {
    setProductsData((prevData) =>
      prevData.filter((product) => product.pid !== pid)
    );
    setSelectedProducts((prevSelected) => {
      const newSelected = new Set(prevSelected);
      newSelected.delete(pid);
      return newSelected;
    });
  };

  const handleCheckout = () => {
    const checkoutData = productsData
      .filter((product) => selectedProducts.has(product.pid))
      .map((product) => ({ pid: product.pid, amount: product.amount }));

    const queryString = new URLSearchParams({
      data: JSON.stringify(checkoutData),
    }).toString();
    // console.log(queryString);
    if (checkoutData.length > 0) {
      navigate(`/Step1?${queryString}`);
    } else {
      alert("請選擇商品!");
    }
  };

  return (
    <>
      <NavBarShop cartVisible={cartVisible} />
      <div className="row">
        <div className="col-2 border-end border-3">
          <MemberSideBar />
        </div>
        <div className="col-10">
          <SubTitleYellow title="購物車" />
          <div className="container">
            {productsData && (
              <ShopCartForm
                productsData={productsData}
                selectedProducts={selectedProducts}
                onProductCheckChange={handleProductCheckChange}
                onProductAmountChange={handleProductAmountChange}
                onProductDelete={handleProductDelete}
              />
            )}
            <div className="f-end-end mt-5 gap-3 sticky-bottom ">
              <h4>總金額：NT{turnPrice(totalPrice)}</h4>

              <Button
                className="rounded-pill px-4 py-2 bg-secondary c-black border border-2"
                onClick={handleCheckout}
              >
                前往結帳
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShopCart;
